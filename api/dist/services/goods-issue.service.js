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
exports.GoodsIssueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const goods_issue_constant_1 = require("../common/constant/goods-issue.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const warehouse_constant_1 = require("../common/constant/warehouse.constant");
const utils_1 = require("../common/utils/utils");
const GoodsIssue_1 = require("../db/entities/GoodsIssue");
const GoodsIssueItem_1 = require("../db/entities/GoodsIssueItem");
const Item_1 = require("../db/entities/Item");
const ItemWarehouse_1 = require("../db/entities/ItemWarehouse");
const Users_1 = require("../db/entities/Users");
const Warehouse_1 = require("../db/entities/Warehouse");
const typeorm_2 = require("typeorm");
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
let GoodsIssueService = class GoodsIssueService {
    constructor(goodsIssueRepo) {
        this.goodsIssueRepo = goodsIssueRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.goodsIssueRepo.find({
                select: deafaultGoodsIssueSelect,
                where: Object.assign(Object.assign({}, condition), { active: true }),
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
                where: Object.assign(Object.assign({}, condition), { active: true }),
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
            throw Error(goods_issue_constant_1.GOODSISSUE_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.goodsIssueRepo.manager.transaction(async (entityManager) => {
            let goodsIssue = new GoodsIssue_1.GoodsIssue();
            const createdByUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userId: dto.createdByUserId,
                    active: true,
                },
            });
            if (!createdByUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            goodsIssue.createdByUser = createdByUser;
            const warehouse = await entityManager.findOne(Warehouse_1.Warehouse, {
                where: {
                    warehouseCode: dto.warehouseCode,
                    active: true,
                },
            });
            if (!warehouse) {
                throw Error(warehouse_constant_1.WAREHOUSE_ERROR_NOT_FOUND);
            }
            goodsIssue.warehouse = warehouse;
            goodsIssue.description = dto.description;
            goodsIssue.issueType = dto.issueType;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            goodsIssue.dateCreated = timestamp;
            goodsIssue = await entityManager.save(GoodsIssue_1.GoodsIssue, goodsIssue);
            goodsIssue.goodsIssueCode = (0, utils_1.generateIndentityCode)(goodsIssue.goodsIssueId);
            dto.goodsIssueItems = dto.goodsIssueItems.reduce((acc, cur) => {
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
            for (const item of dto.goodsIssueItems) {
                let newItem = new GoodsIssueItem_1.GoodsIssueItem();
                newItem.item = await entityManager.findOne(Item_1.Item, {
                    where: { itemId: item.itemId },
                });
                newItem.quantity = item.quantity.toString();
                newItem.goodsIssue = goodsIssue;
                newItem = await entityManager.save(GoodsIssueItem_1.GoodsIssueItem, newItem);
                let itemWarehouse = await entityManager.findOne(ItemWarehouse_1.ItemWarehouse, {
                    where: {
                        itemId: item.itemId,
                        warehouse: {
                            warehouseId: goodsIssue.warehouse.warehouseId,
                        },
                    },
                });
                const newQuantity = Number(itemWarehouse.quantity) - Number(item.quantity);
                if (Number(item.quantity) > Number(itemWarehouse.quantity)) {
                    throw Error("Goods issue quantity exceeds current item warehouse quantity");
                }
                itemWarehouse.quantity = newQuantity.toString();
                itemWarehouse = await entityManager.save(ItemWarehouse_1.ItemWarehouse, itemWarehouse);
            }
            goodsIssue = await entityManager.save(GoodsIssue_1.GoodsIssue, goodsIssue);
            goodsIssue = await entityManager.findOne(GoodsIssue_1.GoodsIssue, {
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
            return goodsIssue;
        });
    }
    async update(goodsIssueCode, dto) {
        return await this.goodsIssueRepo.manager.transaction(async (entityManager) => {
            let goodsIssue = await entityManager.findOne(GoodsIssue_1.GoodsIssue, {
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
                throw Error(goods_issue_constant_1.GOODSISSUE_ERROR_NOT_FOUND);
            }
            if (goodsIssue.inventoryAdjustmentReports &&
                goodsIssue.inventoryAdjustmentReports.length > 0) {
                throw Error("Not allowed to update goods issue, goods issue document was generated via adjustment confirmation");
            }
            if (goodsIssue.status !== "PENDING") {
                throw Error("Not allowed to update goods issue, goods issue was already being - processed");
            }
            goodsIssue.description = dto.description;
            goodsIssue.issueType = dto.issueType;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            goodsIssue.dateLastUpdated = timestamp;
            dto.goodsIssueItems = dto.goodsIssueItems.reduce((acc, cur) => {
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
            let originalGoodsIssueItems = await entityManager.find(GoodsIssueItem_1.GoodsIssueItem, {
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
            originalGoodsIssueItems = originalGoodsIssueItems.filter((x) => !dto.goodsIssueItems.some((i) => i.itemId === x.item.itemId));
            for (const item of originalGoodsIssueItems) {
                const itemWarehouse = await entityManager.findOne(ItemWarehouse_1.ItemWarehouse, {
                    where: {
                        itemId: item.itemId,
                        warehouse: {
                            warehouseCode: goodsIssue.warehouse.warehouseCode,
                        },
                    },
                });
                const newItemWarehouseQuantity = Number(itemWarehouse.quantity) + Number(item.quantity);
                itemWarehouse.quantity =
                    newItemWarehouseQuantity >= 0
                        ? newItemWarehouseQuantity.toString()
                        : "0";
                await entityManager.save(ItemWarehouse_1.ItemWarehouse, itemWarehouse);
            }
            if (originalGoodsIssueItems.length > 0) {
                await entityManager.delete(GoodsIssueItem_1.GoodsIssueItem, originalGoodsIssueItems);
            }
            for (const item of dto.goodsIssueItems) {
                let isNew = false;
                if (isNaN(item.quantity) || item.quantity <= 0) {
                    throw Error("Invalid returned quantity");
                }
                let goodsIssueItem = await entityManager.findOne(GoodsIssueItem_1.GoodsIssueItem, {
                    where: {
                        itemId: item.itemId,
                        goodsIssueId: goodsIssue.goodsIssueId,
                    },
                });
                if (!goodsIssueItem) {
                    isNew = true;
                    goodsIssueItem = new GoodsIssueItem_1.GoodsIssueItem();
                    goodsIssueItem.item = await entityManager.findOne(Item_1.Item, {
                        where: { itemId: item.itemId },
                    });
                    goodsIssueItem.quantity = item.quantity.toString();
                }
                goodsIssueItem.goodsIssue = goodsIssue;
                const origGoodsIssueQuantity = goodsIssueItem.quantity;
                goodsIssueItem.quantity = item.quantity.toString();
                goodsIssueItem = await entityManager.save(GoodsIssueItem_1.GoodsIssueItem, goodsIssueItem);
                const itemWarehouse = await entityManager.findOne(ItemWarehouse_1.ItemWarehouse, {
                    where: {
                        itemId: item.itemId,
                        warehouse: { warehouseCode: goodsIssue.warehouse.warehouseCode },
                    },
                });
                if (isNew) {
                    const newItemWarehouseQuantity = Number(itemWarehouse.quantity) - Number(goodsIssueItem.quantity);
                    if (newItemWarehouseQuantity < 0) {
                        throw Error("Quantity exceeds current item warehouse quantity");
                    }
                    itemWarehouse.quantity =
                        newItemWarehouseQuantity >= 0
                            ? newItemWarehouseQuantity.toString()
                            : "0";
                }
                else {
                    const oldItemWarehouseQuantity = Number(itemWarehouse.quantity) + Number(origGoodsIssueQuantity);
                    const newItemWarehouseQuantity = oldItemWarehouseQuantity - Number(item.quantity);
                    if (newItemWarehouseQuantity < 0) {
                        throw Error("Quantity exceeds current item warehouse quantity");
                    }
                    itemWarehouse.quantity =
                        newItemWarehouseQuantity >= 0
                            ? newItemWarehouseQuantity.toString()
                            : "0";
                }
                await entityManager.save(ItemWarehouse_1.ItemWarehouse, itemWarehouse);
            }
            goodsIssue = await entityManager.save(GoodsIssue_1.GoodsIssue, goodsIssue);
            goodsIssue = await entityManager.findOne(GoodsIssue_1.GoodsIssue, {
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
            return goodsIssue;
        });
    }
    async updateStatus(goodsIssueCode, dto) {
        return await this.goodsIssueRepo.manager.transaction(async (entityManager) => {
            const { status } = dto;
            let goodsIssue = await entityManager.findOne(GoodsIssue_1.GoodsIssue, {
                select: deafaultGoodsIssueSelect,
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
                throw Error(goods_issue_constant_1.GOODSISSUE_ERROR_NOT_FOUND);
            }
            if (goodsIssue.status === "COMPLETED" ||
                goodsIssue.status === "CANCELLED" ||
                goodsIssue.status === "REJECTED") {
                throw Error("Not allowed to update status, goods issue was already - " +
                    goodsIssue.status.toLowerCase());
            }
            if (goodsIssue.status === "REJECTED") {
                throw Error("Not allowed to update status, goods issue was already being - " +
                    goodsIssue.status.toLowerCase());
            }
            if (goodsIssue.status === "PENDING") {
                if (status === "PENDING") {
                    throw Error("Not allowed to update status, goods issue was already - " +
                        goodsIssue.status.toLowerCase());
                }
            }
            if (status === "CANCELLED" ||
                status === "REJECTED" ||
                status === "COMPLETED") {
                goodsIssue.notes = dto["notes"];
            }
            delete goodsIssue.goodsIssueItems;
            goodsIssue.status = status;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            goodsIssue.dateLastUpdated = timestamp;
            goodsIssue = await entityManager.save(GoodsIssue_1.GoodsIssue, goodsIssue);
            goodsIssue = await entityManager.findOne(GoodsIssue_1.GoodsIssue, {
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
            if (status === "CANCELLED" || status === "REJECTED") {
                for (const item of goodsIssue.goodsIssueItems) {
                    let itemWarehouse = await entityManager.findOne(ItemWarehouse_1.ItemWarehouse, {
                        where: {
                            itemId: item.item.itemId,
                            warehouse: {
                                warehouseId: goodsIssue.warehouse.warehouseId,
                            },
                        },
                    });
                    const newQuantity = Number(itemWarehouse.quantity) + Number(item.quantity);
                    itemWarehouse.quantity = newQuantity.toString();
                    itemWarehouse = await entityManager.save(ItemWarehouse_1.ItemWarehouse, itemWarehouse);
                }
            }
            return goodsIssue;
        });
    }
};
GoodsIssueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(GoodsIssue_1.GoodsIssue)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GoodsIssueService);
exports.GoodsIssueService = GoodsIssueService;
//# sourceMappingURL=goods-issue.service.js.map