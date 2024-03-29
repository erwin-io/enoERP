"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRequestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const branch_constant_1 = require("../common/constant/branch.constant");
const inventory_request_rate_constant_1 = require("../common/constant/inventory-request-rate.constant");
const inventory_request_constant_1 = require("../common/constant/inventory-request.constant");
const notifications_constant_1 = require("../common/constant/notifications.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const warehouse_constant_1 = require("../common/constant/warehouse.constant");
const utils_1 = require("../common/utils/utils");
const Branch_1 = require("../db/entities/Branch");
const InventoryRequest_1 = require("../db/entities/InventoryRequest");
const InventoryRequestItem_1 = require("../db/entities/InventoryRequestItem");
const InventoryRequestRate_1 = require("../db/entities/InventoryRequestRate");
const Item_1 = require("../db/entities/Item");
const ItemBranch_1 = require("../db/entities/ItemBranch");
const ItemWarehouse_1 = require("../db/entities/ItemWarehouse");
const Notifications_1 = require("../db/entities/Notifications");
const Users_1 = require("../db/entities/Users");
const Warehouse_1 = require("../db/entities/Warehouse");
const typeorm_2 = require("typeorm");
const pusher_service_1 = require("./pusher.service");
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
let InventoryRequestService = class InventoryRequestService {
    constructor(inventoryRequestRepo, pusherService) {
        this.inventoryRequestRepo = inventoryRequestRepo;
        this.pusherService = pusherService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.inventoryRequestRepo.find({
                select: deafaultInventoryRequestSelect,
                where: Object.assign(Object.assign({}, condition), { active: true }),
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
                where: Object.assign(Object.assign({}, condition), { active: true }),
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
            throw Error(inventory_request_constant_1.INVENTORYREQUEST_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.inventoryRequestRepo.manager.transaction(async (entityManager) => {
            let inventoryRequest = new InventoryRequest_1.InventoryRequest();
            const requestedByUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userId: dto.requestedByUserId,
                    active: true,
                },
            });
            if (!requestedByUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            inventoryRequest.requestedByUser = requestedByUser;
            const branch = await entityManager.findOne(Branch_1.Branch, {
                where: {
                    branchId: dto.branchId,
                    active: true,
                },
            });
            if (!branch) {
                throw Error(branch_constant_1.BRANCH_ERROR_NOT_FOUND);
            }
            inventoryRequest.branch = branch;
            const fromWarehouse = await entityManager.findOne(Warehouse_1.Warehouse, {
                where: {
                    warehouseCode: dto.fromWarehouseCode,
                    active: true,
                },
            });
            if (!branch) {
                throw Error(warehouse_constant_1.WAREHOUSE_ERROR_NOT_FOUND);
            }
            inventoryRequest.fromWarehouse = fromWarehouse;
            inventoryRequest.description = dto.description;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            inventoryRequest.dateRequested = timestamp;
            inventoryRequest = await entityManager.save(InventoryRequest_1.InventoryRequest, inventoryRequest);
            inventoryRequest.inventoryRequestCode = (0, utils_1.generateIndentityCode)(inventoryRequest.inventoryRequestId);
            dto.inventoryRequestItems = dto.inventoryRequestItems.reduce((acc, cur) => {
                const item = acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
                if (item) {
                    item.quantity = Number(item.quantity) + Number(cur.quantity);
                }
                else
                    acc.push({
                        itemId: cur.itemId,
                        inventoryRequestRateCode: cur.inventoryRequestRateCode,
                        quantity: cur.quantity,
                    });
                return acc;
            }, []);
            for (const item of dto.inventoryRequestItems) {
                let newItem = new InventoryRequestItem_1.InventoryRequestItem();
                newItem.item = await entityManager.findOne(Item_1.Item, {
                    where: { itemId: item.itemId },
                });
                newItem.quantity = item.quantity.toString();
                newItem.inventoryRequest = inventoryRequest;
                const inventoryRequestRate = await entityManager.findOne(InventoryRequestRate_1.InventoryRequestRate, {
                    where: {
                        inventoryRequestRateCode: item.inventoryRequestRateCode,
                        active: true,
                    },
                });
                if (!inventoryRequestRate) {
                    throw Error(inventory_request_rate_constant_1.INVENTORYREQUESTRATE_ERROR_NOT_FOUND);
                }
                newItem.inventoryRequestRate = inventoryRequestRate;
                const totalAmount = Number(inventoryRequestRate.rate) * Number(newItem.quantity);
                newItem.totalAmount = totalAmount.toString();
                newItem = await entityManager.save(InventoryRequestItem_1.InventoryRequestItem, newItem);
                const itemWarehouse = await entityManager.findOne(ItemWarehouse_1.ItemWarehouse, {
                    where: {
                        itemId: item.itemId,
                        warehouse: {
                            warehouseCode: dto.fromWarehouseCode,
                        },
                    },
                });
                const newOrderedQuantity = Number(itemWarehouse.orderedQuantity) + Number(item.quantity);
                itemWarehouse.orderedQuantity = newOrderedQuantity.toString();
                const newItemWarehouseQuantity = Number(itemWarehouse.quantity) - Number(item.quantity);
                itemWarehouse.quantity =
                    newItemWarehouseQuantity >= 0
                        ? newItemWarehouseQuantity.toString()
                        : "0";
                await entityManager.save(ItemWarehouse_1.ItemWarehouse, itemWarehouse);
            }
            inventoryRequest = await entityManager.save(InventoryRequest_1.InventoryRequest, inventoryRequest);
            inventoryRequest = await entityManager.findOne(InventoryRequest_1.InventoryRequest, {
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
            let getUsersToBeNotified = await entityManager.find(Users_1.Users, {
                where: {
                    userId: (0, typeorm_2.Not)(inventoryRequest.requestedByUser.userId),
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
                    access: x.access.accessPages,
                };
            })
                .filter((x) => x.access.length > 0 &&
                x.access.some((x) => x.page === "Inventory Request"))
                .map((x) => x.user);
            await this.logNotification(getUsersToBeNotified, inventoryRequest, entityManager, notifications_constant_1.NOTIF_TITLE.INVENTORY_REQUEST_CREATED, inventoryRequest.description);
            await this.pusherService.reSync("INVENTORY_REQUEST", null);
            return inventoryRequest;
        });
    }
    async update(inventoryRequestCode, dto) {
        return await this.inventoryRequestRepo.manager.transaction(async (entityManager) => {
            let inventoryRequest = await entityManager.findOne(InventoryRequest_1.InventoryRequest, {
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
                throw Error(inventory_request_constant_1.INVENTORYREQUEST_ERROR_NOT_FOUND);
            }
            if (inventoryRequest.requestStatus !== "PENDING") {
                throw Error("Not allowed to update request, the request was already being - processed");
            }
            inventoryRequest.description = dto.description;
            const lastUpdatedByUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userId: dto.updatedByUserId,
                    active: true,
                },
            });
            if (!lastUpdatedByUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            inventoryRequest.lastUpdatedByUser = lastUpdatedByUser;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            inventoryRequest.dateLastUpdated = timestamp;
            dto.inventoryRequestItems = dto.inventoryRequestItems.reduce((acc, cur) => {
                const item = acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
                if (item) {
                    item.quantity = Number(item.quantity) + Number(cur.quantity);
                }
                else
                    acc.push({
                        itemId: cur.itemId,
                        quantity: cur.quantity,
                        inventoryRequestRateCode: cur.inventoryRequestRateCode,
                    });
                return acc;
            }, []);
            for (const item of dto.inventoryRequestItems) {
                let isNew = false;
                if (isNaN(item.quantity) || item.quantity <= 0) {
                    throw Error("Invalid item quantity");
                }
                let inventoryRequestItem = await entityManager.findOne(InventoryRequestItem_1.InventoryRequestItem, {
                    where: {
                        itemId: item.itemId,
                        inventoryRequestId: inventoryRequest.inventoryRequestId,
                    },
                });
                if (!inventoryRequestItem) {
                    isNew = true;
                    inventoryRequestItem = new InventoryRequestItem_1.InventoryRequestItem();
                    inventoryRequestItem.item = await entityManager.findOne(Item_1.Item, {
                        where: { itemId: item.itemId },
                    });
                    inventoryRequestItem.inventoryRequestId =
                        inventoryRequest.inventoryRequestId;
                    inventoryRequestItem.quantity = item.quantity.toString();
                }
                const inventoryRequestRate = await entityManager.findOne(InventoryRequestRate_1.InventoryRequestRate, {
                    where: {
                        inventoryRequestRateCode: item.inventoryRequestRateCode,
                        active: true,
                    },
                });
                if (!inventoryRequestRate) {
                    throw Error(inventory_request_rate_constant_1.INVENTORYREQUESTRATE_ERROR_NOT_FOUND);
                }
                inventoryRequestItem.inventoryRequestRate = inventoryRequestRate;
                const origReqQuantity = inventoryRequestItem.quantity;
                inventoryRequestItem.quantity = item.quantity.toString();
                const totalAmount = Number(inventoryRequestRate.rate) * item.quantity;
                inventoryRequestItem.totalAmount = totalAmount.toString();
                inventoryRequestItem = await entityManager.save(InventoryRequestItem_1.InventoryRequestItem, inventoryRequestItem);
                const itemWarehouse = await entityManager.findOne(ItemWarehouse_1.ItemWarehouse, {
                    where: {
                        itemId: item.itemId,
                        warehouseId: inventoryRequest.fromWarehouse.warehouseId,
                    },
                });
                if (isNew) {
                    const newItemWarehouseOrderQuantity = Number(itemWarehouse.orderedQuantity) +
                        Number(inventoryRequestItem.quantity);
                    itemWarehouse.orderedQuantity =
                        newItemWarehouseOrderQuantity.toString();
                    const newItemWarehouseQuantity = Number(itemWarehouse.quantity) -
                        Number(inventoryRequestItem.quantity);
                    itemWarehouse.quantity =
                        newItemWarehouseQuantity >= 0
                            ? newItemWarehouseQuantity.toString()
                            : "0";
                }
                else {
                    const oldOrderQuantiy = Number(itemWarehouse.orderedQuantity) > Number(origReqQuantity)
                        ? Number(itemWarehouse.orderedQuantity) -
                            Number(origReqQuantity)
                        : 0;
                    const newOrderedQuantity = oldOrderQuantiy + Number(item.quantity);
                    itemWarehouse.orderedQuantity = newOrderedQuantity.toString();
                    const oldQuantity = Number(itemWarehouse.quantity) + Number(origReqQuantity);
                    const newItemWarehouseQuantity = oldQuantity - Number(item.quantity);
                    itemWarehouse.quantity =
                        newItemWarehouseQuantity >= 0
                            ? newItemWarehouseQuantity.toString()
                            : "0";
                }
                await entityManager.save(ItemWarehouse_1.ItemWarehouse, itemWarehouse);
            }
            let originalInventoryRequestItems = await entityManager.find(InventoryRequestItem_1.InventoryRequestItem, {
                where: {
                    inventoryRequestId: inventoryRequest.inventoryRequestId,
                },
                relations: {
                    item: true,
                },
            });
            originalInventoryRequestItems = originalInventoryRequestItems.filter((x) => !dto.inventoryRequestItems.some((i) => i.itemId === x.item.itemId));
            for (const item of originalInventoryRequestItems) {
                const itemWarehouse = await entityManager.findOne(ItemWarehouse_1.ItemWarehouse, {
                    where: {
                        itemId: item.itemId,
                        warehouseId: inventoryRequest.fromWarehouse.warehouseId,
                    },
                });
                const newOrderedQuantity = Number(itemWarehouse.orderedQuantity) - Number(item.quantity);
                itemWarehouse.orderedQuantity =
                    newOrderedQuantity >= 0 ? newOrderedQuantity.toString() : "0";
                const newItemWarehouseQuantity = Number(itemWarehouse.quantity) + Number(item.quantity);
                itemWarehouse.quantity =
                    newItemWarehouseQuantity >= 0
                        ? newItemWarehouseQuantity.toString()
                        : "0";
                await entityManager.save(ItemWarehouse_1.ItemWarehouse, itemWarehouse);
            }
            if (originalInventoryRequestItems.length > 0) {
                await entityManager.delete(InventoryRequestItem_1.InventoryRequestItem, originalInventoryRequestItems);
            }
            inventoryRequest = await entityManager.save(InventoryRequest_1.InventoryRequest, inventoryRequest);
            inventoryRequest = await entityManager.findOne(InventoryRequest_1.InventoryRequest, {
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
        });
    }
    async updateStatus(inventoryRequestCode, dto) {
        return await this.inventoryRequestRepo.manager.transaction(async (entityManager) => {
            const { status } = dto;
            let inventoryRequest = await entityManager.findOne(InventoryRequest_1.InventoryRequest, {
                select: deafaultInventoryRequestSelect,
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
                throw Error(inventory_request_constant_1.INVENTORYREQUEST_ERROR_NOT_FOUND);
            }
            if (inventoryRequest.requestStatus === "COMPLETED" ||
                inventoryRequest.requestStatus === "PARTIALLY-FULFILLED" ||
                inventoryRequest.requestStatus === "CANCELLED" ||
                inventoryRequest.requestStatus === "REJECTED") {
                throw Error("Not allowed to update status, the request was already - " +
                    inventoryRequest.requestStatus.toLowerCase());
            }
            if (inventoryRequest.requestStatus === "IN-TRANSIT") {
                if ([
                    "PENDING",
                    "REJECTED",
                    "PROCESSING",
                    "IN-TRANSIT",
                    "CANCELLED",
                ].some((x) => x.toUpperCase() === status.toUpperCase())) {
                    throw Error("Not allowed to update status, the request was already - " +
                        inventoryRequest.requestStatus.toLowerCase());
                }
            }
            if (inventoryRequest.requestStatus === "PROCESSING") {
                if (["PENDING", "REJECTED", "PROCESSING", "CANCELLED"].some((x) => x.toUpperCase() === status.toUpperCase())) {
                    throw Error("Not allowed to update status, the request was already being - " +
                        inventoryRequest.requestStatus.toLowerCase());
                }
                if (status === "COMPLETED" || status === "PARTIALLY-FULFILLED") {
                    throw Error("Not allowed to update status, the request was not yet in-transit");
                }
            }
            if (inventoryRequest.requestStatus === "REJECTED") {
                throw Error("Not allowed to update status, the request was already being - " +
                    inventoryRequest.requestStatus.toLowerCase());
            }
            if (inventoryRequest.requestStatus === "PENDING") {
                if (status === "PENDING") {
                    throw Error("Not allowed to update status, the request was already - " +
                        inventoryRequest.requestStatus.toLowerCase());
                }
                if (["IN-TRANSIT", "COMPLETED", "PARTIALLY-FULFILLED"].some((x) => x.toUpperCase() === status.toUpperCase())) {
                    throw Error("Not allowed to update status, the request was not yet processed");
                }
            }
            if (status === "CANCELLED" || status === "REJECTED") {
                inventoryRequest.inventoryRequestItems = await entityManager.find(InventoryRequestItem_1.InventoryRequestItem, {
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
                });
                for (const item of inventoryRequest.inventoryRequestItems) {
                    const itemWarehouse = await entityManager.findOne(ItemWarehouse_1.ItemWarehouse, {
                        where: {
                            itemId: item.item.itemId,
                            warehouseId: inventoryRequest.fromWarehouse.warehouseId,
                        },
                    });
                    const newOrderedQuantity = Number(itemWarehouse.orderedQuantity) - Number(item.quantity);
                    itemWarehouse.orderedQuantity =
                        newOrderedQuantity >= 0 ? newOrderedQuantity.toString() : "0";
                    const newItemWarehouseQuantity = Number(itemWarehouse.quantity) + Number(item.quantity);
                    itemWarehouse.quantity =
                        newItemWarehouseQuantity >= 0
                            ? newItemWarehouseQuantity.toString()
                            : "0";
                    await entityManager.save(ItemWarehouse_1.ItemWarehouse, itemWarehouse);
                }
            }
            if (status === "CANCELLED" ||
                status === "REJECTED" ||
                status === "COMPLETED") {
                inventoryRequest.notes = dto["notes"];
            }
            delete inventoryRequest.inventoryRequestItems;
            inventoryRequest.requestStatus = status;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            inventoryRequest.dateLastUpdated = timestamp;
            const lastUpdatedByUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userId: dto.updatedByUserId,
                    active: true,
                },
            });
            if (!lastUpdatedByUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            inventoryRequest.lastUpdatedByUser = lastUpdatedByUser;
            inventoryRequest = await entityManager.save(InventoryRequest_1.InventoryRequest, inventoryRequest);
            inventoryRequest = await entityManager.findOne(InventoryRequest_1.InventoryRequest, {
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
            if (status === "COMPLETED") {
                inventoryRequest.inventoryRequestItems = await entityManager.find(InventoryRequestItem_1.InventoryRequestItem, {
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
                });
                for (const item of inventoryRequest.inventoryRequestItems) {
                    let inventoryRequestItem = await entityManager.findOne(InventoryRequestItem_1.InventoryRequestItem, {
                        where: {
                            itemId: item.item.itemId,
                            inventoryRequest: {
                                inventoryRequestId: inventoryRequest.inventoryRequestId,
                            },
                        },
                    });
                    inventoryRequestItem.quantityReceived =
                        inventoryRequestItem.quantity;
                    inventoryRequestItem = await entityManager.save(InventoryRequestItem_1.InventoryRequestItem, inventoryRequestItem);
                    let itemBranch = await entityManager.findOne(ItemBranch_1.ItemBranch, {
                        where: {
                            itemId: item.item.itemId,
                            branch: {
                                branchId: inventoryRequest.branch.branchId,
                            },
                        },
                    });
                    const newQuantity = Number(itemBranch.quantity) + Number(item.quantity);
                    itemBranch.quantity = newQuantity.toString();
                    itemBranch = await entityManager.save(ItemBranch_1.ItemBranch, itemBranch);
                    const itemWarehouse = await entityManager.findOne(ItemWarehouse_1.ItemWarehouse, {
                        where: {
                            itemId: item.itemId,
                            warehouseId: inventoryRequest.fromWarehouse.warehouseId,
                        },
                    });
                    const newOrderedQuantity = Number(itemWarehouse.orderedQuantity) - Number(item.quantity);
                    itemWarehouse.orderedQuantity =
                        newOrderedQuantity >= 0 ? newOrderedQuantity.toString() : "0";
                    await entityManager.save(ItemWarehouse_1.ItemWarehouse, itemWarehouse);
                }
            }
            if (status !== "CANCELLED") {
                const getUsersToBeNotified = await entityManager.find(Users_1.Users, {
                    where: {
                        userId: status === "COMPLETED"
                            ? (0, typeorm_2.Not)(inventoryRequest.requestedByUser.userId)
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
                    title = notifications_constant_1.NOTIF_TITLE.INVENTORY_REQUEST_COMPLETED;
                    description = `Inventory Request #${inventoryRequest.inventoryRequestCode} is now completed`;
                }
                else if (status === "REJECTED") {
                    title = notifications_constant_1.NOTIF_TITLE.INVENTORY_REQUEST_REJECTED;
                    description = `Inventory Request #${inventoryRequest.inventoryRequestCode} was rejected`;
                }
                else if (status === "PROCESSING") {
                    title = notifications_constant_1.NOTIF_TITLE.INVENTORY_REQUEST_PROCESSING;
                    description = `Inventory Request #${inventoryRequest.inventoryRequestCode} is now being process`;
                }
                else if (status === "IN-TRANSIT") {
                    title = notifications_constant_1.NOTIF_TITLE.INVENTORY_REQUEST_IN_TRANSIT;
                    description = `Inventory Request #${inventoryRequest.inventoryRequestCode} is now in-transit`;
                }
                await this.logNotification(getUsersToBeNotified, inventoryRequest, entityManager, title, description);
                await this.syncRealTime(inventoryRequest);
            }
            return inventoryRequest;
        });
    }
    async logNotification(users, inventoryRequest, entityManager, title, description) {
        const notifications = [];
        for (const user of users) {
            notifications.push({
                title,
                description,
                type: notifications_constant_1.NOTIF_TYPE.INVENTORY_REQUEST.toString(),
                referenceId: inventoryRequest.inventoryRequestCode.toString(),
                isRead: false,
                user: user,
            });
        }
        await entityManager.save(Notifications_1.Notifications, notifications);
        await this.pusherService.sendNotif(users.map((x) => x.userId), title, description);
    }
    async syncRealTime(inventoryRequest) {
        const users = await this.inventoryRequestRepo.manager.find(Users_1.Users, {
            where: {
                userId: (0, typeorm_2.Not)(inventoryRequest.lastUpdatedByUser.userId),
                active: true,
                branch: {
                    isMainBranch: true,
                    active: true,
                },
            },
        });
        await this.pusherService.inventoryRequestChanges(users.map((x) => x.userId), inventoryRequest);
    }
};
InventoryRequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(InventoryRequest_1.InventoryRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pusher_service_1.PusherService])
], InventoryRequestService);
exports.InventoryRequestService = InventoryRequestService;
//# sourceMappingURL=inventory-request.service.js.map