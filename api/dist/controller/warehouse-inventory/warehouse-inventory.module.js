"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseInventoryModule = void 0;
const ItemWarehouse_1 = require("./../../db/entities/ItemWarehouse");
const warehouse_inventory_service_1 = require("../../services/warehouse-inventory.service");
const common_1 = require("@nestjs/common");
const warehouse_inventory_controller_1 = require("./warehouse-inventory.controller");
const typeorm_1 = require("@nestjs/typeorm");
let WarehouseInventoryModule = class WarehouseInventoryModule {
};
WarehouseInventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ItemWarehouse_1.ItemWarehouse])],
        controllers: [warehouse_inventory_controller_1.WarehouseInventoryController],
        providers: [warehouse_inventory_service_1.WarehouseInventoryService],
        exports: [warehouse_inventory_service_1.WarehouseInventoryService],
    })
], WarehouseInventoryModule);
exports.WarehouseInventoryModule = WarehouseInventoryModule;
//# sourceMappingURL=warehouse-inventory.module.js.map