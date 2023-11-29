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
exports.GoodsIssueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const goods_issue_create_dto_1 = require("../../core/dto/goods-issue/goods-issue.create.dto");
const goods_issue_update_dto_1 = require("../../core/dto/goods-issue/goods-issue.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const goods_issue_service_1 = require("../../services/goods-issue.service");
let GoodsIssueController = class GoodsIssueController {
    constructor(goodsIssueService) {
        this.goodsIssueService = goodsIssueService;
    }
    async getDetails(goodsIssueCode) {
        const res = {};
        try {
            res.data = await this.goodsIssueService.getByCode(goodsIssueCode);
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
            res.data = await this.goodsIssueService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(goodsIssueDto) {
        const res = {};
        try {
            res.data = await this.goodsIssueService.create(goodsIssueDto);
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
    async update(goodsIssueCode, dto) {
        const res = {};
        try {
            res.data = await this.goodsIssueService.update(goodsIssueCode, dto);
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
    async updateStatus(goodsIssueCode, dto) {
        const res = {};
        try {
            res.data = await this.goodsIssueService.updateStatus(goodsIssueCode, dto);
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
    (0, common_1.Get)("/:goodsIssueCode"),
    __param(0, (0, common_1.Param)("goodsIssueCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoodsIssueController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], GoodsIssueController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [goods_issue_create_dto_1.CreateGoodsIssueDto]),
    __metadata("design:returntype", Promise)
], GoodsIssueController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:goodsIssueCode"),
    __param(0, (0, common_1.Param)("goodsIssueCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, goods_issue_update_dto_1.UpdateGoodsIssueDto]),
    __metadata("design:returntype", Promise)
], GoodsIssueController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("/updateStatus/:goodsIssueCode/"),
    __param(0, (0, common_1.Param)("goodsIssueCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, goods_issue_update_dto_1.UpdateGoodsIssueStatusDto]),
    __metadata("design:returntype", Promise)
], GoodsIssueController.prototype, "updateStatus", null);
GoodsIssueController = __decorate([
    (0, swagger_1.ApiTags)("goodsIssue"),
    (0, common_1.Controller)("goodsIssue"),
    __metadata("design:paramtypes", [goods_issue_service_1.GoodsIssueService])
], GoodsIssueController);
exports.GoodsIssueController = GoodsIssueController;
//# sourceMappingURL=goods-issue.controller.js.map