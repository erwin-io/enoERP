import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BRANCH_ERROR_NOT_FOUND } from "src/common/constant/branch.constant";
import { INVENTORYADJUSTMENTREPORT_ERROR_NOT_FOUND } from "src/common/constant/inventory-adjustment-report.constant";
import {
  INVENTORYREQUEST_ERROR_ADJUSTMENT_NOT_ALLOWED_,
  INVENTORYREQUEST_ERROR_NOT_FOUND,
} from "src/common/constant/inventory-request.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { WAREHOUSE_ERROR_NOT_FOUND } from "src/common/constant/warehouse.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateInventoryAdjustmentReportDto } from "src/core/dto/inventory-adjustment-report/inventory-adjustment-report.create.dto";
import {
  CloseInventoryAdjustmentReportStatusDto,
  ProcessInventoryAdjustmentReportStatusDto,
  UpdateInventoryAdjustmentReportDto,
} from "src/core/dto/inventory-adjustment-report/inventory-adjustment-report.update.dto";
import { Branch } from "src/db/entities/Branch";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsIssueItem } from "src/db/entities/GoodsIssueItem";
import { InventoryAdjustmentReport } from "src/db/entities/InventoryAdjustmentReport";
import { InventoryAdjustmentReportItem } from "src/db/entities/InventoryAdjustmentReportItem";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { InventoryRequestItem } from "src/db/entities/InventoryRequestItem";
import { Item } from "src/db/entities/Item";
import { ItemBranch } from "src/db/entities/ItemBranch";
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Users } from "src/db/entities/Users";
import { Warehouse } from "src/db/entities/Warehouse";
import { EntityManager, In, Repository } from "typeorm";

