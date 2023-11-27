"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryAdjustmentReportModule = void 0;
const common_1 = require("@nestjs/common");
const inventory_adjustment_report_controller_1 = require("./inventory-adjustment-report.controller");
const InventoryAdjustmentReport_1 = require("../../db/entities/InventoryAdjustmentReport");
const inventory_adjustment_report_service_1 = require("../../services/inventory-adjustment-report.service");
const typeorm_1 = require("@nestjs/typeorm");
let InventoryAdjustmentReportModule = class InventoryAdjustmentReportModule {
};
InventoryAdjustmentReportModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([InventoryAdjustmentReport_1.InventoryAdjustmentReport])],
        controllers: [inventory_adjustment_report_controller_1.InventoryAdjustmentReportController],
        providers: [inventory_adjustment_report_service_1.InventoryAdjustmentReportService],
        exports: [inventory_adjustment_report_service_1.InventoryAdjustmentReportService],
    })
], InventoryAdjustmentReportModule);
exports.InventoryAdjustmentReportModule = InventoryAdjustmentReportModule;
//# sourceMappingURL=inventory-adjustment-report.module.js.map