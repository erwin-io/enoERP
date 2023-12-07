import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { stat } from "fs";
import { BRANCH_ERROR_NOT_FOUND } from "src/common/constant/branch.constant";
import { INVENTORYREQUESTRATE_ERROR_NOT_FOUND } from "src/common/constant/inventory-request-rate.constant";
import { INVENTORYREQUEST_ERROR_NOT_FOUND } from "src/common/constant/inventory-request.constant";
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
import { CreateInventoryRequestDto } from "src/core/dto/inventory-request/inventory-request.create.dto";
import {
  CloseInventoryRequestStatusDto,
  ProcessInventoryRequestStatusDto,
  UpdateInventoryRequestDto,
} from "src/core/dto/inventory-request/inventory-request.update.dto";
import { PageAccess } from "src/core/models/api-response.model";
import { Branch } from "src/db/entities/Branch";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { InventoryRequestItem } from "src/db/entities/InventoryRequestItem";
import { InventoryRequestRate } from "src/db/entities/InventoryRequestRate";
import { Item } from "src/db/entities/Item";
import { ItemBranch } from "src/db/entities/ItemBranch";
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Notifications } from "src/db/entities/Notifications";
import { Users } from "src/db/entities/Users";
import { Warehouse } from "src/db/entities/Warehouse";
import { EntityManager, In, Not, Repository } from "typeorm";
import { PusherService } from "./pusher.service";