const deafaultInventoryAdjustmentReportSelect = {
  inventoryAdjustmentReportId: true,
  inventoryAdjustmentReportCode: true,
  reportType: true,
  description: true,
  dateReported: true,
  dateLastUpdated: true,
  reportStatus: true,
  notes: true,
  reportedByUser: {
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
  inventoryAdjustmentReportItems: {
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
    returnedQuantity: true,
    proposedUnitReturnRate: true,
    totalRefund: true,
    inventoryAdjustmentReport: {
      inventoryAdjustmentReportId: true,
      inventoryAdjustmentReportCode: true,
    },
    inventoryAdjustmentReportId: true,
  },
};
@Injectable()
export class InventoryAdjustmentReportService {
  constructor(
    @InjectRepository(InventoryAdjustmentReport)
    private readonly inventoryAdjustmentReportRepo: Repository<InventoryAdjustmentReport>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.inventoryAdjustmentReportRepo.find({
        select: deafaultInventoryAdjustmentReportSelect as any,
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
        relations: {
          reportedByUser: {
            branch: true,
          },
          branch: true,
          inventoryAdjustmentReportItems: {
            item: {
              itemCategory: true,
            },
          },
        },
      }),
      this.inventoryAdjustmentReportRepo.count({
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

  async getByCode(inventoryAdjustmentReportCode) {
    const result = await this.inventoryAdjustmentReportRepo.findOne({
      select: deafaultInventoryAdjustmentReportSelect as any,
      where: {
        inventoryAdjustmentReportCode,
        active: true,
      },
      relations: {
        reportedByUser: {
          branch: true,
        },
        branch: true,
        inventoryRequest: {
          branch: true,
          fromWarehouse: true,
          inventoryRequestItems: {
            item: {
              itemCategory: true,
            },
          },
        },
        inventoryAdjustmentReportItems: {
          item: {
            itemCategory: true,
          },
        },
      },
    });
    if (!result) {
      throw Error(INVENTORYADJUSTMENTREPORT_ERROR_NOT_FOUND);
    }
    result.inventoryAdjustmentReportItems =
      await await this.inventoryAdjustmentReportRepo.manager.find(
        InventoryAdjustmentReportItem,
        {
          where: {
            inventoryAdjustmentReport: {
              inventoryAdjustmentReportCode:
                result.inventoryAdjustmentReportCode,
            },
          },
          relations: {
            item: {
              itemCategory: true,
            },
            inventoryAdjustmentReport: true,
          },
        }
      );
    return result;
  }

  async create(dto: CreateInventoryAdjustmentReportDto) {
    return await this.inventoryAdjustmentReportRepo.manager.transaction(
      async (entityManager) => {
        let inventoryAdjustmentReport = new InventoryAdjustmentReport();

        const inventoryRequest = await entityManager.findOne(InventoryRequest, {
          where: {
            inventoryRequestCode: dto.inventoryRequestCode,
            active: true,
          },
          relations: {
            branch: true,
            inventoryRequestItems: {
              item: {
                itemCategory: true,
              },
            },
            fromWarehouse: true,
          },
        });
        if (!inventoryRequest) {
          throw Error(INVENTORYREQUEST_ERROR_NOT_FOUND);
        }
        if (inventoryRequest.requestStatus !== "COMPLETED") {
          throw Error(INVENTORYREQUEST_ERROR_ADJUSTMENT_NOT_ALLOWED_);
        }
        inventoryAdjustmentReport.inventoryRequest = inventoryRequest;

        const reportedByUser = await entityManager.findOne(Users, {
          where: {
            userId: dto.reportedByUserId,
            active: true,
          },
        });
        if (!reportedByUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        inventoryAdjustmentReport.reportedByUser = reportedByUser;
        const branch = await entityManager.findOne(Branch, {
          where: {
            branchId: inventoryRequest.branch.branchId,
            active: true,
          },
        });
        if (!branch) {
          throw Error(BRANCH_ERROR_NOT_FOUND);
        }
        inventoryAdjustmentReport.branch = branch;
        inventoryAdjustmentReport.description = dto.description;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        inventoryAdjustmentReport.dateReported = timestamp;
        inventoryAdjustmentReport.reportType = dto.reportType;
        //save adjustment report document header
        inventoryAdjustmentReport = await entityManager.save(
          InventoryAdjustmentReport,
          inventoryAdjustmentReport
        );
        //add report code
        inventoryAdjustmentReport.inventoryAdjustmentReportCode =
          generateIndentityCode(
            inventoryAdjustmentReport.inventoryAdjustmentReportId
          );

        //add items
        dto.inventoryAdjustmentReportItems =
          dto.inventoryAdjustmentReportItems.reduce((acc, cur) => {
            const item =
              acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
            if (item) {
              item.quantity =
                Number(item.quantity) + Number(cur.returnedQuantity);
            } else
              acc.push({
                itemId: cur.itemId,
                returnedQuantity: cur.returnedQuantity,
              });
            return acc;
          }, []);
        for (const item of dto.inventoryAdjustmentReportItems) {
          let newItem = new InventoryAdjustmentReportItem();
          newItem.item = await entityManager.findOne(Item, {
            where: { itemId: item.itemId },
          });

          newItem.inventoryAdjustmentReport = inventoryAdjustmentReport;
          newItem.returnedQuantity = item.returnedQuantity.toString();
          newItem = await entityManager.save(
            InventoryAdjustmentReportItem,
            newItem
          );
          newItem = await entityManager.findOne(InventoryAdjustmentReportItem, {
            where: {
              item: {
                itemId: item.itemId,
              },
              inventoryAdjustmentReport: {
                inventoryAdjustmentReportCode:
                  inventoryAdjustmentReport.inventoryAdjustmentReportCode,
              },
            },
          });
          //get current row item inventory requested item and update total received quantity
          const inventoryRequestItem = await entityManager.findOne(
            InventoryRequestItem,
            {
              where: {
                item: {
                  itemId: item.itemId,
                },
                inventoryRequest: {
                  inventoryRequestCode: inventoryRequest.inventoryRequestCode,
                },
              },
            }
          );
          if (!inventoryRequestItem) {
            throw Error("Inventory request item not found");
          }
          if (
            Number(item.returnedQuantity) >
            Number(inventoryRequestItem.quantity)
          ) {
            throw Error(
              "Total returned quantity is more thant the total inventory requested item quantity"
            );
          }
          const newQuantityReceived =
            Number(inventoryRequestItem.quantityReceived) -
            Number(item.returnedQuantity);
          inventoryRequestItem.quantityReceived =
            newQuantityReceived >= 0 ? newQuantityReceived.toString() : "0";
          await entityManager.save(InventoryRequestItem, inventoryRequestItem);
          //get item branch and update item branch quantity stock
          //new item branch stock(newItemBrancQuantity) = current item branch stock (itemBranch.quantity) - totalReturnedQuantity
          const itemBranch = await entityManager.findOne(ItemBranch, {
            where: {
              item: {
                itemId: item.itemId,
              },
              branch: {
                branchId: inventoryRequest.branch.branchId,
              },
            },
          });

          const newItemBrancQuantity =
            Number(itemBranch.quantity) - item.returnedQuantity;
          itemBranch.quantity =
            newItemBrancQuantity >= 0 ? newItemBrancQuantity.toString() : "0";
          await entityManager.save(ItemBranch, itemBranch);
          //next item row
        }
        //re-save report
        inventoryAdjustmentReport = await entityManager.save(
          InventoryAdjustmentReport,
          inventoryAdjustmentReport
        );
        //get final and return
        inventoryAdjustmentReport = await entityManager.findOne(
          InventoryAdjustmentReport,
          {
            select: deafaultInventoryAdjustmentReportSelect as any,
            where: {
              inventoryAdjustmentReportId:
                inventoryAdjustmentReport.inventoryAdjustmentReportId,
            },
            relations: {
              reportedByUser: {
                branch: true,
              },
              branch: true,
              inventoryAdjustmentReportItems: {
                item: {
                  itemCategory: true,
                },
              },
            },
          }
        );
        inventoryAdjustmentReport.inventoryAdjustmentReportItems =
          await entityManager.find(InventoryAdjustmentReportItem, {
            where: {
              inventoryAdjustmentReport: {
                inventoryAdjustmentReportCode:
                  inventoryAdjustmentReport.inventoryAdjustmentReportCode,
              },
            },
          });
        return inventoryAdjustmentReport;
      }
    );
  }

  async update(
    inventoryAdjustmentReportCode,
    dto: UpdateInventoryAdjustmentReportDto
  ) {
    return await this.inventoryAdjustmentReportRepo.manager.transaction(
      async (entityManager) => {
        let inventoryAdjustmentReport = await entityManager.findOne(
          InventoryAdjustmentReport,
          {
            where: {
              inventoryAdjustmentReportCode,
              active: true,
            },
            relations: {
              reportedByUser: {
                branch: true,
              },
              branch: true,
              inventoryRequest: {
                inventoryRequestItems: {
                  item: {
                    itemCategory: true,
                  },
                },
                fromWarehouse: true,
                requestedByUser: true,
                branch: true,
              },
            },
          }
        );
        if (!inventoryAdjustmentReport) {
          throw Error(INVENTORYADJUSTMENTREPORT_ERROR_NOT_FOUND);
        }
        if (
          !["PENDING", "REVIEWED"].some(
            (x) => x === inventoryAdjustmentReport.reportStatus
          )
        ) {
          throw Error(
            "Not allowed to update request, the request was already being - processed"
          );
        }
        if (inventoryAdjustmentReport.reportStatus === "REVIEWED") {
          inventoryAdjustmentReport.reportStatus = "PENDING";
        }
        inventoryAdjustmentReport.description = dto.description;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        inventoryAdjustmentReport.dateLastUpdated = timestamp;

        dto.inventoryAdjustmentReportItems =
          dto.inventoryAdjustmentReportItems.reduce((acc, cur) => {
            const item =
              acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
            if (item) {
              item.quantity =
                Number(item.quantity) + Number(cur.returnedQuantity);
            } else
              acc.push({
                itemId: cur.itemId,
                returnedQuantity: cur.returnedQuantity,
              });
            return acc;
          }, []);

        //get current items and remove items not in dto.inventoryAdjustmentReportItems
        let originalAdjustmentReportItems = await entityManager.find(
          InventoryAdjustmentReportItem,
          {
            where: {
              inventoryAdjustmentReport: {
                inventoryAdjustmentReportId:
                  inventoryAdjustmentReport.inventoryAdjustmentReportId,
              },
            },
            relations: {
              inventoryAdjustmentReport: {
                inventoryRequest: true,
              },
              item: {
                itemCategory: true,
              },
            },
          }
        );
        //get item to removed from adjustment
        originalAdjustmentReportItems = originalAdjustmentReportItems.filter(
          (x) =>
            !dto.inventoryAdjustmentReportItems.some(
              (i) => i.itemId === x.item.itemId
            )
        );
        //re-stock removed item quantity to itemBranch table
        for (const item of originalAdjustmentReportItems) {
          const itemBranch = await entityManager.findOne(ItemBranch, {
            where: {
              itemId: item.itemId,
              branch: {
                branchId: inventoryAdjustmentReport.branch.branchId,
              },
            },
          });
          const newItemBranchQuantity =
            Number(itemBranch.quantity) + Number(item.returnedQuantity);
          itemBranch.quantity =
            newItemBranchQuantity >= 0 ? newItemBranchQuantity.toString() : "0";

          await entityManager.save(ItemBranch, itemBranch);
        }
        if (originalAdjustmentReportItems.length > 0) {
          await entityManager.delete(
            InventoryAdjustmentReportItem,
            originalAdjustmentReportItems
          );
        }

        //update items
        for (const item of dto.inventoryAdjustmentReportItems) {
          let isNew = false;
          if (isNaN(item.returnedQuantity) || item.returnedQuantity <= 0) {
            throw Error("Invalid returned quantity");
          }
          let inventoryAdjustmentReportItem = await entityManager.findOne(
            InventoryAdjustmentReportItem,
            {
              where: {
                itemId: item.itemId,
                inventoryAdjustmentReportId:
                  inventoryAdjustmentReport.inventoryAdjustmentReportId,
              },
              relations: {
                inventoryAdjustmentReport: true,
              },
            }
          );
          if (!inventoryAdjustmentReportItem) {
            isNew = true;
            inventoryAdjustmentReportItem = new InventoryAdjustmentReportItem();
            inventoryAdjustmentReportItem.item = await entityManager.findOne(
              Item,
              {
                where: { itemId: item.itemId },
              }
            );
            inventoryAdjustmentReportItem.returnedQuantity =
              item.returnedQuantity.toString();
          }
          inventoryAdjustmentReportItem.inventoryAdjustmentReport =
            inventoryAdjustmentReport;
          const origReturnedQuantity =
            inventoryAdjustmentReportItem.returnedQuantity;
          inventoryAdjustmentReportItem.returnedQuantity =
            item.returnedQuantity.toString();
          inventoryAdjustmentReportItem = await entityManager.save(
            InventoryAdjustmentReportItem,
            inventoryAdjustmentReportItem
          );

          const itemBranch = await entityManager.findOne(ItemBranch, {
            where: {
              itemId: item.itemId,
              branch: { branchId: inventoryAdjustmentReport.branch.branchId },
            },
          });
          if (isNew) {
            const newItemBranchQuantity =
              Number(itemBranch.quantity) -
              Number(inventoryAdjustmentReportItem.returnedQuantity);
            if (newItemBranchQuantity < 0) {
              throw Error("Quantity exceeds current branch inventory quantity");
            }
            itemBranch.quantity =
              newItemBranchQuantity >= 9
                ? newItemBranchQuantity.toString()
                : "0";
          } else {
            const oldItemBrancQuantity =
              Number(itemBranch.quantity) + Number(origReturnedQuantity);
            const newItemBranchQuantity =
              oldItemBrancQuantity - Number(item.returnedQuantity);
            if (newItemBranchQuantity < 0) {
              throw Error("Quantity exceeds current branch inventory quantity");
            }
            itemBranch.quantity =
              newItemBranchQuantity >= 0
                ? newItemBranchQuantity.toString()
                : "0";
          }
          await entityManager.save(ItemBranch, itemBranch);

          //get current row item inventory requested item and update total received quantity
          const inventoryRequestItem = await entityManager.findOne(
            InventoryRequestItem,
            {
              where: {
                item: {
                  itemId: item.itemId,
                },
                inventoryRequest: {
                  inventoryRequestCode:
                    inventoryAdjustmentReport.inventoryRequest
                      .inventoryRequestCode,
                },
              },
            }
          );
          if (!inventoryRequestItem) {
            throw Error("Inventory request item not found");
          }
          const oldQuantityReceived =
            Number(inventoryRequestItem.quantityReceived) +
            Number(origReturnedQuantity);
          const newQuantityReceived =
            oldQuantityReceived - Number(item.returnedQuantity);
          if (newQuantityReceived > Number(inventoryRequestItem.quantity)) {
            throw Error(
              "Total received quantity is more thant the total inventory requested item quantity"
            );
          }
          if (newQuantityReceived < 0) {
            throw Error("Total received quantity results to negative");
          }
          inventoryRequestItem.quantityReceived =
            newQuantityReceived.toString();
          await entityManager.save(InventoryRequestItem, inventoryRequestItem);
          //next item row
        }

        inventoryAdjustmentReport = await entityManager.save(
          InventoryAdjustmentReport,
          inventoryAdjustmentReport
        );
        inventoryAdjustmentReport = await entityManager.findOne(
          InventoryAdjustmentReport,
          {
            select: deafaultInventoryAdjustmentReportSelect as any,
            where: {
              inventoryAdjustmentReportId:
                inventoryAdjustmentReport.inventoryAdjustmentReportId,
            },
            relations: {
              reportedByUser: {
                branch: true,
              },
              branch: true,
              inventoryAdjustmentReportItems: {
                item: {
                  itemCategory: true,
                },
              },
            },
          }
        );
        return inventoryAdjustmentReport;
      }
    );
  }

  async updateStatus(
    inventoryAdjustmentReportCode,
    dto:
      | ProcessInventoryAdjustmentReportStatusDto
      | CloseInventoryAdjustmentReportStatusDto
  ) {
    return await this.inventoryAdjustmentReportRepo.manager.transaction(
      async (entityManager) => {
        const { status } = dto;
        let inventoryAdjustmentReport = await entityManager.findOne(
          InventoryAdjustmentReport,
          {
            where: {
              inventoryAdjustmentReportCode,
              active: true,
            },
            relations: {
              branch: true,
              reportedByUser: true,
              inventoryAdjustmentReportItems: {
                inventoryAdjustmentReport: true,
                item: {
                  itemCategory: true,
                },
              },
              inventoryRequest: {
                inventoryRequestItems: {
                  item: {
                    itemCategory: true,
                  },
                },
              },
            },
          }
        );
        if (!inventoryAdjustmentReport) {
          throw Error(INVENTORYADJUSTMENTREPORT_ERROR_NOT_FOUND);
        }
        if (
          inventoryAdjustmentReport.reportStatus === "CLOSED" ||
          inventoryAdjustmentReport.reportStatus === "CANCELLED" ||
          inventoryAdjustmentReport.reportStatus === "REJECTED"
        ) {
          throw Error(
            "Not allowed to update status, the request was already - " +
              inventoryAdjustmentReport.reportStatus.toLowerCase()
          );
        }
        if (inventoryAdjustmentReport.reportStatus === "COMPLETED") {
          if (
            ["PENDING", "REJECTED", "REVIEWED", "CANCELLED", "REVIEWED"].some(
              (x) => x.toUpperCase() === status.toUpperCase()
            )
          ) {
            throw Error(
              "Not allowed to update status, the request was already - " +
                inventoryAdjustmentReport.reportStatus.toLowerCase()
            );
          }
        }
        if (inventoryAdjustmentReport.reportStatus === "REVIEWED") {
          if (
            ["PENDING"].some((x) => x.toUpperCase() === status.toUpperCase())
          ) {
            throw Error(
              "Not allowed to update status, the request was already - " +
                inventoryAdjustmentReport.reportStatus.toLowerCase()
            );
          }
        }
        if (inventoryAdjustmentReport.reportStatus === "REJECTED") {
          throw Error(
            "Not allowed to update status, the request was already being - " +
              inventoryAdjustmentReport.reportStatus.toLowerCase()
          );
        }
        if (inventoryAdjustmentReport.reportStatus === "PENDING") {
          if (status === "PENDING") {
            throw Error(
              "Not allowed to update status, the request was already - " +
                inventoryAdjustmentReport.reportStatus.toLowerCase()
            );
          }
          if (
            ["COMPLETED", "CLOSED"].some(
              (x) => x.toUpperCase() === status.toUpperCase()
            )
          ) {
            throw Error(
              "Not allowed to update status, the request was not yet reviewed"
            );
          }
        }
        if (status === "CANCELLED" || status === "REJECTED") {
          inventoryAdjustmentReport.inventoryAdjustmentReportItems =
            await entityManager.find(InventoryAdjustmentReportItem, {
              where: {
                inventoryAdjustmentReport: {
                  inventoryAdjustmentReportCode,
                  active: true,
                },
              },
              relations: {
                item: {
                  itemCategory: true,
                },
                inventoryAdjustmentReport: true,
              },
            });
          for (const item of inventoryAdjustmentReport.inventoryAdjustmentReportItems) {
            //get current row item inventory requested item and update total received quantity
            const inventoryRequestItem = await entityManager.findOne(
              InventoryRequestItem,
              {
                where: {
                  item: {
                    itemId: item.itemId,
                  },
                  inventoryRequest: {
                    inventoryRequestCode:
                      inventoryAdjustmentReport.inventoryRequest
                        .inventoryRequestCode,
                  },
                },
              }
            );
            if (!inventoryRequestItem) {
              throw Error("Inventory request item not found");
            }
            const newQuantityReceived =
              Number(inventoryRequestItem.quantityReceived) +
              Number(item.returnedQuantity);
            inventoryRequestItem.quantityReceived =
              newQuantityReceived.toString();
            await entityManager.save(
              InventoryRequestItem,
              inventoryRequestItem
            );

            const itemBranch = await entityManager.findOne(ItemBranch, {
              where: {
                itemId: item.item.itemId,
                branch: { branchId: inventoryAdjustmentReport.branch.branchId },
              },
            });
            const newItemBranchQuantity =
              Number(itemBranch.quantity) + Number(item.returnedQuantity);
            itemBranch.quantity =
              newItemBranchQuantity >= 0
                ? newItemBranchQuantity.toString()
                : "0";
            await entityManager.save(ItemBranch, itemBranch);
          }
        }
        if (
          status === "CANCELLED" ||
          status === "REJECTED" ||
          status === "CLOSED"
        ) {
          inventoryAdjustmentReport.notes = dto["notes"];
        }
        if (status === "REVIEWED") {
          for (const item of dto.inventoryAdjustmentReportItems) {
            const inventoryAdjustmentReportItem = await entityManager.findOne(
              InventoryAdjustmentReportItem,
              {
                where: {
                  item: {
                    itemId: item.itemId,
                  },
                  inventoryAdjustmentReport: {
                    inventoryAdjustmentReportCode,
                    active: true,
                  },
                },
                relations: {
                  item: {
                    itemCategory: true,
                  },
                  inventoryAdjustmentReport: true,
                },
              }
            );
            if (!inventoryAdjustmentReportItem) {
              throw Error(
                "Invalid item, item not found on inventory request items"
              );
            }
            inventoryAdjustmentReportItem.proposedUnitReturnRate =
              item.proposedUnitReturnRate.toString();
            const totalRefund =
              Number(inventoryAdjustmentReportItem.proposedUnitReturnRate) *
              Number(inventoryAdjustmentReportItem.returnedQuantity);
            inventoryAdjustmentReportItem.totalRefund = totalRefund.toString();
            await entityManager.save(
              InventoryAdjustmentReportItem,
              inventoryAdjustmentReportItem
            );
          }
        }
        inventoryAdjustmentReport.reportStatus = status;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        inventoryAdjustmentReport.dateLastUpdated = timestamp;
        delete inventoryAdjustmentReport.inventoryAdjustmentReportItems;
        inventoryAdjustmentReport = await entityManager.save(
          InventoryAdjustmentReport,
          inventoryAdjustmentReport
        );
        if (status === "CLOSED") {
          const goodsIssue = await this.createGoodsIssue(
            entityManager,
            inventoryAdjustmentReport.inventoryAdjustmentReportCode
          );
          if (!goodsIssue) {
            throw new Error("Error saving goods issue");
          }
          inventoryAdjustmentReport.goodsIssue = goodsIssue;
          inventoryAdjustmentReport = await entityManager.save(
            InventoryAdjustmentReport,
            inventoryAdjustmentReport
          );
        }
        inventoryAdjustmentReport = await entityManager.findOne(
          InventoryAdjustmentReport,
          {
            select: deafaultInventoryAdjustmentReportSelect as any,
            where: {
              inventoryAdjustmentReportId:
                inventoryAdjustmentReport.inventoryAdjustmentReportId,
            },
            relations: {
              reportedByUser: {
                branch: true,
              },
              branch: true,
              inventoryAdjustmentReportItems: {
                item: {
                  itemCategory: true,
                },
              },
            },
          }
        );
        return inventoryAdjustmentReport;
      }
    );
  }

  async createGoodsIssue(
    entityManager: EntityManager,
    inventoryAdjustmentReportCode: string
  ) {
    const inventoryAdjustmentReport = await entityManager.findOne(
      InventoryAdjustmentReport,
      {
        where: {
          inventoryAdjustmentReportCode,
        },
        relations: {
          inventoryRequest: {
            fromWarehouse: true,
            branch: true,
          },
          reportedByUser: true,
          branch: true,
          inventoryAdjustmentReportItems: {
            item: {
              itemCategory: true,
            },
          },
        },
      }
    );
    let goodsIssue = new GoodsIssue();
    const createdByUser = await entityManager.findOne(Users, {
      where: {
        userId: inventoryAdjustmentReport.reportedByUser.userId,
        active: true,
      },
    });
    if (!createdByUser) {
      throw Error(USER_ERROR_USER_NOT_FOUND);
    }
    goodsIssue.createdByUser = createdByUser;
    const warehouse = await entityManager.findOne(Warehouse, {
      where: {
        warehouseCode:
          inventoryAdjustmentReport.inventoryRequest.fromWarehouse
            .warehouseCode,
        active: true,
      },
    });
    if (!warehouse) {
      throw Error(WAREHOUSE_ERROR_NOT_FOUND);
    }
    goodsIssue.warehouse = warehouse;
    goodsIssue.description = inventoryAdjustmentReport.description;
    goodsIssue.issueType = inventoryAdjustmentReport.reportType;
    const timestamp = await entityManager
      .query(CONST_QUERYCURRENT_TIMESTAMP)
      .then((res) => {
        return res[0]["timestamp"];
      });
    goodsIssue.dateCreated = timestamp;
    goodsIssue = await entityManager.save(GoodsIssue, goodsIssue);
    goodsIssue.goodsIssueCode = generateIndentityCode(goodsIssue.goodsIssueId);
    for (const item of inventoryAdjustmentReport.inventoryAdjustmentReportItems) {
      let newItem = new GoodsIssueItem();
      newItem.item = await entityManager.findOne(Item, {
        where: { itemId: item.itemId },
      });
      newItem.quantity = item.returnedQuantity.toString();
      newItem.goodsIssue = goodsIssue;
      newItem = await entityManager.save(GoodsIssueItem, newItem);
    }
    goodsIssue = await entityManager.save(GoodsIssue, goodsIssue);
    goodsIssue = await entityManager.findOne(GoodsIssue, {
      where: {
        goodsIssueCode: goodsIssue.goodsIssueCode,
      },
      relations: {
        createdByUser: {
          branch: true,
        },
        warehouse: true,
        goodsIssueItems: {
          item: {
            itemCategory: true,
          },
        },
      },
    });
    delete goodsIssue.createdByUser.password;
    return goodsIssue;
  }
}
