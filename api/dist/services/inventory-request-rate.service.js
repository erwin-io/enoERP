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
exports.InventoryRequestRateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const inventory_request_rate_constant_1 = require("../common/constant/inventory-request-rate.constant");
const item_constant_1 = require("../common/constant/item.constant");
const utils_1 = require("../common/utils/utils");
const InventoryRequestRate_1 = require("../db/entities/InventoryRequestRate");
const Item_1 = require("../db/entities/Item");
const typeorm_2 = require("typeorm");
let InventoryRequestRateService = class InventoryRequestRateService {
    constructor(inventoryRequestRateRepo) {
        this.inventoryRequestRateRepo = inventoryRequestRateRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.inventoryRequestRateRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
                relations: {
                    item: {
                        itemCategory: true,
                    },
                },
            }),
            this.inventoryRequestRateRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByCode(inventoryRequestRateCode) {
        const result = await this.inventoryRequestRateRepo.findOne({
            where: {
                inventoryRequestRateCode,
                active: true,
            },
            relations: {
                item: {
                    itemCategory: true,
                },
            },
        });
        if (!result) {
            throw Error(inventory_request_rate_constant_1.INVENTORYREQUESTRATE_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.inventoryRequestRateRepo.manager.transaction(async (entityManager) => {
            let inventoryRequestRate = new InventoryRequestRate_1.InventoryRequestRate();
            inventoryRequestRate.rateName = dto.rateName;
            inventoryRequestRate.rate = dto.rate.toString();
            inventoryRequestRate.minQuantity = dto.minQuantity.toString();
            inventoryRequestRate.maxQuantity = dto.maxQuantity.toString();
            const item = await entityManager.findOne(Item_1.Item, {
                where: { itemId: dto.itemId, active: true },
            });
            if (!item) {
                throw Error(item_constant_1.ITEM_ERROR_NOT_FOUND);
            }
            if (Number(inventoryRequestRate.minQuantity) === 1 ||
                Number(inventoryRequestRate.maxQuantity) === 1) {
                throw Error("Not allowed!, max and min quantity should not be equal to base rate!");
            }
            const baseRate = await entityManager.findOne(InventoryRequestRate_1.InventoryRequestRate, {
                where: {
                    item: {
                        itemId: dto.itemId,
                    },
                    active: true,
                    baseRate: true,
                },
            });
            if (Number(dto.rate) <= Number(baseRate.rate) &&
                Number(dto.minQuantity) > 1) {
                throw Error(`Invalid rate!, rate should not be less than the base rate, since min quantity is ${dto.minQuantity}!`);
            }
            inventoryRequestRate.item = item;
            inventoryRequestRate = await entityManager.save(inventoryRequestRate);
            inventoryRequestRate.inventoryRequestRateCode = (0, utils_1.generateIndentityCode)(inventoryRequestRate.inventoryRequestRateId);
            return await entityManager.save(InventoryRequestRate_1.InventoryRequestRate, inventoryRequestRate);
        });
    }
    async update(inventoryRequestRateCode, dto) {
        return await this.inventoryRequestRateRepo.manager.transaction(async (entityManager) => {
            const inventoryRequestRate = await entityManager.findOne(InventoryRequestRate_1.InventoryRequestRate, {
                where: {
                    inventoryRequestRateCode,
                    active: true,
                },
                relations: {
                    item: {
                        itemCategory: true,
                    },
                },
            });
            if (!inventoryRequestRate) {
                throw Error(inventory_request_rate_constant_1.INVENTORYREQUESTRATE_ERROR_NOT_FOUND);
            }
            if (inventoryRequestRate.baseRate &&
                dto.minQuantity !== Number(inventoryRequestRate.minQuantity) &&
                dto.maxQuantity !== Number(inventoryRequestRate.maxQuantity)) {
                throw Error("Not allowed to update base rate!");
            }
            if ((!inventoryRequestRate.baseRate &&
                Number(inventoryRequestRate.minQuantity) === 1) ||
                Number(inventoryRequestRate.maxQuantity) === 1) {
                throw Error("Not allowed!, max and min quantity should not be equal to base rate!");
            }
            const baseRate = await entityManager.findOne(InventoryRequestRate_1.InventoryRequestRate, {
                where: {
                    item: {
                        itemId: inventoryRequestRate.item.itemId,
                    },
                    active: true,
                    baseRate: true,
                },
            });
            if (!inventoryRequestRate.baseRate &&
                Number(baseRate.rate) > Number(dto.rate) * Number(dto.minQuantity)) {
                throw Error(`Invalid rate!, rate should not be less than the base rate, since min quantity is ${dto.minQuantity}!`);
            }
            inventoryRequestRate.rateName = dto.rateName;
            inventoryRequestRate.rate = dto.rate.toString();
            inventoryRequestRate.minQuantity = dto.minQuantity.toString();
            inventoryRequestRate.maxQuantity = dto.maxQuantity.toString();
            return await entityManager.save(InventoryRequestRate_1.InventoryRequestRate, inventoryRequestRate);
        });
    }
    async delete(inventoryRequestRateCode) {
        return await this.inventoryRequestRateRepo.manager.transaction(async (entityManager) => {
            const inventoryRequestRate = await entityManager.findOne(InventoryRequestRate_1.InventoryRequestRate, {
                where: {
                    inventoryRequestRateCode,
                    active: true,
                },
            });
            if (!inventoryRequestRate) {
                throw Error(inventory_request_rate_constant_1.INVENTORYREQUESTRATE_ERROR_NOT_FOUND);
            }
            if (inventoryRequestRate.baseRate) {
                throw Error(inventory_request_rate_constant_1.INVENTORYREQUESTRATE_BASERATE_ERROR_NOT_FOUND);
            }
            inventoryRequestRate.active = false;
            return await entityManager.save(InventoryRequestRate_1.InventoryRequestRate, inventoryRequestRate);
        });
    }
};
InventoryRequestRateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(InventoryRequestRate_1.InventoryRequestRate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InventoryRequestRateService);
exports.InventoryRequestRateService = InventoryRequestRateService;
//# sourceMappingURL=inventory-request-rate.service.js.map