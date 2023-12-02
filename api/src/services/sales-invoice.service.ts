import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SALESINVOICE_ERROR_NOT_FOUND } from "src/common/constant/sales-invoice.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateSalesInvoiceDto } from "src/core/dto/sales-invoice/sales-invoice.create.dto";
import { Item } from "src/db/entities/Item";
import { ItemBranch } from "src/db/entities/ItemBranch";
import { SalesInvoice } from "src/db/entities/SalesInvoice";
import { SalesInvoiceItem } from "src/db/entities/SalesInvoiceItem";
import { Users } from "src/db/entities/Users";
import { Branch } from "src/db/entities/Branch";
import { Repository } from "typeorm";
import { BRANCH_ERROR_NOT_FOUND } from "src/common/constant/branch.constant";
import { SalesInvoicePayments } from "src/db/entities/SalesInvoicePayments";

const deafaultSalesInvoiceSelect = {
  salesInvoiceId: true,
  salesInvoiceCode: true,
  salesDate: true,
  isVoid: true,
  dateLastUpdated: true,
  totalAmount: true,
  createdByUser: {
    userId: true,
    userName: true,
    fullName: true,
    userCode: true,
    branch: {
      branchId: true,
      branchCode: true,
      name: true,
    },
  },
  branch: {
    branchId: true,
    branchCode: true,
    name: true,
  },
  salesInvoicePayments: {
    paymentType: true,
    amount: true,
  },
  salesInvoiceItems: {
    salesInvoiceId: true,
    itemId: true,
    item: {
      itemId: true,
      itemCode: true,
      itemName: true,
      itemDescription: true,
      itemCategory: {
        itemCategoryId: true,
        name: true,
        description: true,
      },
    },
    unitPrice: true,
    quantity: true,
    amount: true,
    salesInvoice: true,
  },
};
@Injectable()
export class SalesInvoiceService {
  constructor(
    @InjectRepository(SalesInvoice)
    private readonly salesInvoiceRepo: Repository<SalesInvoice>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.salesInvoiceRepo.find({
        select: deafaultSalesInvoiceSelect as any,
        where: condition,
        skip,
        take,
        order,
        relations: {
          salesInvoicePayments: true,
          branch: true,
          createdByUser: {
            branch: true,
          },
          salesInvoiceItems: {
            item: {
              itemCategory: true,
            },
          },
        },
      }),
      this.salesInvoiceRepo.count({
        where: condition,
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getByCode(salesInvoiceCode) {
    const result = await this.salesInvoiceRepo.findOne({
      where: {
        salesInvoiceCode,
      },
      relations: {
        salesInvoicePayments: true,
        createdByUser: true,
        branch: true,
        salesInvoiceItems: {
          item: {
            itemCategory: true,
          },
          salesInvoice: true,
        },
      },
    });
    if (!result) {
      throw Error(SALESINVOICE_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateSalesInvoiceDto) {
    return await this.salesInvoiceRepo.manager.transaction(
      async (entityManager) => {
        let salesInvoice = new SalesInvoice();
        const createdByUser = await entityManager.findOne(Users, {
          where: {
            userId: dto.createdByUserId,
            active: true,
          },
        });
        if (!createdByUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        salesInvoice.createdByUser = createdByUser;
        const branch = await entityManager.findOne(Branch, {
          where: {
            branchId: dto.branchId,
            active: true,
          },
        });
        if (!branch) {
          throw Error(BRANCH_ERROR_NOT_FOUND);
        }
        salesInvoice.branch = branch;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        salesInvoice.salesDate = timestamp;
        salesInvoice = await entityManager.save(SalesInvoice, salesInvoice);
        salesInvoice.salesInvoiceCode = generateIndentityCode(
          salesInvoice.salesInvoiceId
        );

        dto.salesInvoicePayments = dto.salesInvoicePayments.reduce(
          (acc, cur) => {
            const paymentRow =
              acc.length > 0 &&
              acc.find(({ paymentType }) => paymentType === cur.paymentType);
            if (paymentRow) {
              paymentRow.amount =
                Number(paymentRow.amount) + Number(cur.amount);
            } else
              acc.push({
                paymentType: cur.paymentType,
                amount: cur.amount ? Number(cur.amount) : 0,
              });
            return acc;
          },
          []
        );

        for (const item of dto.salesInvoicePayments) {
          let payment = new SalesInvoicePayments();
          if (
            !item.paymentType ||
            item.paymentType.toString() === "" ||
            ![
              "CASH",
              "CREDIT CARD",
              "DEBIT CARD",
              "MOBILE PAYMENT",
              "CHECK",
            ].some((x) => x === item.paymentType)
          ) {
            throw Error("Invalid payment type!");
          }
          if (item.amount <= 0) {
            throw Error("Payment amount must not be less than or zero!");
          }
          payment.amount = item.amount.toString();
          payment.paymentType = item.paymentType;
          payment.salesInvoice = salesInvoice;
          payment = await entityManager.save(SalesInvoicePayments, payment);
        }
        salesInvoice.salesInvoicePayments = await entityManager.find(
          SalesInvoicePayments,
          {
            where: {
              salesInvoice: {
                salesInvoiceId: salesInvoice.salesInvoiceId,
              },
            },
          }
        );
        dto.salesInvoiceItems = dto.salesInvoiceItems.reduce((acc, cur) => {
          const item =
            acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
          if (item) {
            item.quantity = Number(item.quantity) + Number(cur.quantity);
          } else
            acc.push({
              itemId: cur.itemId,
              quantity: cur.quantity ? Number(cur.quantity) : 0,
              unitPrice:
                cur.unitPrice && cur.unitPrice !== ""
                  ? Number(cur.unitPrice)
                  : 0,
            });
          return acc;
        }, []);
        for (const item of dto.salesInvoiceItems) {
          let newItem = new SalesInvoiceItem();
          newItem.item = await entityManager.findOne(Item, {
            where: { itemId: item.itemId },
          });
          if (item.quantity <= 0) {
            throw Error("Quantity must not be less than or zero!");
          }
          if (item.unitPrice <= 0) {
            throw Error("Unit price must not be less than or zero!");
          }
          newItem.quantity = item.quantity.toString();
          newItem.unitPrice = item.unitPrice.toString();
          const amount = item.quantity * item.unitPrice;
          newItem.amount = amount.toString();
          newItem.salesInvoice = salesInvoice;
          newItem = await entityManager.save(SalesInvoiceItem, newItem);

          let itemBranch = await entityManager.findOne(ItemBranch, {
            where: {
              itemId: item.itemId,
              branch: {
                branchId: salesInvoice.branch.branchId,
              },
            },
          });
          const newQuantity =
            Number(itemBranch.quantity) - Number(item.quantity);
          if (Number(item.quantity) > Number(itemBranch.quantity)) {
            throw Error(
              "Goods issue quantity exceeds current item branch quantity"
            );
          }
          itemBranch.quantity = newQuantity.toString();
          itemBranch = await entityManager.save(ItemBranch, itemBranch);
        }
        salesInvoice.salesInvoiceItems = await entityManager.find(
          SalesInvoiceItem,
          {
            where: {
              salesInvoice: {
                salesInvoiceId: salesInvoice.salesInvoiceId,
              },
            },
          }
        );
        const totalAmount = salesInvoice.salesInvoiceItems
          .map((x) => Number(x.amount))
          .reduce(function (curr, prev) {
            return curr + prev;
          });
        salesInvoice.totalAmount = totalAmount.toString();
        salesInvoice = await entityManager.save(SalesInvoice, salesInvoice);
        salesInvoice = await entityManager.findOne(SalesInvoice, {
          where: {
            salesInvoiceId: salesInvoice.salesInvoiceId,
          },
          relations: {
            salesInvoicePayments: true,
            createdByUser: {
              branch: true,
            },
            branch: true,
            salesInvoiceItems: {
              item: {
                itemCategory: true,
              },
            },
          },
        });
        delete salesInvoice.createdByUser.password;
        return salesInvoice;
      }
    );
  }

  async void(salesInvoiceCode) {
    return await this.salesInvoiceRepo.manager.transaction(
      async (entityManager) => {
        let salesInvoice = await entityManager.findOne(SalesInvoice, {
          select: deafaultSalesInvoiceSelect as any,
          where: {
            salesInvoiceCode,
            isVoid: false,
          },
          relations: {
            branch: true,
            salesInvoicePayments: true,
            createdByUser: true,
            salesInvoiceItems: {
              salesInvoice: true,
              item: {
                itemCategory: true,
              },
            },
          },
        });
        if (!salesInvoice) {
          throw Error(SALESINVOICE_ERROR_NOT_FOUND);
        }
        for (const item of salesInvoice.salesInvoiceItems) {
          let itemBranch = await entityManager.findOne(ItemBranch, {
            where: {
              itemId: item.item.itemId,
              branch: {
                branchId: salesInvoice.branch.branchId,
              },
            },
          });
          const newQuantity =
            Number(itemBranch.quantity) + Number(item.quantity);
          itemBranch.quantity = newQuantity.toString();
          itemBranch = await entityManager.save(ItemBranch, itemBranch);
        }
        delete salesInvoice.salesInvoiceItems;
        delete salesInvoice.salesInvoicePayments;
        salesInvoice.isVoid = true;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        salesInvoice.dateLastUpdated = timestamp;
        salesInvoice = await entityManager.save(SalesInvoice, salesInvoice);
        salesInvoice = await entityManager.findOne(SalesInvoice, {
          where: {
            salesInvoiceId: salesInvoice.salesInvoiceId,
          },
          relations: {
            salesInvoicePayments: true,
            createdByUser: {
              branch: true,
            },
            branch: true,
            salesInvoiceItems: {
              item: {
                itemCategory: true,
              },
            },
          },
        });
        delete salesInvoice.createdByUser.password;
        return salesInvoice;
      }
    );
  }
}
