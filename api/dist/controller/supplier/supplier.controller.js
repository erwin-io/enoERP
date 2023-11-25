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
exports.SupplierController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const supplier_create_dto_1 = require("../../core/dto/supplier/supplier.create.dto");
const supplier_update_dto_1 = require("../../core/dto/supplier/supplier.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const supplier_service_1 = require("../../services/supplier.service");
let SupplierController = class SupplierController {
    constructor(supplierService) {
        this.supplierService = supplierService;
    }
    async getDetails(supplierCode) {
        const res = {};
        try {
            res.data = await this.supplierService.getByCode(supplierCode);
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
            res.data = await this.supplierService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(supplierDto) {
        const res = {};
        try {
            res.data = await this.supplierService.create(supplierDto);
            res.success = true;
            res.message = `Supplier ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(supplierCode, dto) {
        const res = {};
        try {
            res.data = await this.supplierService.update(supplierCode, dto);
            res.success = true;
            res.message = `Supplier ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(supplierCode) {
        const res = {};
        try {
            res.data = await this.supplierService.delete(supplierCode);
            res.success = true;
            res.message = `Supplier ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:supplierCode"),
    __param(0, (0, common_1.Param)("supplierCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supplier_create_dto_1.CreateSupplierDto]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:supplierCode"),
    __param(0, (0, common_1.Param)("supplierCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, supplier_update_dto_1.UpdateSupplierDto]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:supplierCode"),
    __param(0, (0, common_1.Param)("supplierCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "delete", null);
SupplierController = __decorate([
    (0, swagger_1.ApiTags)("supplier"),
    (0, common_1.Controller)("supplier"),
    __metadata("design:paramtypes", [supplier_service_1.SupplierService])
], SupplierController);
exports.SupplierController = SupplierController;
//# sourceMappingURL=supplier.controller.js.map