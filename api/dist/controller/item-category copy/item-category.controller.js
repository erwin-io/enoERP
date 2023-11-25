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
exports.ItemCategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const item_category_create_dto_1 = require("../../core/dto/item-category/item-category.create.dto");
const item_category_update_dto_1 = require("../../core/dto/item-category/item-category.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const item_category_service_1 = require("../../services/item-category.service");
let ItemCategoryController = class ItemCategoryController {
    constructor(itemCategoryService) {
        this.itemCategoryService = itemCategoryService;
    }
    async getDetails(itemCategoryCode) {
        const res = {};
        try {
            res.data = await this.itemCategoryService.getByCode(itemCategoryCode);
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
            res.data = await this.itemCategoryService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(itemCategoryDto) {
        const res = {};
        try {
            res.data = await this.itemCategoryService.create(itemCategoryDto);
            res.success = true;
            res.message = `Item category ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(itemCategoryCode, dto) {
        const res = {};
        try {
            res.data = await this.itemCategoryService.update(itemCategoryCode, dto);
            res.success = true;
            res.message = `Item category ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(itemCategoryCode) {
        const res = {};
        try {
            res.data = await this.itemCategoryService.delete(itemCategoryCode);
            res.success = true;
            res.message = `Item category ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:itemCategoryCode"),
    __param(0, (0, common_1.Param)("itemCategoryCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemCategoryController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], ItemCategoryController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_category_create_dto_1.CreateItemCategoryDto]),
    __metadata("design:returntype", Promise)
], ItemCategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:itemCategoryCode"),
    __param(0, (0, common_1.Param)("itemCategoryCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, item_category_update_dto_1.UpdateItemCategoryDto]),
    __metadata("design:returntype", Promise)
], ItemCategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:itemCategoryCode"),
    __param(0, (0, common_1.Param)("itemCategoryCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemCategoryController.prototype, "delete", null);
ItemCategoryController = __decorate([
    (0, swagger_1.ApiTags)("itemCategory"),
    (0, common_1.Controller)("itemCategory"),
    __metadata("design:paramtypes", [item_category_service_1.ItemCategoryService])
], ItemCategoryController);
exports.ItemCategoryController = ItemCategoryController;
//# sourceMappingURL=item-category.controller.js.map