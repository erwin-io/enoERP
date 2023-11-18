"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryMasterlistModule = void 0;
const inventory_masterlist_service_1 = require("../../services/inventory-masterlist.service");
const ItemBranch_1 = require("../../db/entities/ItemBranch");
const common_1 = require("@nestjs/common");
const inventory_masterlist_controller_1 = require("./inventory-masterlist.controller");
const typeorm_1 = require("@nestjs/typeorm");
let InventoryMasterlistModule = class InventoryMasterlistModule {
};
InventoryMasterlistModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ItemBranch_1.ItemBranch])],
        controllers: [inventory_masterlist_controller_1.InventoryMasterlistController],
        providers: [inventory_masterlist_service_1.InventoryMasterlistService],
        exports: [inventory_masterlist_service_1.InventoryMasterlistService],
    })
], InventoryMasterlistModule);
exports.InventoryMasterlistModule = InventoryMasterlistModule;
//# sourceMappingURL=inventory-masterlist.module.js.map