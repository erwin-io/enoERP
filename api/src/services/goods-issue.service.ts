import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GOODSISSUE_ERROR_NOT_FOUND } from "src/common/constant/goods-issue.constant";
import {
  NOTIF_TITLE,
  NOTIF_TYPE,
} from "src/common/constant/notifications.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { WAREHOUSE_ERROR_NOT_FOUND } from "src/common/constant/warehouse.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateGoodsIssueDto } from "src/core/dto/goods-issue/goods-issue.create.dto";
import {
  UpdateGoodsIssueDto,
  UpdateGoodsIssueStatusDto,
} from "src/core/dto/goods-issue/goods-issue.update.dto";
import { PageAccess } from "src/core/models/api-response.model";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsIssueItem } from "src/db/entities/GoodsIssueItem";
import { Item } from "src/db/entities/Item";
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Notifications } from "src/db/entities/Notifications";
import { Users } from "src/db/entities/Users";
import { Warehouse } from "src/db/entities/Warehouse";
import { EntityManager, Not, Repository } from "typeorm";
import { PusherService } from "./pusher.service";

const deafaultGoodsIssueSelect = {
  goodsIssueId: true,
  goodsIssueCode: true,
  description: true,
  dateCreated: true,
  dateLastUpdated: true,
  status: true,
  inventoryAdjustmentReports: true,
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
  goodsIssueItems: {
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
    goodsIssue: true,
  },
  issueType: true,
};
@Injectable()
export class GoodsIssueService {
  constructor(
    @InjectRepository(GoodsIssue)
    private readonly goodsIssueRepo: Repository<GoodsIssue>,
    private pusherService: PusherService
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.goodsIssueRepo.find({
        select: deafaultGoodsIssueSelect as any,
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
          inventoryAdjustmentReports: true,
          goodsIssueItems: {
            item: {
              itemCategory: true,
            },
          },
        },
      }),
      this.goodsIssueRepo.count({
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

  async getByCode(goodsIssueCode) {
    const result = await this.goodsIssueRepo.findOne({
      where: {
        goodsIssueCode,
        active: true,
      },
      relations: {
        createdByUser: true,
        inventoryAdjustmentReports: true,
        warehouse: true,
        goodsIssueItems: {
          item: {
            itemCategory: true,
          },
          goodsIssue: true,
        },
      },
    });
    if (!result) {
      throw Error(GOODSISSUE_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateGoodsIssueDto) {
    return await this.goodsIssueRepo.manager.transaction(
      async (entityManager) => {
        let goodsIssue = new GoodsIssue();
        const createdByUser = await entityManager.findOne(Users, {
          where: {
            userId: dto.createdByUserId,
            active: true,
          },
        });
        if (!createdByUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        goodsIssue.createdByUser = createdByUser;
        const warehouse = await entityManager.findOne(Warehouse, {
          where: {
            warehouseCode: dto.warehouseCode,
            active: true,
          },
        });
        if (!warehouse) {
          throw Error(WAREHOUSE_ERROR_NOT_FOUND);
        }
        goodsIssue.warehouse = warehouse;

        goodsIssue.description = dto.description;
        goodsIssue.issueType = dto.issueType;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        goodsIssue.dateCreated = timestamp;
        goodsIssue = await entityManager.save(GoodsIssue, goodsIssue);
        goodsIssue.goodsIssueCode = generateIndentityCode(
          goodsIssue.goodsIssueId
        );
        dto.goodsIssueItems = dto.goodsIssueItems.reduce((acc, cur) => {
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
        for (const item of dto.goodsIssueItems) {
          let newItem = new GoodsIssueItem();
          newItem.item = await entityManager.findOne(Item, {
            where: { itemId: item.itemId },
          });
          newItem.quantity = item.quantity.toString();
          newItem.goodsIssue = goodsIssue;
          newItem = await entityManager.save(GoodsIssueItem, newItem);

          let itemWarehouse = await entityManager.findOne(ItemWarehouse, {
            where: {
              itemId: item.itemId,
              warehouse: {
                warehouseId: goodsIssue.warehouse.warehouseId,
              },
            },
          });
          const newQuantity =
            Number(itemWarehouse.quantity) - Number(item.quantity);
          if (Number(item.quantity) > Number(itemWarehouse.quantity)) {
            throw Error(
              "Goods issue quantity exceeds current item warehouse quantity"
            );
          }
          itemWarehouse.quantity = newQuantity.toString();
          itemWarehouse = await entityManager.save(
            ItemWarehouse,
            itemWarehouse
          );
        }
        goodsIssue = await entityManager.save(GoodsIssue, goodsIssue);
        goodsIssue = await entityManager.findOne(GoodsIssue, {
          where: {
            goodsIssueId: goodsIssue.goodsIssueId,
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

        let getUsersToBeNotified = await entityManager.find(Users, {
          where: {
            userId: Not(goodsIssue.createdByUser.userId),
            branch: {
              isMainBranch: true,
              active: true,
            },
            access: {
              active: true,
            },
            active: true,
          },
          relations: {
            branch: true,
            access: true,
          },
        });
        getUsersToBeNotified = getUsersToBeNotified
          .map((x) => {
            return {
              user: x,
              access: x.access.accessPages as PageAccess[],
            };
          })
          .filter(
            (x) =>
              x.access.length > 0 &&
              x.access.some((x) => x.page === "Goods Issue") &&
              x.access.some(
                (x) => x.rights && x.rights.some((r) => r === "Approval")
              )
          )
          .map((x) => x.user);
        await this.logNotification(
          getUsersToBeNotified,
          goodsIssue,
          entityManager,
          NOTIF_TITLE.GOODS_ISSUE_CREATED,
          goodsIssue.description
        );
        await this.pusherService.reSync("GOODS_ISSUE", null);
        return goodsIssue;
      }
    );
  }

  async update(goodsIssueCode, dto: UpdateGoodsIssueDto) {
    return await this.goodsIssueRepo.manager.transaction(
      async (entityManager) => {
        let goodsIssue = await entityManager.findOne(GoodsIssue, {
          where: {
            goodsIssueCode,
            active: true,
          },
          relations: {
            createdByUser: {
              branch: true,
            },
            warehouse: true,
            inventoryAdjustmentReports: true,
          },
        });
        if (!goodsIssue) {
          throw Error(GOODSISSUE_ERROR_NOT_FOUND);
        }
        if (
          goodsIssue.inventoryAdjustmentReports &&
          goodsIssue.inventoryAdjustmentReports.length > 0
        ) {
          throw Error(
            "Not allowed to update goods issue, goods issue document was generated via adjustment confirmation"
          );
        }
        if (goodsIssue.status !== "PENDING") {
          throw Error(
            "Not allowed to update goods issue, goods issue was already being - processed"
          );
        }

        const lastUpdatedByUser = await entityManager.findOne(Users, {
          where: {
            userId: dto.updatedByUserId,
            active: true,
          },
        });
        if (!lastUpdatedByUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        goodsIssue.lastUpdatedByUser = lastUpdatedByUser;

        goodsIssue.description = dto.description;
        goodsIssue.issueType = dto.issueType;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        goodsIssue.dateLastUpdated = timestamp;

        dto.goodsIssueItems = dto.goodsIssueItems.reduce((acc, cur) => {
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

        //get current items and remove items not in dto.inventoryAdjustmentReportItems
        let originalGoodsIssueItems = await entityManager.find(GoodsIssueItem, {
          where: {
            goodsIssue: {
              goodsIssueId: goodsIssue.goodsIssueId,
            },
          },
          relations: {
            goodsIssue: {},
            item: {
              itemCategory: true,
            },
          },
        });
        //get item to removed from adjustment
        originalGoodsIssueItems = originalGoodsIssueItems.filter(
          (x) => !dto.goodsIssueItems.some((i) => i.itemId === x.item.itemId)
        );
        //re-stock removed item quantity to item warehouse table
        for (const item of originalGoodsIssueItems) {
          const itemWarehouse = await entityManager.findOne(ItemWarehouse, {
            where: {
              itemId: item.itemId,
              warehouse: {
                warehouseCode: goodsIssue.warehouse.warehouseCode,
              },
            },
          });
          const newItemWarehouseQuantity =
            Number(itemWarehouse.quantity) + Number(item.quantity);
          itemWarehouse.quantity =
            newItemWarehouseQuantity >= 0
              ? newItemWarehouseQuantity.toString()
              : "0";

          await entityManager.save(ItemWarehouse, itemWarehouse);
        }
        if (originalGoodsIssueItems.length > 0) {
          await entityManager.delete(GoodsIssueItem, originalGoodsIssueItems);
        }
        //update items
        for (const item of dto.goodsIssueItems) {
          let isNew = false;
          if (isNaN(item.quantity) || item.quantity <= 0) {
            throw Error("Invalid returned quantity");
          }
          let goodsIssueItem = await entityManager.findOne(GoodsIssueItem, {
            where: {
              itemId: item.itemId,
              goodsIssueId: goodsIssue.goodsIssueId,
            },
          });
          if (!goodsIssueItem) {
            isNew = true;
            goodsIssueItem = new GoodsIssueItem();
            goodsIssueItem.item = await entityManager.findOne(Item, {
              where: { itemId: item.itemId },
            });
            goodsIssueItem.quantity = item.quantity.toString();
          }
          goodsIssueItem.goodsIssue = goodsIssue;
          const origGoodsIssueQuantity = goodsIssueItem.quantity;
          goodsIssueItem.quantity = item.quantity.toString();
          goodsIssueItem = await entityManager.save(
            GoodsIssueItem,
            goodsIssueItem
          );
          const itemWarehouse = await entityManager.findOne(ItemWarehouse, {
            where: {
              itemId: item.itemId,
              warehouse: { warehouseCode: goodsIssue.warehouse.warehouseCode },
            },
          });
          if (isNew) {
            const newItemWarehouseQuantity =
              Number(itemWarehouse.quantity) - Number(goodsIssueItem.quantity);
            if (newItemWarehouseQuantity < 0) {
              throw Error("Quantity exceeds current item warehouse quantity");
            }
            itemWarehouse.quantity =
              newItemWarehouseQuantity >= 0
                ? newItemWarehouseQuantity.toString()
                : "0";
          } else {
            const oldItemWarehouseQuantity =
              Number(itemWarehouse.quantity) + Number(origGoodsIssueQuantity);
            const newItemWarehouseQuantity =
              oldItemWarehouseQuantity - Number(item.quantity);

            if (newItemWarehouseQuantity < 0) {
              throw Error("Quantity exceeds current item warehouse quantity");
            }
            itemWarehouse.quantity =
              newItemWarehouseQuantity >= 0
                ? newItemWarehouseQuantity.toString()
                : "0";
          }
          await entityManager.save(ItemWarehouse, itemWarehouse);
        }
        //end update items

        goodsIssue = await entityManager.save(GoodsIssue, goodsIssue);
        goodsIssue = await entityManager.findOne(GoodsIssue, {
          where: {
            goodsIssueId: goodsIssue.goodsIssueId,
          },
          relations: {
            inventoryAdjustmentReports: true,
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
        delete goodsIssue.lastUpdatedByUser.password;
        await this.syncRealTime(goodsIssue);
        return goodsIssue;
      }
    );
  }

  async updateStatus(goodsIssueCode, dto: UpdateGoodsIssueStatusDto) {
    return await this.goodsIssueRepo.manager.transaction(
      async (entityManager) => {
        const { status } = dto;
        let goodsIssue = await entityManager.findOne(GoodsIssue, {
          select: deafaultGoodsIssueSelect as any,
          where: {
            goodsIssueCode,
            active: true,
          },
          relations: {
            inventoryAdjustmentReports: true,
            warehouse: true,
            createdByUser: true,
            goodsIssueItems: {
              goodsIssue: true,
              item: {
                itemCategory: true,
              },
            },
          },
        });
        if (!goodsIssue) {
          throw Error(GOODSISSUE_ERROR_NOT_FOUND);
        }
        if (
          goodsIssue.status === "COMPLETED" ||
          goodsIssue.status === "CANCELLED" ||
          goodsIssue.status === "REJECTED"
        ) {
          throw Error(
            "Not allowed to update status, goods issue was already - " +
              goodsIssue.status.toLowerCase()
          );
        }
        if (goodsIssue.status === "REJECTED") {
          throw Error(
            "Not allowed to update status, goods issue was already being - " +
              goodsIssue.status.toLowerCase()
          );
        }
        if (goodsIssue.status === "PENDING") {
          if (status === "PENDING") {
            throw Error(
              "Not allowed to update status, goods issue was already - " +
                goodsIssue.status.toLowerCase()
            );
          }
        }
        if (
          status === "CANCELLED" ||
          status === "REJECTED" ||
          status === "COMPLETED"
        ) {
          goodsIssue.notes = dto["notes"];
        }
        delete goodsIssue.goodsIssueItems;
        goodsIssue.status = status;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        goodsIssue.dateLastUpdated = timestamp;

        const lastUpdatedByUser = await entityManager.findOne(Users, {
          where: {
            userId: dto.updatedByUserId,
            active: true,
          },
        });
        if (!lastUpdatedByUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        goodsIssue.lastUpdatedByUser = lastUpdatedByUser;

        goodsIssue = await entityManager.save(GoodsIssue, goodsIssue);
        goodsIssue = await entityManager.findOne(GoodsIssue, {
          where: {
            goodsIssueId: goodsIssue.goodsIssueId,
          },
          relations: {
            inventoryAdjustmentReports: true,
            createdByUser: {
              branch: true,
            },
            lastUpdatedByUser: {
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
        delete goodsIssue.lastUpdatedByUser.password;
        if (status === "CANCELLED" || status === "REJECTED") {
          for (const item of goodsIssue.goodsIssueItems) {
            let itemWarehouse = await entityManager.findOne(ItemWarehouse, {
              where: {
                itemId: item.item.itemId,
                warehouse: {
                  warehouseId: goodsIssue.warehouse.warehouseId,
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
        let getUsersToBeNotified = await entityManager.find(Users, {
          where: {
            userId: goodsIssue.createdByUser.userId,
            access: {
              active: true,
            },
            active: true,
          },
          relations: {
            branch: true,
            access: true,
          },
        });
        getUsersToBeNotified = getUsersToBeNotified
          .map((x) => {
            return {
              user: x,
              access: x.access.accessPages as PageAccess[],
            };
          })
          .filter(
            (x) =>
              x.access.length > 0 &&
              x.access.some((x) => x.page === "Goods Issue") &&
              x.access.some(
                (x) => x.rights && x.rights.some((r) => r === "Approval")
              )
          )
          .map((x) => x.user);
        let title = "Goods issue";
        let description = "Goods issue description";
        if (status === "COMPLETED") {
          title = NOTIF_TITLE.GOODS_ISSUE_COMPLETED;
          description = `Goods issue #${goodsIssue.goodsIssueCode} is now completed`;
        } else if (status === "REJECTED") {
          title = NOTIF_TITLE.GOODS_ISSUE_REJECTED;
          description = `Goods issue #${goodsIssue.goodsIssueCode} was rejected`;
        }
        await this.logNotification(
          getUsersToBeNotified,
          goodsIssue,
          entityManager,
          title,
          description
        );
        await this.syncRealTime(goodsIssue);
        return goodsIssue;
      }
    );
  }

  async logNotification(
    users: Users[],
    goodsIssue: GoodsIssue,
    entityManager: EntityManager,
    title: string,
    description: string
  ) {
    const notifications: Notifications[] = [];

    for (const user of users) {
      notifications.push({
        title,
        description,
        type: NOTIF_TYPE.GOODS_ISSUE.toString(),
        referenceId: goodsIssue.goodsIssueCode.toString(),
        isRead: false,
        user: user,
      } as Notifications);
    }
    await entityManager.save(Notifications, notifications);
    await this.pusherService.sendNotif(
      users.map((x) => x.userId),
      title,
      description
    );
  }

  async syncRealTime(goodsIssue: GoodsIssue) {
    const users = await this.goodsIssueRepo.manager.find(Users, {
      where: {
        userId: Not(goodsIssue.lastUpdatedByUser.userId),
        active: true,
        branch: {
          isMainBranch: true,
          active: true,
        },
      },
    });
    await this.pusherService.goodsIssueChanges(
      users.map((x) => x.userId),
      goodsIssue
    );
  }
}
