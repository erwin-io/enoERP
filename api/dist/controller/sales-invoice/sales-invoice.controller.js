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
exports.SalesInvoiceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const sales_invoice_create_dto_1 = require("../../core/dto/sales-invoice/sales-invoice.create.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const sales_invoice_service_1 = require("../../services/sales-invoice.service");
let SalesInvoiceController = class SalesInvoiceController {
    constructor(salesInvoiceService) {
        this.salesInvoiceService = salesInvoiceService;
    }
    async getDetails(salesInvoiceCode) {
        const res = {};
        try {
            res.data = await this.salesInvoiceService.getByCode(salesInvoiceCode);
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
            res.data = await this.salesInvoiceService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(salesInvoiceDto) {
        const res = {};
        try {
            res.data = await this.salesInvoiceService.create(salesInvoiceDto);
            res.success = true;
            res.message = `Sales Invoice ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async void(salesInvoiceCode) {
        const res = {};
        try {
            res.data = await this.salesInvoiceService.void(salesInvoiceCode);
            res.success = true;
            res.message = `Sales Invoice ${api_response_constant_1.UPDATE_SUCCESS}`;
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
    (0, common_1.Get)("/:salesInvoiceCode"),
    __param(0, (0, common_1.Param)("salesInvoiceCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesInvoiceController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], SalesInvoiceController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sales_invoice_create_dto_1.CreateSalesInvoiceDto]),
    __metadata("design:returntype", Promise)
], SalesInvoiceController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)("/void/:salesInvoiceCode/"),
    __param(0, (0, common_1.Param)("salesInvoiceCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesInvoiceController.prototype, "void", null);
SalesInvoiceController = __decorate([
    (0, swagger_1.ApiTags)("salesInvoice"),
    (0, common_1.Controller)("salesInvoice"),
    __metadata("design:paramtypes", [sales_invoice_service_1.SalesInvoiceService])
], SalesInvoiceController);
exports.SalesInvoiceController = SalesInvoiceController;
//# sourceMappingURL=sales-invoice.controller.js.map