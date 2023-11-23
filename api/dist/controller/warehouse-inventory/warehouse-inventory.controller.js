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
exports.WarehouseInventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const warehouse_inventory_service_1 = require("../../services/warehouse-inventory.service");
let WarehouseInventoryController = class WarehouseInventoryController {
    constructor(warehouseInventoryService) {
        this.warehouseInventoryService = warehouseInventoryService;
    }
    async getPaginated(params) {
        const res = {};
        try {
            res.data = await this.warehouseInventoryService.getPagination(params);
            res.success = true;
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
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], WarehouseInventoryController.prototype, "getPaginated", null);
WarehouseInventoryController = __decorate([
    (0, swagger_1.ApiTags)("warehouseInventory"),
    (0, common_1.Controller)("warehouseInventory"),
    __metadata("design:paramtypes", [warehouse_inventory_service_1.WarehouseInventoryService])
], WarehouseInventoryController);
exports.WarehouseInventoryController = WarehouseInventoryController;
//# sourceMappingURL=warehouse-inventory.controller.js.map