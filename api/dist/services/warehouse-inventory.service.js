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
exports.WarehouseInventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const item_constant_1 = require("../common/constant/item.constant");
const utils_1 = require("../common/utils/utils");
const ItemWarehouse_1 = require("../db/entities/ItemWarehouse");
const typeorm_2 = require("typeorm");
let WarehouseInventoryService = class WarehouseInventoryService {
    constructor(itemWarehouse) {
        this.itemWarehouse = itemWarehouse;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        if (condition.item) {
            condition.item.active = true;
        }
        else {
            condition.item = {
                active: true,
            };
        }
        const [results, total] = await Promise.all([
            this.itemWarehouse.find({
                where: Object.assign({}, condition),
                skip,
                take,
                order,
                relations: {
                    item: {
                        itemCategory: true,
                    },
                    warehouse: true,
                },
            }),
            this.itemWarehouse.count({
                where: Object.assign({}, condition),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByItemCode(warehouseCode, itemCode) {
        var _a;
        const result = await this.itemWarehouse.findOne({
            where: {
                item: {
                    itemCode: (_a = itemCode === null || itemCode === void 0 ? void 0 : itemCode.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                    active: true,
                },
                warehouse: {
                    warehouseCode,
                },
            },
            relations: {
                item: {
                    itemCategory: true,
                },
                warehouse: true,
            },
        });
        if (!result) {
            throw Error(item_constant_1.ITEM_ERROR_NOT_FOUND);
        }
        return result;
    }
};
WarehouseInventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ItemWarehouse_1.ItemWarehouse)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WarehouseInventoryService);
exports.WarehouseInventoryService = WarehouseInventoryService;
//# sourceMappingURL=warehouse-inventory.service.js.map