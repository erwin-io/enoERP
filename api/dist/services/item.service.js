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
exports.ItemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const item_category_constant_1 = require("../common/constant/item-category.constant");
const item_constant_1 = require("../common/constant/item.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const warehouse_constant_1 = require("../common/constant/warehouse.constant");
const utils_1 = require("../common/utils/utils");
const Branch_1 = require("../db/entities/Branch");
const InventoryRequestRate_1 = require("../db/entities/InventoryRequestRate");
const Item_1 = require("../db/entities/Item");
const ItemBranch_1 = require("../db/entities/ItemBranch");
const ItemCategory_1 = require("../db/entities/ItemCategory");
const ItemWarehouse_1 = require("../db/entities/ItemWarehouse");
const Warehouse_1 = require("../db/entities/Warehouse");
const typeorm_2 = require("typeorm");
let ItemService = class ItemService {
    constructor(itemRepo) {
        this.itemRepo = itemRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.itemRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
                relations: {
                    itemCategory: true,
                },
            }),
            this.itemRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getById(itemId) {
        const result = await this.itemRepo.findOne({
            where: {
                itemId,
                active: true,
            },
            relations: {
                itemCategory: true,
            },
        });
        if (!result) {
            throw Error(item_constant_1.ITEM_ERROR_NOT_FOUND);
        }
        return result;
    }
    async getByCode(itemCode = "") {
        var _a;
        const result = await this.itemRepo.findOne({
            where: {
                itemCode: (_a = itemCode === null || itemCode === void 0 ? void 0 : itemCode.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                active: true,
            },
            relations: {
                itemCategory: true,
            },
        });
        if (!result) {
            throw Error(item_constant_1.ITEM_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.itemRepo.manager.transaction(async (entityManager) => {
            const hasWareHouse = await entityManager.find(Warehouse_1.Warehouse, {
                where: { active: true },
            });
            if (!hasWareHouse) {
                throw Error(warehouse_constant_1.WAREHOUSE_ERROR_NO_SETUP);
            }
            let item = new Item_1.Item();
            item.itemCode = dto.itemCode.toLowerCase();
            item.itemName = dto.itemName;
            item.itemDescription = dto.itemDescription;
            item.price = dto.price ? dto.price.toString() : "0";
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            item.dateAdded = timestamp;
            const itemCategory = await entityManager.findOne(ItemCategory_1.ItemCategory, {
                where: {
                    itemCategoryId: dto.itemCategoryId,
                },
            });
            if (!itemCategory) {
                throw Error(item_category_constant_1.ITEMCATEGORY_ERROR_NOT_FOUND);
            }
            item.itemCategory = itemCategory;
            item = await entityManager.save(item);
            const warehouses = await entityManager.find(Warehouse_1.Warehouse);
            const itemWarehouses = [];
            for (const warehouse of warehouses) {
                const itemWarehouse = new ItemWarehouse_1.ItemWarehouse();
                itemWarehouse.item = item;
                itemWarehouse.warehouse = warehouse;
                itemWarehouses.push(itemWarehouse);
            }
            await entityManager.insert(ItemWarehouse_1.ItemWarehouse, itemWarehouses);
            const branches = await entityManager.find(Branch_1.Branch);
            const itemBranches = [];
            for (const branch of branches) {
                const itemBranch = new ItemBranch_1.ItemBranch();
                itemBranch.item = item;
                itemBranch.branch = branch;
                itemBranches.push(itemBranch);
            }
            await entityManager.insert(ItemBranch_1.ItemBranch, itemBranches);
            let inventoryRequestRate = new InventoryRequestRate_1.InventoryRequestRate();
            inventoryRequestRate.rateName = "1pc";
            inventoryRequestRate.rate = dto.price.toString();
            inventoryRequestRate.minQuantity = "1";
            inventoryRequestRate.maxQuantity = "1";
            inventoryRequestRate.item = item;
            inventoryRequestRate.baseRate = true;
            inventoryRequestRate = await entityManager.save(InventoryRequestRate_1.InventoryRequestRate, inventoryRequestRate);
            inventoryRequestRate.inventoryRequestRateCode = (0, utils_1.generateIndentityCode)(inventoryRequestRate.inventoryRequestRateId);
            await entityManager.save(InventoryRequestRate_1.InventoryRequestRate, inventoryRequestRate);
            return await entityManager.findOne(Item_1.Item, {
                where: {
                    itemId: item.itemId,
                },
                relations: {
                    itemCategory: true,
                },
            });
        });
    }
    async update(itemId, dto) {
        return await this.itemRepo.manager.transaction(async (entityManager) => {
            const item = await entityManager.findOne(Item_1.Item, {
                where: {
                    itemId,
                    active: true,
                },
                relations: {
                    itemCategory: true,
                },
            });
            if (!item) {
                throw Error(item_constant_1.ITEM_ERROR_NOT_FOUND);
            }
            item.itemCode = dto.itemCode.toLowerCase();
            item.itemName = dto.itemName;
            item.itemDescription = dto.itemDescription;
            item.price = dto.price ? dto.price.toString() : "0";
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            item.dateLastUpdated = timestamp;
            const itemCategory = await entityManager.findOne(ItemCategory_1.ItemCategory, {
                where: {
                    itemCategoryId: dto.itemCategoryId,
                },
            });
            if (!itemCategory) {
                throw Error(item_category_constant_1.ITEMCATEGORY_ERROR_NOT_FOUND);
            }
            item.itemCategory = itemCategory;
            return await entityManager.save(Item_1.Item, item);
        });
    }
    async delete(itemId) {
        return await this.itemRepo.manager.transaction(async (entityManager) => {
            const item = await entityManager.findOne(Item_1.Item, {
                where: {
                    itemId,
                    active: true,
                },
                relations: {
                    itemCategory: true,
                },
            });
            if (!item) {
                throw Error(item_constant_1.ITEM_ERROR_NOT_FOUND);
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            item.dateLastUpdated = timestamp;
            item.active = false;
            return await entityManager.save(Item_1.Item, item);
        });
    }
};
ItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Item_1.Item)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ItemService);
exports.ItemService = ItemService;
//# sourceMappingURL=item.service.js.map