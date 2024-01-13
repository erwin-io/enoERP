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
exports.GoodsReceiptService = void 0;
const Notifications_1 = require("./../db/entities/Notifications");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const goods_receipt_constant_1 = require("../common/constant/goods-receipt.constant");
const notifications_constant_1 = require("../common/constant/notifications.constant");
const supplier_constant_1 = require("../common/constant/supplier.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const warehouse_constant_1 = require("../common/constant/warehouse.constant");
const utils_1 = require("../common/utils/utils");
const GoodsReceipt_1 = require("../db/entities/GoodsReceipt");
const GoodsReceiptItem_1 = require("../db/entities/GoodsReceiptItem");
const Item_1 = require("../db/entities/Item");
const ItemWarehouse_1 = require("../db/entities/ItemWarehouse");
const Supplier_1 = require("../db/entities/Supplier");
const Users_1 = require("../db/entities/Users");
const Warehouse_1 = require("../db/entities/Warehouse");
const typeorm_2 = require("typeorm");
const pusher_service_1 = require("./pusher.service");
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
    supplier: true,
};
let GoodsReceiptService = class GoodsReceiptService {
    constructor(goodsReceiptRepo, pusherService) {
        this.goodsReceiptRepo = goodsReceiptRepo;
        this.pusherService = pusherService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.goodsReceiptRepo.find({
                select: deafaultGoodsReceiptSelect,
                where: Object.assign(Object.assign({}, condition), { active: true }),
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
                    supplier: true,
                },
            }),
            this.goodsReceiptRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
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
                supplier: true,
            },
        });
        if (!result) {
            throw Error(goods_receipt_constant_1.GOODSRECEIPT_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.goodsReceiptRepo.manager.transaction(async (entityManager) => {
            let goodsReceipt = new GoodsReceipt_1.GoodsReceipt();
            const createdByUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userId: dto.createdByUserId,
                    active: true,
                },
            });
            if (!createdByUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            goodsReceipt.createdByUser = createdByUser;
            const warehouse = await entityManager.findOne(Warehouse_1.Warehouse, {
                where: {
                    warehouseCode: dto.warehouseCode,
                    active: true,
                },
            });
            if (!warehouse) {
                throw Error(warehouse_constant_1.WAREHOUSE_ERROR_NOT_FOUND);
            }
            goodsReceipt.warehouse = warehouse;
            const supplier = await entityManager.findOne(Supplier_1.Supplier, {
                where: {
                    supplierCode: dto.supplierCode,
                    active: true,
                },
            });
            if (!supplier) {
                throw Error(supplier_constant_1.SUPPLIER_ERROR_NOT_FOUND);
            }
            goodsReceipt.supplier = supplier;
            goodsReceipt.description = dto.description;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            goodsReceipt.dateCreated = timestamp;
            goodsReceipt = await entityManager.save(GoodsReceipt_1.GoodsReceipt, goodsReceipt);
            goodsReceipt.goodsReceiptCode = (0, utils_1.generateIndentityCode)(goodsReceipt.goodsReceiptId);
            dto.goodsReceiptItems = dto.goodsReceiptItems.reduce((acc, cur) => {
                const item = acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
                if (item) {
                    item.quantity = Number(item.quantity) + Number(cur.quantity);
                }
                else
                    acc.push({
                        itemId: cur.itemId,
                        quantity: cur.quantity,
                    });
                return acc;
            }, []);
            for (const item of dto.goodsReceiptItems) {
                let newItem = new GoodsReceiptItem_1.GoodsReceiptItem();
                newItem.item = await entityManager.findOne(Item_1.Item, {
                    where: { itemId: item.itemId },
                });
                newItem.quantity = item.quantity.toString();
                newItem.goodsReceipt = goodsReceipt;
                newItem = await entityManager.save(GoodsReceiptItem_1.GoodsReceiptItem, newItem);
            }
            goodsReceipt = await entityManager.save(GoodsReceipt_1.GoodsReceipt, goodsReceipt);
            goodsReceipt = await entityManager.findOne(GoodsReceipt_1.GoodsReceipt, {
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
                    supplier: true,
                },
            });
            delete goodsReceipt.createdByUser.password;
            let getUsersToBeNotified = await entityManager.find(Users_1.Users, {
                where: {
                    userId: (0, typeorm_2.Not)(goodsReceipt.createdByUser.userId),
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
                x.access.some((x) => x.page === "Goods Receipt") &&
                x.access.some((x) => x.rights && x.rights.some((r) => r === "Approval")))
                .map((x) => x.user);
            await this.logNotification(getUsersToBeNotified, goodsReceipt, entityManager, notifications_constant_1.NOTIF_TITLE.GOODS_RECEIPT_CREATED, goodsReceipt.description);
            await this.pusherService.reSync("GOODS_RECEIPT", null);
            return goodsReceipt;
        });
    }
    async update(goodsReceiptCode, dto) {
        return await this.goodsReceiptRepo.manager.transaction(async (entityManager) => {
            let goodsReceipt = await entityManager.findOne(GoodsReceipt_1.GoodsReceipt, {
                where: {
                    goodsReceiptCode,
                    active: true,
                },
                relations: {
                    createdByUser: {
                        branch: true,
                    },
                    warehouse: true,
                    supplier: true,
                },
            });
            if (!goodsReceipt) {
                throw Error(goods_receipt_constant_1.GOODSRECEIPT_ERROR_NOT_FOUND);
            }
            if (goodsReceipt.status !== "PENDING") {
                throw Error("Not allowed to update goods receipt, goods receipt was already being - processed");
            }
            const lastUpdatedByUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userId: dto.updatedByUserId,
                    active: true,
                },
            });
            if (!lastUpdatedByUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            goodsReceipt.lastUpdatedByUser = lastUpdatedByUser;
            const supplier = await entityManager.findOne(Supplier_1.Supplier, {
                where: {
                    supplierCode: dto.supplierCode,
                    active: true,
                },
            });
            if (!supplier) {
                throw Error(supplier_constant_1.SUPPLIER_ERROR_NOT_FOUND);
            }
            goodsReceipt.supplier = supplier;
            goodsReceipt.description = dto.description;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            goodsReceipt.dateLastUpdated = timestamp;
            dto.goodsReceiptItems = dto.goodsReceiptItems.reduce((acc, cur) => {
                const item = acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
                if (item) {
                    item.quantity = Number(item.quantity) + Number(cur.quantity);
                }
                else
                    acc.push({
                        itemId: cur.itemId,
                        quantity: cur.quantity,
                    });
                return acc;
            }, []);
            for (const item of dto.goodsReceiptItems) {
                let goodsReceiptItem = await entityManager.findOne(GoodsReceiptItem_1.GoodsReceiptItem, {
                    where: {
                        itemId: item.itemId,
                        goodsReceiptId: goodsReceipt.goodsReceiptId,
                    },
                });
                if (!goodsReceiptItem) {
                    goodsReceiptItem = new GoodsReceiptItem_1.GoodsReceiptItem();
                    goodsReceiptItem.item = await entityManager.findOne(Item_1.Item, {
                        where: { itemId: item.itemId },
                    });
                    goodsReceiptItem.goodsReceiptId = goodsReceipt.goodsReceiptId;
                }
                goodsReceiptItem.quantity = item.quantity.toString();
                goodsReceiptItem = await entityManager.save(GoodsReceiptItem_1.GoodsReceiptItem, goodsReceiptItem);
            }
            let originalGoodsReceiptItems = await entityManager.find(GoodsReceiptItem_1.GoodsReceiptItem, {
                where: {
                    goodsReceiptId: goodsReceipt.goodsReceiptId,
                },
                relations: {
                    item: true,
                },
            });
            originalGoodsReceiptItems = originalGoodsReceiptItems.filter((x) => !dto.goodsReceiptItems.some((i) => i.itemId === x.item.itemId));
            if (originalGoodsReceiptItems.length > 0) {
                await entityManager.delete(GoodsReceiptItem_1.GoodsReceiptItem, originalGoodsReceiptItems);
            }
            goodsReceipt = await entityManager.save(GoodsReceipt_1.GoodsReceipt, goodsReceipt);
            goodsReceipt = await entityManager.findOne(GoodsReceipt_1.GoodsReceipt, {
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
                    supplier: true,
                    lastUpdatedByUser: {
                        branch: true,
                    },
                },
            });
            delete goodsReceipt.createdByUser.password;
            delete goodsReceipt.lastUpdatedByUser.password;
            await this.syncRealTime(goodsReceipt);
            return goodsReceipt;
        });
    }
    async updateStatus(goodsReceiptCode, dto) {
        return await this.goodsReceiptRepo.manager.transaction(async (entityManager) => {
            const { status } = dto;
            let goodsReceipt = await entityManager.findOne(GoodsReceipt_1.GoodsReceipt, {
                select: deafaultGoodsReceiptSelect,
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
                    supplier: true,
                },
            });
            if (!goodsReceipt) {
                throw Error(goods_receipt_constant_1.GOODSRECEIPT_ERROR_NOT_FOUND);
            }
            if (goodsReceipt.status === "COMPLETED" ||
                goodsReceipt.status === "CANCELLED" ||
                goodsReceipt.status === "REJECTED") {
                throw Error("Not allowed to update status, goods receipt was already - " +
                    goodsReceipt.status.toLowerCase());
            }
            if (goodsReceipt.status === "REJECTED") {
                throw Error("Not allowed to update status, goods receipt was already being - " +
                    goodsReceipt.status.toLowerCase());
            }
            if (goodsReceipt.status === "PENDING") {
                if (status === "PENDING") {
                    throw Error("Not allowed to update status, goods receipt was already - " +
                        goodsReceipt.status.toLowerCase());
                }
            }
            if (status === "CANCELLED" ||
                status === "REJECTED" ||
                status === "COMPLETED") {
                goodsReceipt.notes = dto["notes"];
            }
            delete goodsReceipt.goodsReceiptItems;
            goodsReceipt.status = status;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            goodsReceipt.dateLastUpdated = timestamp;
            const lastUpdatedByUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userId: dto.updatedByUserId,
                    active: true,
                },
            });
            if (!lastUpdatedByUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            goodsReceipt.lastUpdatedByUser = lastUpdatedByUser;
            goodsReceipt = await entityManager.save(GoodsReceipt_1.GoodsReceipt, goodsReceipt);
            goodsReceipt = await entityManager.findOne(GoodsReceipt_1.GoodsReceipt, {
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
                    supplier: true,
                    lastUpdatedByUser: {
                        branch: true,
                    },
                },
            });
            delete goodsReceipt.createdByUser.password;
            delete goodsReceipt.lastUpdatedByUser.password;
            if (status === "COMPLETED") {
                for (const item of goodsReceipt.goodsReceiptItems) {
                    let itemWarehouse = await entityManager.findOne(ItemWarehouse_1.ItemWarehouse, {
                        where: {
                            itemId: item.item.itemId,
                            warehouse: {
                                warehouseId: goodsReceipt.warehouse.warehouseId,
                            },
                        },
                    });
                    const newQuantity = Number(itemWarehouse.quantity) + Number(item.quantity);
                    itemWarehouse.quantity = newQuantity.toString();
                    itemWarehouse = await entityManager.save(ItemWarehouse_1.ItemWarehouse, itemWarehouse);
                }
            }
            const getUsersToBeNotified = await entityManager.find(Users_1.Users, {
                where: {
                    userId: goodsReceipt.createdByUser.userId,
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
            let title = "Goods receipt";
            let description = "Goods receipt description";
            if (status === "COMPLETED") {
                title = notifications_constant_1.NOTIF_TITLE.GOODS_RECEIPT_COMPLETED;
                description = `Goods receipt #${goodsReceipt.goodsReceiptCode} is now completed`;
            }
            else if (status === "REJECTED") {
                title = notifications_constant_1.NOTIF_TITLE.GOODS_RECEIPT_REJECTED;
                description = `Goods receipt #${goodsReceipt.goodsReceiptCode} was rejected`;
            }
            await this.logNotification(getUsersToBeNotified, goodsReceipt, entityManager, title, description);
            await this.syncRealTime(goodsReceipt);
            return goodsReceipt;
        });
    }
    async logNotification(users, goodsReceipt, entityManager, title, description) {
        const notifications = [];
        for (const user of users) {
            notifications.push({
                title,
                description,
                type: notifications_constant_1.NOTIF_TYPE.GOODS_RECEIPT.toString(),
                referenceId: goodsReceipt.goodsReceiptCode.toString(),
                isRead: false,
                user: user,
            });
        }
        await entityManager.save(Notifications_1.Notifications, notifications);
        await this.pusherService.sendNotif(users.map((x) => x.userId), title, description);
    }
    async syncRealTime(goodsReceipt) {
        const users = await this.goodsReceiptRepo.manager.find(Users_1.Users, {
            where: {
                userId: (0, typeorm_2.Not)(goodsReceipt.lastUpdatedByUser.userId),
                active: true,
                branch: {
                    isMainBranch: true,
                    active: true,
                },
            },
        });
        await this.pusherService.goodsReceiptChanges(users.map((x) => x.userId), goodsReceipt);
    }
};
GoodsReceiptService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(GoodsReceipt_1.GoodsReceipt)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pusher_service_1.PusherService])
], GoodsReceiptService);
exports.GoodsReceiptService = GoodsReceiptService;
//# sourceMappingURL=goods-receipt.service.js.map