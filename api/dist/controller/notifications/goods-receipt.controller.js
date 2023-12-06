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
exports.GoodsReceiptController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const goods_receipt_create_dto_1 = require("../../core/dto/goods-receipt/goods-receipt.create.dto");
const goods_receipt_update_dto_1 = require("../../core/dto/goods-receipt/goods-receipt.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const goods_receipt_service_1 = require("../../services/goods-receipt.service");
let GoodsReceiptController = class GoodsReceiptController {
    constructor(goodsReceiptService) {
        this.goodsReceiptService = goodsReceiptService;
    }
    async getDetails(goodsReceiptCode) {
        const res = {};
        try {
            res.data = await this.goodsReceiptService.getByCode(goodsReceiptCode);
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
            res.data = await this.goodsReceiptService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(goodsReceiptDto) {
        const res = {};
        try {
            res.data = await this.goodsReceiptService.create(goodsReceiptDto);
            res.success = true;
            res.message = `Goods Receipt ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(goodsReceiptCode, dto) {
        const res = {};
        try {
            res.data = await this.goodsReceiptService.update(goodsReceiptCode, dto);
            res.success = true;
            res.message = `Goods Receipt ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateStatus(goodsReceiptCode, dto) {
        const res = {};
        try {
            res.data = await this.goodsReceiptService.updateStatus(goodsReceiptCode, dto);
            res.success = true;
            res.message = `Goods Receipt ${api_response_constant_1.UPDATE_SUCCESS}`;
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
    (0, common_1.Get)("/:goodsReceiptCode"),
    __param(0, (0, common_1.Param)("goodsReceiptCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoodsReceiptController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], GoodsReceiptController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [goods_receipt_create_dto_1.CreateGoodsReceiptDto]),
    __metadata("design:returntype", Promise)
], GoodsReceiptController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:goodsReceiptCode"),
    __param(0, (0, common_1.Param)("goodsReceiptCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, goods_receipt_update_dto_1.UpdateGoodsReceiptDto]),
    __metadata("design:returntype", Promise)
], GoodsReceiptController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("/updateStatus/:goodsReceiptCode/"),
    __param(0, (0, common_1.Param)("goodsReceiptCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, goods_receipt_update_dto_1.UpdateGoodsReceiptStatusDto]),
    __metadata("design:returntype", Promise)
], GoodsReceiptController.prototype, "updateStatus", null);
GoodsReceiptController = __decorate([
    (0, swagger_1.ApiTags)("goodsReceipt"),
    (0, common_1.Controller)("goodsReceipt"),
    __metadata("design:paramtypes", [goods_receipt_service_1.GoodsReceiptService])
], GoodsReceiptController);
exports.GoodsReceiptController = GoodsReceiptController;
//# sourceMappingURL=goods-receipt.controller.js.map