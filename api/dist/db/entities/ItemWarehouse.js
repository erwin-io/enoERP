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
exports.ItemWarehouse = void 0;
const typeorm_1 = require("typeorm");
const Item_1 = require("./Item");
const Warehouse_1 = require("./Warehouse");
let ItemWarehouse = class ItemWarehouse {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "ItemId" }),
    __metadata("design:type", String)
], ItemWarehouse.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "WarehouseId" }),
    __metadata("design:type", String)
], ItemWarehouse.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "Quantity", default: () => "0" }),
    __metadata("design:type", String)
], ItemWarehouse.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Item_1.Item, (item) => item.itemWarehouses),
    (0, typeorm_1.JoinColumn)([{ name: "ItemId", referencedColumnName: "itemId" }]),
    __metadata("design:type", Item_1.Item)
], ItemWarehouse.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse_1.Warehouse, (warehouse) => warehouse.itemWarehouses),
    (0, typeorm_1.JoinColumn)([{ name: "WarehouseId", referencedColumnName: "warehouseId" }]),
    __metadata("design:type", Warehouse_1.Warehouse)
], ItemWarehouse.prototype, "warehouse", void 0);
ItemWarehouse = __decorate([
    (0, typeorm_1.Index)("ItemWarehouse_pkey", ["itemId", "warehouseId"], { unique: true }),
    (0, typeorm_1.Entity)("ItemWarehouse", { schema: "dbo" })
], ItemWarehouse);
exports.ItemWarehouse = ItemWarehouse;
//# sourceMappingURL=ItemWarehouse.js.map