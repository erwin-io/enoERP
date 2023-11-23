"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRequestRateModule = void 0;
const common_1 = require("@nestjs/common");
const inventory_request_rate_controller_1 = require("./inventory-request-rate.controller");
const InventoryRequestRate_1 = require("../../db/entities/InventoryRequestRate");
const inventory_request_rate_service_1 = require("../../services/inventory-request-rate.service");
const typeorm_1 = require("@nestjs/typeorm");
let InventoryRequestRateModule = class InventoryRequestRateModule {
};
InventoryRequestRateModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([InventoryRequestRate_1.InventoryRequestRate])],
        controllers: [inventory_request_rate_controller_1.InventoryRequestRateController],
        providers: [inventory_request_rate_service_1.InventoryRequestRateService],
        exports: [inventory_request_rate_service_1.InventoryRequestRateService],
    })
], InventoryRequestRateModule);
exports.InventoryRequestRateModule = InventoryRequestRateModule;
//# sourceMappingURL=inventory-request-rate.module.js.map