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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSalesInvoiceDto = exports.SalesInvoicePaymentDto = exports.SalesInvoiceItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class SalesInvoiceItemDto {
    constructor() {
        this.quantity = 0;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SalesInvoiceItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: 0,
        type: Number,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNotIn)([0]),
    (0, class_validator_1.IsNumberString)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        var _a;
        return (_a = obj[key]) === null || _a === void 0 ? void 0 : _a.toString();
    }),
    __metadata("design:type", Object)
], SalesInvoiceItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: 0,
        type: Number,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNotIn)([0]),
    (0, class_validator_1.IsNumberString)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        var _a;
        return (_a = obj[key]) === null || _a === void 0 ? void 0 : _a.toString();
    }),
    __metadata("design:type", Number)
], SalesInvoiceItemDto.prototype, "unitPrice", void 0);
exports.SalesInvoiceItemDto = SalesInvoiceItemDto;
class SalesInvoicePaymentDto {
    constructor() {
        this.amount = 0;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        default: "CASH",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(["CASH", "CREDIT CARD", "DEBIT CARD", "MOBILE PAYMENT", "CHECK"]),
    (0, class_validator_1.IsUppercase)(),
    __metadata("design:type", String)
], SalesInvoicePaymentDto.prototype, "paymentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: 0,
        type: Number,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNotIn)([0]),
    (0, class_validator_1.IsNumberString)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        var _a;
        return (_a = obj[key]) === null || _a === void 0 ? void 0 : _a.toString();
    }),
    __metadata("design:type", Object)
], SalesInvoicePaymentDto.prototype, "amount", void 0);
exports.SalesInvoicePaymentDto = SalesInvoicePaymentDto;
class DefaultSalesInvoiceDto {
    constructor() {
        this.salesInvoiceItems = [];
        this.salesInvoicePayments = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultSalesInvoiceDto.prototype, "createdByUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultSalesInvoiceDto.prototype, "branchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: SalesInvoiceItemDto,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => SalesInvoiceItemDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], DefaultSalesInvoiceDto.prototype, "salesInvoiceItems", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: SalesInvoicePaymentDto,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => SalesInvoicePaymentDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], DefaultSalesInvoiceDto.prototype, "salesInvoicePayments", void 0);
exports.DefaultSalesInvoiceDto = DefaultSalesInvoiceDto;
//# sourceMappingURL=sales-invoice-base.dto.js.map