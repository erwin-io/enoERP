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
exports.BranchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const branch_create_dto_1 = require("../../core/dto/branch/branch.create.dto");
const branch_update_dto_1 = require("../../core/dto/branch/branch.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const branch_service_1 = require("../../services/branch.service");
let BranchController = class BranchController {
    constructor(branchService) {
        this.branchService = branchService;
    }
    async getDetails(branchId) {
        const res = {};
        try {
            res.data = await this.branchService.getById(branchId);
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
            res.data = await this.branchService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(branchDto) {
        const res = {};
        try {
            res.data = await this.branchService.create(branchDto);
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
    async update(branchId, dto) {
        const res = {};
        try {
            res.data = await this.branchService.update(branchId, dto);
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
    async delete(branchId) {
        const res = {};
        try {
            res.data = await this.branchService.delete(branchId);
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
    (0, common_1.Get)("/:branchId"),
    __param(0, (0, common_1.Param)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [branch_create_dto_1.CreateBranchDto]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:branchId"),
    __param(0, (0, common_1.Param)("branchId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, branch_update_dto_1.UpdateBranchDto]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:branchId"),
    __param(0, (0, common_1.Param)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BranchController.prototype, "delete", null);
BranchController = __decorate([
    (0, swagger_1.ApiTags)("branch"),
    (0, common_1.Controller)("branch"),
    __metadata("design:paramtypes", [branch_service_1.BranchService])
], BranchController);
exports.BranchController = BranchController;
//# sourceMappingURL=branch.controller.js.map