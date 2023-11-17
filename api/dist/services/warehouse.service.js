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
exports.WarehouseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const warehouse_constant_1 = require("../common/constant/warehouse.constant");
const utils_1 = require("../common/utils/utils");
const Item_1 = require("../db/entities/Item");
const ItemWarehouse_1 = require("../db/entities/ItemWarehouse");
const Warehouse_1 = require("../db/entities/Warehouse");
const typeorm_2 = require("typeorm");
let WarehouseService = class WarehouseService {
    constructor(warehouseRepo) {
        this.warehouseRepo = warehouseRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.warehouseRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
            }),
            this.warehouseRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getById(warehouseId) {
        const result = await this.warehouseRepo.findOne({
            where: {
                warehouseId,
                active: true,
            },
        });
        if (!result) {
            throw Error(warehouse_constant_1.WAREHOUSE_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.warehouseRepo.manager.transaction(async (entityManager) => {
            let warehouse = new Warehouse_1.Warehouse();
            warehouse.warehouseCode = dto.warehouseCode;
            warehouse.name = dto.name;
            warehouse = await entityManager.save(warehouse);
            const items = await entityManager.find(Item_1.Item);
            const itemWarehouses = [];
            for (const item of items) {
                const itemWarehouse = new ItemWarehouse_1.ItemWarehouse();
                itemWarehouse.item = item;
                itemWarehouse.warehouse = warehouse;
                itemWarehouses.push(itemWarehouse);
            }
            await entityManager.insert(ItemWarehouse_1.ItemWarehouse, itemWarehouses);
            return warehouse;
        });
    }
    async update(warehouseId, dto) {
        return await this.warehouseRepo.manager.transaction(async (entityManager) => {
            const warehouse = await entityManager.findOne(Warehouse_1.Warehouse, {
                where: {
                    warehouseId,
                    active: true,
                },
            });
            if (!warehouse) {
                throw Error(warehouse_constant_1.WAREHOUSE_ERROR_NOT_FOUND);
            }
            warehouse.name = dto.name;
            warehouse.warehouseCode = dto.warehouseCode;
            return await entityManager.save(Warehouse_1.Warehouse, warehouse);
        });
    }
    async delete(warehouseId) {
        return await this.warehouseRepo.manager.transaction(async (entityManager) => {
            const warehouse = await entityManager.findOne(Warehouse_1.Warehouse, {
                where: {
                    warehouseId,
                    active: true,
                },
            });
            if (!warehouse) {
                throw Error(warehouse_constant_1.WAREHOUSE_ERROR_NOT_FOUND);
            }
            warehouse.active = false;
            return await entityManager.save(Warehouse_1.Warehouse, warehouse);
        });
    }
};
WarehouseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Warehouse_1.Warehouse)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WarehouseService);
exports.WarehouseService = WarehouseService;
//# sourceMappingURL=warehouse.service.js.map