const deafaultInventoryRequestSelect = {
  inventoryRequestId: true,
  inventoryRequestCode: true,
  description: true,
  dateRequested: true,
  dateLastUpdated: true,
  requestStatus: true,
  requestedByUser: {
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
  inventoryRequestItems: {
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
    inventoryRequest: true,
    totalAmount: true,
    inventoryRequestRate: true,
    quantityReceived: true,
  },
  fromWarehouse: true,
};
@Injectable()
export class InventoryRequestService {
  constructor(
    @InjectRepository(InventoryRequest)
    private readonly inventoryRequestRepo: Repository<InventoryRequest>,
    private pusherService: PusherService
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.inventoryRequestRepo.find({
        select: deafaultInventoryRequestSelect as any,
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
        relations: {
          requestedByUser: {
            branch: true,
          },
          branch: true,
          inventoryRequestItems: {
            item: {
              itemCategory: true,
            },
            inventoryRequestRate: true,
          },
          fromWarehouse: true,
        },
      }),
      this.inventoryRequestRepo.count({
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

  async getByCode(inventoryRequestCode) {
    const result = await this.inventoryRequestRepo.findOne({
      where: {
        inventoryRequestCode,
        active: true,
      },
      relations: {
        requestedByUser: {
          branch: true,
        },
        branch: true,
        inventoryRequestItems: {
          item: {
            itemCategory: true,
          },
          inventoryRequestRate: true,
        },
        fromWarehouse: true,
      },
    });
    if (!result) {
      throw Error(INVENTORYREQUEST_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateInventoryRequestDto) {
    return await this.inventoryRequestRepo.manager.transaction(
      async (entityManager) => {
        let inventoryRequest = new InventoryRequest();
        const requestedByUser = await entityManager.findOne(Users, {
          where: {
            userId: dto.requestedByUserId,
            active: true,
          },
        });
        if (!requestedByUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        inventoryRequest.requestedByUser = requestedByUser;
        const branch = await entityManager.findOne(Branch, {
          where: {
            branchId: dto.branchId,
            active: true,
          },
        });
        if (!branch) {
          throw Error(BRANCH_ERROR_NOT_FOUND);
        }
        inventoryRequest.branch = branch;
        const fromWarehouse = await entityManager.findOne(Warehouse, {
          where: {
            warehouseCode: dto.fromWarehouseCode,
            active: true,
          },
        });
        if (!branch) {
          throw Error(WAREHOUSE_ERROR_NOT_FOUND);
        }
        inventoryRequest.fromWarehouse = fromWarehouse;
        inventoryRequest.description = dto.description;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        inventoryRequest.dateRequested = timestamp;
        inventoryRequest = await entityManager.save(
          InventoryRequest,
          inventoryRequest
        );
        inventoryRequest.inventoryRequestCode = generateIndentityCode(
          inventoryRequest.inventoryRequestId
        );
        dto.inventoryRequestItems = dto.inventoryRequestItems.reduce(
          (acc, cur) => {
            const item =
              acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
            if (item) {
              item.quantity = Number(item.quantity) + Number(cur.quantity);
            } else
              acc.push({
                itemId: cur.itemId,
                inventoryRequestRateCode: cur.inventoryRequestRateCode,
                quantity: cur.quantity,
              });
            return acc;
          },
          []
        );
        for (const item of dto.inventoryRequestItems) {
          let newItem = new InventoryRequestItem();
          newItem.item = await entityManager.findOne(Item, {
            where: { itemId: item.itemId },
          });
          newItem.quantity = item.quantity.toString();
          newItem.inventoryRequest = inventoryRequest;
          const inventoryRequestRate = await entityManager.findOne(
            InventoryRequestRate,
            {
              where: {
                inventoryRequestRateCode: item.inventoryRequestRateCode,
                active: true,
              },
            }
          );
          if (!inventoryRequestRate) {
            throw Error(INVENTORYREQUESTRATE_ERROR_NOT_FOUND);
          }
          newItem.inventoryRequestRate = inventoryRequestRate;
          const totalAmount =
            Number(inventoryRequestRate.rate) * Number(newItem.quantity);
          newItem.totalAmount = totalAmount.toString();
          newItem = await entityManager.save(InventoryRequestItem, newItem);

          const itemWarehouse = await entityManager.findOne(ItemWarehouse, {
            where: {
              itemId: item.itemId,
              warehouse: {
                warehouseCode: dto.fromWarehouseCode,
              },
            },
          });
          const newOrderedQuantity =
            Number(itemWarehouse.orderedQuantity) + Number(item.quantity);
          itemWarehouse.orderedQuantity = newOrderedQuantity.toString();

          const newItemWarehouseQuantity =
            Number(itemWarehouse.quantity) - Number(item.quantity);
          itemWarehouse.quantity =
            newItemWarehouseQuantity >= 0
              ? newItemWarehouseQuantity.toString()
              : "0";
          await entityManager.save(ItemWarehouse, itemWarehouse);
        }
        inventoryRequest = await entityManager.save(
          InventoryRequest,
          inventoryRequest
        );
        inventoryRequest = await entityManager.findOne(InventoryRequest, {
          where: {
            inventoryRequestId: inventoryRequest.inventoryRequestId,
          },
          relations: {
            requestedByUser: {
              branch: true,
            },
            branch: true,
            inventoryRequestItems: {
              item: {
                itemCategory: true,
              },
            },
            fromWarehouse: true,
          },
        });
        delete inventoryRequest.requestedByUser.password;

        let getUsersToBeNotified = await entityManager.find(Users, {
          where: {
            userId: Not(inventoryRequest.requestedByUser.userId),
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
              x.access.some((x) => x.page === "Inventory Request")
          )
          .map((x) => x.user);
        await this.logNotification(
          getUsersToBeNotified,
          inventoryRequest,
          entityManager,
          NOTIF_TITLE.INVENTORY_REQUEST_CREATED,
          inventoryRequest.description
        );
        await this.pusherService.reSync("INVENTORY_REQUEST", null);
        return inventoryRequest;
      }
    );
  }

  async update(inventoryRequestCode, dto: UpdateInventoryRequestDto) {
    return await this.inventoryRequestRepo.manager.transaction(
      async (entityManager) => {
        let inventoryRequest = await entityManager.findOne(InventoryRequest, {
          where: {
            inventoryRequestCode,
            active: true,
          },
          relations: {
            requestedByUser: {
              branch: true,
            },
            branch: true,
            fromWarehouse: true,
          },
        });
        if (!inventoryRequest) {
          throw Error(INVENTORYREQUEST_ERROR_NOT_FOUND);
        }
        if (inventoryRequest.requestStatus !== "PENDING") {
          throw Error(
            "Not allowed to update request, the request was already being - processed"
          );
        }
        inventoryRequest.description = dto.description;

        const lastUpdatedByUser = await entityManager.findOne(Users, {
          where: {
            userId: dto.updatedByUserId,
            active: true,
          },
        });
        if (!lastUpdatedByUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        inventoryRequest.lastUpdatedByUser = lastUpdatedByUser;

        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        inventoryRequest.dateLastUpdated = timestamp;

        dto.inventoryRequestItems = dto.inventoryRequestItems.reduce(
          (acc, cur) => {
            const item =
              acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
            if (item) {
              item.quantity = Number(item.quantity) + Number(cur.quantity);
            } else
              acc.push({
                itemId: cur.itemId,
                quantity: cur.quantity,
                inventoryRequestRateCode: cur.inventoryRequestRateCode,
              });
            return acc;
          },
          []
        );

        //update items
        for (const item of dto.inventoryRequestItems) {
          let isNew = false;
          if (isNaN(item.quantity) || item.quantity <= 0) {
            throw Error("Invalid item quantity");
          }
          let inventoryRequestItem = await entityManager.findOne(
            InventoryRequestItem,
            {
              where: {
                itemId: item.itemId,
                inventoryRequestId: inventoryRequest.inventoryRequestId,
              },
            }
          );
          if (!inventoryRequestItem) {
            isNew = true;
            inventoryRequestItem = new InventoryRequestItem();
            inventoryRequestItem.item = await entityManager.findOne(Item, {
              where: { itemId: item.itemId },
            });
            inventoryRequestItem.inventoryRequestId =
              inventoryRequest.inventoryRequestId;
            inventoryRequestItem.quantity = item.quantity.toString();
          }
          const inventoryRequestRate = await entityManager.findOne(
            InventoryRequestRate,
            {
              where: {
                inventoryRequestRateCode: item.inventoryRequestRateCode,
                active: true,
              },
            }
          );
          if (!inventoryRequestRate) {
            throw Error(INVENTORYREQUESTRATE_ERROR_NOT_FOUND);
          }
          inventoryRequestItem.inventoryRequestRate = inventoryRequestRate;
          const origReqQuantity = inventoryRequestItem.quantity;
          inventoryRequestItem.quantity = item.quantity.toString();
          const totalAmount = Number(inventoryRequestRate.rate) * item.quantity;
          inventoryRequestItem.totalAmount = totalAmount.toString();
          inventoryRequestItem = await entityManager.save(
            InventoryRequestItem,
            inventoryRequestItem
          );

          const itemWarehouse = await entityManager.findOne(ItemWarehouse, {
            where: {
              itemId: item.itemId,
              warehouseId: inventoryRequest.fromWarehouse.warehouseId,
            },
          });
          if (isNew) {
            const newItemWarehouseOrderQuantity =
              Number(itemWarehouse.orderedQuantity) +
              Number(inventoryRequestItem.quantity);
            itemWarehouse.orderedQuantity =
              newItemWarehouseOrderQuantity.toString();
            const newItemWarehouseQuantity =
              Number(itemWarehouse.quantity) -
              Number(inventoryRequestItem.quantity);
            itemWarehouse.quantity =
              newItemWarehouseQuantity >= 0
                ? newItemWarehouseQuantity.toString()
                : "0";
          } else {
            const oldOrderQuantiy =
              Number(itemWarehouse.orderedQuantity) > Number(origReqQuantity)
                ? Number(itemWarehouse.orderedQuantity) -
                  Number(origReqQuantity)
                : 0;
            const newOrderedQuantity = oldOrderQuantiy + Number(item.quantity);
            itemWarehouse.orderedQuantity = newOrderedQuantity.toString();

            const oldQuantity =
              Number(itemWarehouse.quantity) + Number(origReqQuantity);
            const newItemWarehouseQuantity =
              oldQuantity - Number(item.quantity);
            itemWarehouse.quantity =
              newItemWarehouseQuantity >= 0
                ? newItemWarehouseQuantity.toString()
                : "0";
          }
          await entityManager.save(ItemWarehouse, itemWarehouse);
        }

        let originalInventoryRequestItems = await entityManager.find(
          InventoryRequestItem,
          {
            where: {
              inventoryRequestId: inventoryRequest.inventoryRequestId,
            },
            relations: {
              item: true,
            },
          }
        );

        originalInventoryRequestItems = originalInventoryRequestItems.filter(
          (x) =>
            !dto.inventoryRequestItems.some((i) => i.itemId === x.item.itemId)
        );
        //remove ordered item from itemWarehouse table
        for (const item of originalInventoryRequestItems) {
          const itemWarehouse = await entityManager.findOne(ItemWarehouse, {
            where: {
              itemId: item.itemId,
              warehouseId: inventoryRequest.fromWarehouse.warehouseId,
            },
          });
          const newOrderedQuantity =
            Number(itemWarehouse.orderedQuantity) - Number(item.quantity);
          itemWarehouse.orderedQuantity =
            newOrderedQuantity >= 0 ? newOrderedQuantity.toString() : "0";

          const newItemWarehouseQuantity =
            Number(itemWarehouse.quantity) + Number(item.quantity);
          itemWarehouse.quantity =
            newItemWarehouseQuantity >= 0
              ? newItemWarehouseQuantity.toString()
              : "0";
          await entityManager.save(ItemWarehouse, itemWarehouse);
        }
        if (originalInventoryRequestItems.length > 0) {
          await entityManager.delete(
            InventoryRequestItem,
            originalInventoryRequestItems
          );
        }
        //end update items

        inventoryRequest = await entityManager.save(
          InventoryRequest,
          inventoryRequest
        );
        inventoryRequest = await entityManager.findOne(InventoryRequest, {
          where: {
            inventoryRequestId: inventoryRequest.inventoryRequestId,
          },
          relations: {
            requestedByUser: {
              branch: true,
            },
            branch: true,
            inventoryRequestItems: {
              item: {
                itemCategory: true,
              },
            },
            fromWarehouse: true,
            lastUpdatedByUser: {
              branch: true,
            },
          },
        });
        delete inventoryRequest.requestedByUser.password;
        delete inventoryRequest.lastUpdatedByUser.password;
        await this.syncRealTime(inventoryRequest);
        return inventoryRequest;
      }
    );
  }

  async updateStatus(
    inventoryRequestCode,
    dto: ProcessInventoryRequestStatusDto | CloseInventoryRequestStatusDto
  ) {
    return await this.inventoryRequestRepo.manager.transaction(
      async (entityManager) => {
        const { status } = dto;
        let inventoryRequest = await entityManager.findOne(InventoryRequest, {
          select: deafaultInventoryRequestSelect as any,
          where: {
            inventoryRequestCode,
            active: true,
          },
          relations: {
            fromWarehouse: true,
            branch: true,
            requestedByUser: true,
            inventoryRequestItems: {
              inventoryRequest: true,
              item: {
                itemCategory: true,
              },
              inventoryRequestRate: true,
            },
          },
        });
        if (!inventoryRequest) {
          throw Error(INVENTORYREQUEST_ERROR_NOT_FOUND);
        }
        if (
          inventoryRequest.requestStatus === "COMPLETED" ||
          inventoryRequest.requestStatus === "PARTIALLY-FULFILLED" ||
          inventoryRequest.requestStatus === "CANCELLED" ||
          inventoryRequest.requestStatus === "REJECTED"
        ) {
          throw Error(
            "Not allowed to update status, the request was already - " +
              inventoryRequest.requestStatus.toLowerCase()
          );
        }
        if (inventoryRequest.requestStatus === "IN-TRANSIT") {
          if (
            [
              "PENDING",
              "REJECTED",
              "PROCESSING",
              "IN-TRANSIT",
              "CANCELLED",
            ].some((x) => x.toUpperCase() === status.toUpperCase())
          ) {
            throw Error(
              "Not allowed to update status, the request was already - " +
                inventoryRequest.requestStatus.toLowerCase()
            );
          }
        }
        if (inventoryRequest.requestStatus === "PROCESSING") {
          if (
            ["PENDING", "REJECTED", "PROCESSING", "CANCELLED"].some(
              (x) => x.toUpperCase() === status.toUpperCase()
            )
          ) {
            throw Error(
              "Not allowed to update status, the request was already being - " +
                inventoryRequest.requestStatus.toLowerCase()
            );
          }
          if (status === "COMPLETED" || status === "PARTIALLY-FULFILLED") {
            throw Error(
              "Not allowed to update status, the request was not yet in-transit"
            );
          }
        }
        if (inventoryRequest.requestStatus === "REJECTED") {
          throw Error(
            "Not allowed to update status, the request was already being - " +
              inventoryRequest.requestStatus.toLowerCase()
          );
        }
        if (inventoryRequest.requestStatus === "PENDING") {
          if (status === "PENDING") {
            throw Error(
              "Not allowed to update status, the request was already - " +
                inventoryRequest.requestStatus.toLowerCase()
            );
          }
          if (
            ["IN-TRANSIT", "COMPLETED", "PARTIALLY-FULFILLED"].some(
              (x) => x.toUpperCase() === status.toUpperCase()
            )
          ) {
            throw Error(
              "Not allowed to update status, the request was not yet processed"
            );
          }
        }
        if (status === "CANCELLED" || status === "REJECTED") {
          inventoryRequest.inventoryRequestItems = await entityManager.find(
            InventoryRequestItem,
            {
              where: {
                inventoryRequest: {
                  inventoryRequestCode,
                  active: true,
                },
              },
              relations: {
                item: {
                  itemCategory: true,
                },
                inventoryRequestRate: true,
                inventoryRequest: true,
              },
            }
          );
          for (const item of inventoryRequest.inventoryRequestItems) {
            const itemWarehouse = await entityManager.findOne(ItemWarehouse, {
              where: {
                itemId: item.item.itemId,
                warehouseId: inventoryRequest.fromWarehouse.warehouseId,
              },
            });
            const newOrderedQuantity =
              Number(itemWarehouse.orderedQuantity) - Number(item.quantity);
            itemWarehouse.orderedQuantity =
              newOrderedQuantity >= 0 ? newOrderedQuantity.toString() : "0";

            const newItemWarehouseQuantity =
              Number(itemWarehouse.quantity) + Number(item.quantity);
            itemWarehouse.quantity =
              newItemWarehouseQuantity >= 0
                ? newItemWarehouseQuantity.toString()
                : "0";
            await entityManager.save(ItemWarehouse, itemWarehouse);
          }
        }
        if (
          status === "CANCELLED" ||
          status === "REJECTED" ||
          status === "COMPLETED"
        ) {
          inventoryRequest.notes = dto["notes"];
        }
        delete inventoryRequest.inventoryRequestItems;
        inventoryRequest.requestStatus = status;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        inventoryRequest.dateLastUpdated = timestamp;

        const lastUpdatedByUser = await entityManager.findOne(Users, {
          where: {
            userId: dto.updatedByUserId,
            active: true,
          },
        });
        if (!lastUpdatedByUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        inventoryRequest.lastUpdatedByUser = lastUpdatedByUser;

        inventoryRequest = await entityManager.save(
          InventoryRequest,
          inventoryRequest
        );
        inventoryRequest = await entityManager.findOne(InventoryRequest, {
          where: {
            inventoryRequestId: inventoryRequest.inventoryRequestId,
          },
          relations: {
            requestedByUser: {
              branch: true,
            },
            lastUpdatedByUser: {
              branch: true,
            },
            branch: true,
            inventoryRequestItems: {
              item: {
                itemCategory: true,
              },
            },
            fromWarehouse: true,
          },
        });
        delete inventoryRequest.requestedByUser.password;
        delete inventoryRequest.lastUpdatedByUser.password;
        //complete request update stocks
        if (status === "COMPLETED") {
          inventoryRequest.inventoryRequestItems = await entityManager.find(
            InventoryRequestItem,
            {
              where: {
                inventoryRequest: {
                  inventoryRequestCode,
                  active: true,
                },
              },
              relations: {
                item: {
                  itemCategory: true,
                },
                inventoryRequestRate: true,
                inventoryRequest: true,
              },
            }
          );
          for (const item of inventoryRequest.inventoryRequestItems) {
            let inventoryRequestItem = await entityManager.findOne(
              InventoryRequestItem,
              {
                where: {
                  itemId: item.item.itemId,
                  inventoryRequest: {
                    inventoryRequestId: inventoryRequest.inventoryRequestId,
                  },
                },
              }
            );

            inventoryRequestItem.quantityReceived =
              inventoryRequestItem.quantity;
            inventoryRequestItem = await entityManager.save(
              InventoryRequestItem,
              inventoryRequestItem
            );
            let itemBranch = await entityManager.findOne(ItemBranch, {
              where: {
                itemId: item.item.itemId,
                branch: {
                  branchId: inventoryRequest.branch.branchId,
                },
              },
            });
            const newQuantity =
              Number(itemBranch.quantity) + Number(item.quantity);
            itemBranch.quantity = newQuantity.toString();
            itemBranch = await entityManager.save(ItemBranch, itemBranch);

            const itemWarehouse = await entityManager.findOne(ItemWarehouse, {
              where: {
                itemId: item.itemId,
                warehouseId: inventoryRequest.fromWarehouse.warehouseId,
              },
            });
            const newOrderedQuantity =
              Number(itemWarehouse.orderedQuantity) - Number(item.quantity);
            itemWarehouse.orderedQuantity =
              newOrderedQuantity >= 0 ? newOrderedQuantity.toString() : "0";

            await entityManager.save(ItemWarehouse, itemWarehouse);
          }
        }
        if (status !== "CANCELLED") {
          const getUsersToBeNotified = await entityManager.find(Users, {
            where: {
              userId:
                status === "COMPLETED"
                  ? Not(inventoryRequest.requestedByUser.userId)
                  : inventoryRequest.requestedByUser.userId,
              access: {
                active: true,
              },
              branch: {
                isMainBranch: status === "COMPLETED" ? true : false,
              },
              active: true,
            },
            relations: {
              branch: true,
              access: true,
            },
          });
          let title = "Inventory Request";
          let description = "Inventory request description";
          if (status === "COMPLETED") {
            title = NOTIF_TITLE.INVENTORY_REQUEST_COMPLETED;
            description = `Inventory Request #${inventoryRequest.inventoryRequestCode} is now completed`;
          } else if (status === "REJECTED") {
            title = NOTIF_TITLE.INVENTORY_REQUEST_REJECTED;
            description = `Inventory Request #${inventoryRequest.inventoryRequestCode} was rejected`;
          } else if (status === "PROCESSING") {
            title = NOTIF_TITLE.INVENTORY_REQUEST_PROCESSING;
            description = `Inventory Request #${inventoryRequest.inventoryRequestCode} is now being process`;
          } else if (status === "IN-TRANSIT") {
            title = NOTIF_TITLE.INVENTORY_REQUEST_IN_TRANSIT;
            description = `Inventory Request #${inventoryRequest.inventoryRequestCode} is now in-transit`;
          }
          await this.logNotification(
            getUsersToBeNotified,
            inventoryRequest,
            entityManager,
            title,
            description
          );
          await this.syncRealTime(inventoryRequest);
        }
        return inventoryRequest;
      }
    );
  }

  async logNotification(
    users: Users[],
    inventoryRequest: InventoryRequest,
    entityManager: EntityManager,
    title: string,
    description: string
  ) {
    const notifications: Notifications[] = [];

    for (const user of users) {
      notifications.push({
        title,
        description,
        type: NOTIF_TYPE.INVENTORY_REQUEST.toString(),
        referenceId: inventoryRequest.inventoryRequestCode.toString(),
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

  async syncRealTime(inventoryRequest: InventoryRequest) {
    const users = await this.inventoryRequestRepo.manager.find(Users, {
      where: {
        userId: Not(inventoryRequest.lastUpdatedByUser.userId),
        active: true,
        branch: {
          isMainBranch: true,
          active: true,
        },
      },
    });
    await this.pusherService.inventoryRequestChanges(
      users.map((x) => x.userId),
      inventoryRequest
    );
  }
}
