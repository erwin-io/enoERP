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
exports.DefaultGoodsReceiptDto = exports.GoodsReceiptItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class GoodsReceiptItemDto {
    constructor() {
        this.quantity = 0;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GoodsReceiptItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: 0,
        type: Number
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        var _a;
        return (_a = obj[key]) === null || _a === void 0 ? void 0 : _a.toString();
    }),
    __metadata("design:type", Object)
], GoodsReceiptItemDto.prototype, "quantity", void 0);
exports.GoodsReceiptItemDto = GoodsReceiptItemDto;
class DefaultGoodsReceiptDto {
    constructor() {
        this.goodsReceiptItems = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultGoodsReceiptDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: GoodsReceiptItemDto,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => GoodsReceiptItemDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], DefaultGoodsReceiptDto.prototype, "goodsReceiptItems", void 0);
exports.DefaultGoodsReceiptDto = DefaultGoodsReceiptDto;
//# sourceMappingURL=goods-receipt-base.dto.js.map