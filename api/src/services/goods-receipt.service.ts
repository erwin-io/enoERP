import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GOODSRECEIPT_ERROR_NOT_FOUND } from "src/common/constant/goods-receipt.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { WAREHOUSE_ERROR_NOT_FOUND } from "src/common/constant/warehouse.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateGoodsReceiptDto } from "src/core/dto/goods-receipt/goods-receipt.create.dto";
import {
  UpdateGoodsReceiptDto,
  UpdateGoodsReceiptStatusDto,
} from "src/core/dto/goods-receipt/goods-receipt.update.dto";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { GoodsReceiptItem } from "src/db/entities/GoodsReceiptItem";
import { Item } from "src/db/entities/Item";
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Users } from "src/db/entities/Users";
import { Warehouse } from "src/db/entities/Warehouse";
import { Repository } from "typeorm";

const deafaultGoodsReceiptSelect = {
  goodsReceiptId: true,
  goodsReceiptCode: true,
  description: true,
  dateCreated: true,
  dateLastUpdated: true,
  status: true,
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
  warehouse: {
    warehouseId: true,
    warehouseCode: true,
    name: true,
  },
  goodsReceiptItems: {
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
    quantity: true,
    goodsReceipt: true,
  },
};
@Injectable()
export class GoodsReceiptService {
  constructor(
    @InjectRepository(GoodsReceipt)
    private readonly goodsReceiptRepo: Repository<GoodsReceipt>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.goodsReceiptRepo.find({
        select: deafaultGoodsReceiptSelect as any,
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
        relations: {
          createdByUser: {
            branch: true,
          },
          warehouse: true,
          goodsReceiptItems: {
            item: {
              itemCategory: true,
            },
          },
        },
      }),
      this.goodsReceiptRepo.count({
        where: {
          ...condition,
          active: true,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getByCode(goodsReceiptCode) {
    const result = await this.goodsReceiptRepo.findOne({
      where: {
        goodsReceiptCode,
        active: true,
      },
      relations: {
        createdByUser: true,
        warehouse: true,
        goodsReceiptItems: {
          item: {
            itemCategory: true,
          },
        },
      },
    });
    if (!result) {
      throw Error(GOODSRECEIPT_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateGoodsReceiptDto) {
    return await this.goodsReceiptRepo.manager.transaction(
      async (entityManager) => {
        let goodsReceipt = new GoodsReceipt();
        const createdByUser = await entityManager.findOne(Users, {
          where: {
            userId: dto.createdByUserId,
            active: true,
          },
        });
        if (!createdByUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        goodsReceipt.createdByUser = createdByUser;
        const warehouse = await entityManager.findOne(Warehouse, {
          where: {
            warehouseCode: dto.warehouseCode,
            active: true,
          },
        });
        if (!warehouse) {
          throw Error(WAREHOUSE_ERROR_NOT_FOUND);
        }
        goodsReceipt.warehouse = warehouse;
        goodsReceipt.description = dto.description;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        goodsReceipt.dateCreated = timestamp;
        goodsReceipt = await entityManager.save(GoodsReceipt, goodsReceipt);
        goodsReceipt.goodsReceiptCode = generateIndentityCode(
          goodsReceipt.goodsReceiptId
        );
        dto.goodsReceiptItems = dto.goodsReceiptItems.reduce((acc, cur) => {
          const item =
            acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
          if (item) {
            item.quantity = Number(item.quantity) + Number(cur.quantity);
          } else
            acc.push({
              itemId: cur.itemId,
              quantity: cur.quantity,
            });
          return acc;
        }, []);
        for (const item of dto.goodsReceiptItems) {
          let newItem = new GoodsReceiptItem();
          newItem.item = await entityManager.findOne(Item, {
            where: { itemId: item.itemId },
          });
          newItem.quantity = item.quantity.toString();
          newItem.goodsReceipt = goodsReceipt;
          newItem = await entityManager.save(GoodsReceiptItem, newItem);
        }
        goodsReceipt = await entityManager.save(GoodsReceipt, goodsReceipt);
        goodsReceipt = await entityManager.findOne(GoodsReceipt, {
          where: {
            goodsReceiptId: goodsReceipt.goodsReceiptId,
          },
          relations: {
            createdByUser: {
              branch: true,
            },
            warehouse: true,
            goodsReceiptItems: {
              item: {
                itemCategory: true,
              },
            },
          },
        });
        delete goodsReceipt.createdByUser.password;
        return goodsReceipt;
      }
    );
  }

  async update(goodsReceiptCode, dto: UpdateGoodsReceiptDto) {
    return await this.goodsReceiptRepo.manager.transaction(
      async (entityManager) => {
        let goodsReceipt = await entityManager.findOne(GoodsReceipt, {
          where: {
            goodsReceiptCode,
            active: true,
          },
          relations: {
            createdByUser: {
              branch: true,
            },
            warehouse: true,
          },
        });
        if (!goodsReceipt) {
          throw Error(GOODSRECEIPT_ERROR_NOT_FOUND);
        }
        if (goodsReceipt.status !== "PENDING") {
          throw Error(
            "Not allowed to update request, goods receipt was already being - processed"
          );
        }
        goodsReceipt.description = dto.description;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        goodsReceipt.dateLastUpdated = timestamp;

        dto.goodsReceiptItems = dto.goodsReceiptItems.reduce((acc, cur) => {
          const item =
            acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
          if (item) {
            item.quantity = Number(item.quantity) + Number(cur.quantity);
          } else
            acc.push({
              itemId: cur.itemId,
              quantity: cur.quantity,
            });
          return acc;
        }, []);

        //update items
        for (const item of dto.goodsReceiptItems) {
          let goodsReceiptItem = await entityManager.findOne(GoodsReceiptItem, {
            where: {
              itemId: item.itemId,
              goodsReceiptId: goodsReceipt.goodsReceiptId,
            },
          });
          if (!goodsReceiptItem) {
            goodsReceiptItem = new GoodsReceiptItem();
            goodsReceiptItem.item = await entityManager.findOne(Item, {
              where: { itemId: item.itemId },
            });
            goodsReceiptItem.goodsReceiptId = goodsReceipt.goodsReceiptId;
          }
          goodsReceiptItem.quantity = item.quantity.toString();
          goodsReceiptItem = await entityManager.save(
            GoodsReceiptItem,
            goodsReceiptItem
          );
        }

        let originalGoodsReceiptItems = await entityManager.find(
          GoodsReceiptItem,
          {
            where: {
              goodsReceiptId: goodsReceipt.goodsReceiptId,
            },
            relations: {
              item: true,
            },
          }
        );

        originalGoodsReceiptItems = originalGoodsReceiptItems.filter(
          (x) => !dto.goodsReceiptItems.some((i) => i.itemId === x.item.itemId)
        );
        if (originalGoodsReceiptItems.length > 0) {
          await entityManager.delete(
            GoodsReceiptItem,
            originalGoodsReceiptItems
          );
        }
        //end update items

        goodsReceipt = await entityManager.save(GoodsReceipt, goodsReceipt);
        goodsReceipt = await entityManager.findOne(GoodsReceipt, {
          where: {
            goodsReceiptId: goodsReceipt.goodsReceiptId,
          },
          relations: {
            createdByUser: {
              branch: true,
            },
            warehouse: true,
            goodsReceiptItems: {
              item: {
                itemCategory: true,
              },
            },
          },
        });
        delete goodsReceipt.createdByUser.password;
        return goodsReceipt;
      }
    );
  }

  async updateStatus(goodsReceiptCode, dto: UpdateGoodsReceiptStatusDto) {
    return await this.goodsReceiptRepo.manager.transaction(
      async (entityManager) => {
        const { status } = dto;
        let goodsReceipt = await entityManager.findOne(GoodsReceipt, {
          select: deafaultGoodsReceiptSelect as any,
          where: {
            goodsReceiptCode,
            active: true,
          },
          relations: {
            warehouse: true,
            createdByUser: true,
            goodsReceiptItems: {
              goodsReceipt: true,
              item: {
                itemCategory: true,
              },
            },
          },
        });
        if (!goodsReceipt) {
          throw Error(GOODSRECEIPT_ERROR_NOT_FOUND);
        }
        if (
          goodsReceipt.status === "COMPLETED" ||
          goodsReceipt.status === "CANCELLED" ||
          goodsReceipt.status === "REJECTED"
        ) {
          throw Error(
            "Not allowed to update status, goods receipt was already - " +
              goodsReceipt.status.toLowerCase()
          );
        }
        if (goodsReceipt.status === "REJECTED") {
          throw Error(
            "Not allowed to update status, goods receipt was already being - " +
              goodsReceipt.status.toLowerCase()
          );
        }
        if (goodsReceipt.status === "PENDING") {
          if (status === "PENDING") {
            throw Error(
              "Not allowed to update status, goods receipt was already - " +
                goodsReceipt.status.toLowerCase()
            );
          }
        }
        if (
          status === "CANCELLED" ||
          status === "REJECTED" ||
          status === "COMPLETED"
        ) {
          goodsReceipt.notes = dto["notes"];
        }
        delete goodsReceipt.goodsReceiptItems;
        goodsReceipt.status = status;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        goodsReceipt.dateLastUpdated = timestamp;
        goodsReceipt = await entityManager.save(GoodsReceipt, goodsReceipt);
        goodsReceipt = await entityManager.findOne(GoodsReceipt, {
          where: {
            goodsReceiptId: goodsReceipt.goodsReceiptId,
          },
          relations: {
            createdByUser: {
              branch: true,
            },
            warehouse: true,
            goodsReceiptItems: {
              item: {
                itemCategory: true,
              },
            },
          },
        });
        delete goodsReceipt.createdByUser.password;
        //complete goods receipt update warehouse stocks
        if (status === "COMPLETED") {
          for (const item of goodsReceipt.goodsReceiptItems) {
            let itemWarehouse = await entityManager.findOne(ItemWarehouse, {
              where: {
                itemId: item.item.itemId,
                warehouse: {
                  warehouseId: goodsReceipt.warehouse.warehouseId,
                },
              },
            });
            const newQuantity =
              Number(itemWarehouse.quantity) + Number(item.quantity);
            itemWarehouse.quantity = newQuantity.toString();
            itemWarehouse = await entityManager.save(
              ItemWarehouse,
              itemWarehouse
            );
          }
        }
        return goodsReceipt;
      }
    );
  }
}
