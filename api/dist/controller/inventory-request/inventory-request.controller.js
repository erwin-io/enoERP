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
exports.InventoryRequestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const inventory_request_create_dto_1 = require("../../core/dto/inventory-request/inventory-request.create.dto");
const inventory_request_update_dto_1 = require("../../core/dto/inventory-request/inventory-request.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const inventory_request_service_1 = require("../../services/inventory-request.service");
let InventoryRequestController = class InventoryRequestController {
    constructor(inventoryRequestService) {
        this.inventoryRequestService = inventoryRequestService;
    }
    async getDetails(inventoryRequestCode) {
        const res = {};
        try {
            res.data = await this.inventoryRequestService.getByCode(inventoryRequestCode);
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
            res.data = await this.inventoryRequestService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(inventoryRequestDto) {
        const res = {};
        try {
            res.data = await this.inventoryRequestService.create(inventoryRequestDto);
            res.success = true;
            res.message = `Inventory Request ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(inventoryRequestCode, dto) {
        const res = {};
        try {
            res.data = await this.inventoryRequestService.update(inventoryRequestCode, dto);
            res.success = true;
            res.message = `Inventory Request ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateStatus(inventoryRequestCode, dto) {
        const res = {};
        try {
            res.data = await this.inventoryRequestService.updateStatus(inventoryRequestCode, dto);
            res.success = true;
            res.message = `Inventory Request ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:inventoryRequestCode"),
    __param(0, (0, common_1.Param)("inventoryRequestCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryRequestController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], InventoryRequestController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_request_create_dto_1.CreateInventoryRequestDto]),
    __metadata("design:returntype", Promise)
], InventoryRequestController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:inventoryRequestCode"),
    __param(0, (0, common_1.Param)("inventoryRequestCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_request_update_dto_1.UpdateInventoryRequestDto]),
    __metadata("design:returntype", Promise)
], InventoryRequestController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("/updateStatus/:inventoryRequestCode/:status"),
    __param(0, (0, common_1.Param)("inventoryRequestCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_request_update_dto_1.UpdateInventoryRequestStatusDto]),
    __metadata("design:returntype", Promise)
], InventoryRequestController.prototype, "updateStatus", null);
InventoryRequestController = __decorate([
    (0, swagger_1.ApiTags)("inventoryRequest"),
    (0, common_1.Controller)("inventoryRequest"),
    __metadata("design:paramtypes", [inventory_request_service_1.InventoryRequestService])
], InventoryRequestController);
exports.InventoryRequestController = InventoryRequestController;
//# sourceMappingURL=inventory-request.controller.js.map