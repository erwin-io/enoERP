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
exports.Warehouse = void 0;
const typeorm_1 = require("typeorm");
const GoodsIssue_1 = require("./GoodsIssue");
const GoodsReceipt_1 = require("./GoodsReceipt");
const InventoryRequest_1 = require("./InventoryRequest");
const ItemWarehouse_1 = require("./ItemWarehouse");
let Warehouse = class Warehouse {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "WarehouseId" }),
    __metadata("design:type", String)
], Warehouse.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "WarehouseCode" }),
    __metadata("design:type", String)
], Warehouse.prototype, "warehouseCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], Warehouse.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Warehouse.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GoodsIssue_1.GoodsIssue, (goodsIssue) => goodsIssue.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "goodsIssues", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GoodsReceipt_1.GoodsReceipt, (goodsReceipt) => goodsReceipt.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "goodsReceipts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InventoryRequest_1.InventoryRequest, (inventoryRequest) => inventoryRequest.fromWarehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "inventoryRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ItemWarehouse_1.ItemWarehouse, (itemWarehouse) => itemWarehouse.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "itemWarehouses", void 0);
Warehouse = __decorate([
    (0, typeorm_1.Index)("u_warehouse_warehouseCode", ["active", "warehouseCode"], {
        unique: true,
    }),
    (0, typeorm_1.Index)("u_warehouse_name", ["active", "name"], { unique: true }),
    (0, typeorm_1.Index)("Warehouse_pkey", ["warehouseId"], { unique: true }),
    (0, typeorm_1.Entity)("Warehouse", { schema: "dbo" })
], Warehouse);
exports.Warehouse = Warehouse;
//# sourceMappingURL=Warehouse.js.map