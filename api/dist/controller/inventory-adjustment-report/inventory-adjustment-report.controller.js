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
exports.InventoryAdjustmentReportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const inventory_adjustment_report_create_dto_1 = require("../../core/dto/inventory-adjustment-report/inventory-adjustment-report.create.dto");
const inventory_adjustment_report_update_dto_1 = require("../../core/dto/inventory-adjustment-report/inventory-adjustment-report.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const inventory_adjustment_report_service_1 = require("../../services/inventory-adjustment-report.service");
let InventoryAdjustmentReportController = class InventoryAdjustmentReportController {
    constructor(inventoryAdjustmentReportService) {
        this.inventoryAdjustmentReportService = inventoryAdjustmentReportService;
    }
    async getDetails(inventoryAdjustmentReportCode) {
        const res = {};
        try {
            res.data = await this.inventoryAdjustmentReportService.getByCode(inventoryAdjustmentReportCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPaginated(params) {
        const res = {};
        try {
            res.data = await this.inventoryAdjustmentReportService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(inventoryAdjustmentReportDto) {
        const res = {};
        try {
            res.data = await this.inventoryAdjustmentReportService.create(inventoryAdjustmentReportDto);
            res.success = true;
            res.message = `Inventory Adjustment Report ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(inventoryAdjustmentReportCode, dto) {
        const res = {};
        try {
            res.data = await this.inventoryAdjustmentReportService.update(inventoryAdjustmentReportCode, dto);
            res.success = true;
            res.message = `Inventory Adjustment Report ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async processStatus(inventoryAdjustmentReportCode, dto) {
        const res = {};
        try {
            res.data = await this.inventoryAdjustmentReportService.updateStatus(inventoryAdjustmentReportCode, dto);
            res.success = true;
            res.message = `Inventory Adjustment Report ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async closeReport(inventoryAdjustmentReportCode, dto) {
        const res = {};
        try {
            res.data = await this.inventoryAdjustmentReportService.updateStatus(inventoryAdjustmentReportCode, dto);
            res.success = true;
            res.message = `Inventory Adjustment Report ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
};
__decorate([
    (0, common_1.Get)("/:inventoryAdjustmentReportCode"),
    __param(0, (0, common_1.Param)("inventoryAdjustmentReportCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryAdjustmentReportController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], InventoryAdjustmentReportController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_adjustment_report_create_dto_1.CreateInventoryAdjustmentReportDto]),
    __metadata("design:returntype", Promise)
], InventoryAdjustmentReportController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:inventoryAdjustmentReportCode"),
    __param(0, (0, common_1.Param)("inventoryAdjustmentReportCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_adjustment_report_update_dto_1.UpdateInventoryAdjustmentReportDto]),
    __metadata("design:returntype", Promise)
], InventoryAdjustmentReportController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("/processStatus/:inventoryAdjustmentReportCode/"),
    __param(0, (0, common_1.Param)("inventoryAdjustmentReportCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_adjustment_report_update_dto_1.ProcessInventoryAdjustmentReportStatusDto]),
    __metadata("design:returntype", Promise)
], InventoryAdjustmentReportController.prototype, "processStatus", null);
__decorate([
    (0, common_1.Put)("/closeReport/:inventoryAdjustmentReportCode/"),
    __param(0, (0, common_1.Param)("inventoryAdjustmentReportCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_adjustment_report_update_dto_1.CloseInventoryAdjustmentReportStatusDto]),
    __metadata("design:returntype", Promise)
], InventoryAdjustmentReportController.prototype, "closeReport", null);
InventoryAdjustmentReportController = __decorate([
    (0, swagger_1.ApiTags)("inventoryAdjustmentReport"),
    (0, common_1.Controller)("inventoryAdjustmentReport"),
    __metadata("design:paramtypes", [inventory_adjustment_report_service_1.InventoryAdjustmentReportService])
], InventoryAdjustmentReportController);
exports.InventoryAdjustmentReportController = InventoryAdjustmentReportController;
//# sourceMappingURL=inventory-adjustment-report.controller.js.map