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
exports.ItemController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const item_create_dto_1 = require("../../core/dto/item/item.create.dto");
const item_update_dto_1 = require("../../core/dto/item/item.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const item_service_1 = require("../../services/item.service");
let ItemController = class ItemController {
    constructor(itemService) {
        this.itemService = itemService;
    }
    async getDetails(itemId) {
        const res = {};
        try {
            res.data = await this.itemService.getById(itemId);
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
            res.data = await this.itemService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(itemDto) {
        const res = {};
        try {
            res.data = await this.itemService.create(itemDto);
            res.success = true;
            res.message = `Item ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(itemId, dto) {
        const res = {};
        try {
            res.data = await this.itemService.update(itemId, dto);
            res.success = true;
            res.message = `Item ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(itemId) {
        const res = {};
        try {
            res.data = await this.itemService.delete(itemId);
            res.success = true;
            res.message = `Item ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:itemId"),
    __param(0, (0, common_1.Param)("itemId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_create_dto_1.CreateItemDto]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:itemId"),
    __param(0, (0, common_1.Param)("itemId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, item_update_dto_1.UpdateItemDto]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:itemId"),
    __param(0, (0, common_1.Param)("itemId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "delete", null);
ItemController = __decorate([
    (0, swagger_1.ApiTags)("item"),
    (0, common_1.Controller)("item"),
    __metadata("design:paramtypes", [item_service_1.ItemService])
], ItemController);
exports.ItemController = ItemController;
//# sourceMappingURL=item.controller.js.map