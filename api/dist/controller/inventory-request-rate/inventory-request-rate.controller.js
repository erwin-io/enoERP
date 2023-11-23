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
exports.InventoryRequestRateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const inventory_request_rate_create_dto_1 = require("../../core/dto/inventory-request-rate/inventory-request-rate.create.dto");
const inventory_request_rate_update_dto_1 = require("../../core/dto/inventory-request-rate/inventory-request-rate.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const inventory_request_rate_service_1 = require("../../services/inventory-request-rate.service");
let InventoryRequestRateController = class InventoryRequestRateController {
    constructor(inventoryRequestRateService) {
        this.inventoryRequestRateService = inventoryRequestRateService;
    }
    async getDetails(inventoryRequestRateCode) {
        const res = {};
        try {
            res.data = await this.inventoryRequestRateService.getByCode(inventoryRequestRateCode);
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
            res.data = await this.inventoryRequestRateService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(inventoryRequestRateDto) {
        const res = {};
        try {
            res.data = await this.inventoryRequestRateService.create(inventoryRequestRateDto);
            res.success = true;
            res.message = `Inventory request rate ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(inventoryRequestRateCode, dto) {
        const res = {};
        try {
            res.data = await this.inventoryRequestRateService.update(inventoryRequestRateCode, dto);
            res.success = true;
            res.message = `Inventory request rate ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(inventoryRequestRateCode) {
        const res = {};
        try {
            res.data = await this.inventoryRequestRateService.delete(inventoryRequestRateCode);
            res.success = true;
            res.message = `Inventory request rate ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:inventoryRequestRateCode"),
    __param(0, (0, common_1.Param)("inventoryRequestRateCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryRequestRateController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], InventoryRequestRateController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_request_rate_create_dto_1.CreateInventoryRequestRateDto]),
    __metadata("design:returntype", Promise)
], InventoryRequestRateController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:inventoryRequestRateCode"),
    __param(0, (0, common_1.Param)("inventoryRequestRateCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_request_rate_update_dto_1.UpdateInventoryRequestRateDto]),
    __metadata("design:returntype", Promise)
], InventoryRequestRateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:inventoryRequestRateCode"),
    __param(0, (0, common_1.Param)("inventoryRequestRateCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryRequestRateController.prototype, "delete", null);
InventoryRequestRateController = __decorate([
    (0, swagger_1.ApiTags)("inventoryRequestRate"),
    (0, common_1.Controller)("inventoryRequestRate"),
    __metadata("design:paramtypes", [inventory_request_rate_service_1.InventoryRequestRateService])
], InventoryRequestRateController);
exports.InventoryRequestRateController = InventoryRequestRateController;
//# sourceMappingURL=inventory-request-rate.controller.js.map