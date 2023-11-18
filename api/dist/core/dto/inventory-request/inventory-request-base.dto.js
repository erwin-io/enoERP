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
exports.DefaultInventoryRequestDto = exports.InventoryRequestItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class InventoryRequestItemDto {
    constructor() {
        this.quantity = 0;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InventoryRequestItemDto.prototype, "itemId", void 0);
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
], InventoryRequestItemDto.prototype, "quantity", void 0);
exports.InventoryRequestItemDto = InventoryRequestItemDto;
class DefaultInventoryRequestDto {
    constructor() {
        this.inventoryRequestItems = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DefaultInventoryRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: InventoryRequestItemDto,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => InventoryRequestItemDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], DefaultInventoryRequestDto.prototype, "inventoryRequestItems", void 0);
exports.DefaultInventoryRequestDto = DefaultInventoryRequestDto;
//# sourceMappingURL=inventory-request-base.dto.js.map