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
exports.WarehouseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const warehouse_create_dto_1 = require("../../core/dto/warehouse/warehouse.create.dto");
const warehouse_update_dto_1 = require("../../core/dto/warehouse/warehouse.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const warehouse_service_1 = require("../../services/warehouse.service");
let WarehouseController = class WarehouseController {
    constructor(warehouseService) {
        this.warehouseService = warehouseService;
    }
    async getDetails(warehouseId) {
        const res = {};
        try {
            res.data = await this.warehouseService.getById(warehouseId);
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
            res.data = await this.warehouseService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(warehouseDto) {
        const res = {};
        try {
            res.data = await this.warehouseService.create(warehouseDto);
            res.success = true;
            res.message = `Warehouse ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(warehouseId, dto) {
        const res = {};
        try {
            res.data = await this.warehouseService.update(warehouseId, dto);
            res.success = true;
            res.message = `Warehouse ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(warehouseId) {
        const res = {};
        try {
            res.data = await this.warehouseService.delete(warehouseId);
            res.success = true;
            res.message = `Warehouse ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:warehouseId"),
    __param(0, (0, common_1.Param)("warehouseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [warehouse_create_dto_1.CreateWarehouseDto]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:warehouseId"),
    __param(0, (0, common_1.Param)("warehouseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, warehouse_update_dto_1.UpdateWarehouseDto]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:warehouseId"),
    __param(0, (0, common_1.Param)("warehouseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WarehouseController.prototype, "delete", null);
WarehouseController = __decorate([
    (0, swagger_1.ApiTags)("warehouse"),
    (0, common_1.Controller)("warehouse"),
    __metadata("design:paramtypes", [warehouse_service_1.WarehouseService])
], WarehouseController);
exports.WarehouseController = WarehouseController;
//# sourceMappingURL=warehouse.controller.js.map