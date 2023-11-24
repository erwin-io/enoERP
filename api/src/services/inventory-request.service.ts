import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BRANCH_ERROR_NOT_FOUND } from "src/common/constant/branch.constant";
import { INVENTORYREQUESTRATE_ERROR_NOT_FOUND } from "src/common/constant/inventory-request-rate.constant";
import { INVENTORYREQUEST_ERROR_NOT_FOUND } from "src/common/constant/inventory-request.constant";
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
import { Branch } from "src/db/entities/Branch";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { InventoryRequestItem } from "src/db/entities/InventoryRequestItem";
import { InventoryRequestRate } from "src/db/entities/InventoryRequestRate";
import { Item } from "src/db/entities/Item";
import { ItemBranch } from "src/db/entities/ItemBranch";
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Users } from "src/db/entities/Users";
import { Warehouse } from "src/db/entities/Warehouse";
import { Repository } from "typeorm";

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
  },
  fromWarehouse: true,
};
@Injectable()
export class InventoryRequestService {
  constructor(
    @InjectRepository(InventoryRequest)
    private readonly inventoryRequestRepo: Repository<InventoryRequest>
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
          newItem.totalAmount = inventoryRequestRate.rate;
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
              });
            return acc;
          },
          []
        );

        //update items
        for (const item of dto.inventoryRequestItems) {
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
            inventoryRequestItem = new InventoryRequestItem();
            inventoryRequestItem.item = await entityManager.findOne(Item, {
              where: { itemId: item.itemId },
            });
            inventoryRequestItem.inventoryRequestId =
              inventoryRequest.inventoryRequestId;
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
          inventoryRequestItem.totalAmount = inventoryRequestRate.rate;
          inventoryRequestItem.inventoryRequestRate = inventoryRequestRate;
          const origReqQuantity = inventoryRequestItem.quantity;
          inventoryRequestItem.quantity = item.quantity.toString();
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
          const oldOrderQuantiy =
            Number(itemWarehouse.orderedQuantity) - Number(origReqQuantity);
          const newOrderedQuantity = oldOrderQuantiy + Number(item.quantity);
          itemWarehouse.orderedQuantity = newOrderedQuantity.toString();

          const oldQuantity =
            Number(itemWarehouse.quantity) + Number(origReqQuantity);
          const newItemWarehouseQuantity = oldQuantity - Number(item.quantity);
          itemWarehouse.quantity =
            newItemWarehouseQuantity >= 0
              ? newItemWarehouseQuantity.toString()
              : "0";
          await entityManager.save(ItemWarehouse, itemWarehouse);
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
          },
        });
        delete inventoryRequest.requestedByUser.password;
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
        //complete request update stocks
        if (status === "COMPLETED") {
          for (const item of inventoryRequest.inventoryRequestItems) {
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
        return inventoryRequest;
      }
    );
  }
}
