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
exports.GoodsReceipt = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const Warehouse_1 = require("./Warehouse");
const GoodsReceiptItem_1 = require("./GoodsReceiptItem");
let GoodsReceipt = class GoodsReceipt {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "GoodsReceiptId" }),
    __metadata("design:type", String)
], GoodsReceipt.prototype, "goodsReceiptId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "GoodsReceiptCode" }),
    __metadata("design:type", String)
], GoodsReceipt.prototype, "goodsReceiptCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" }),
    __metadata("design:type", String)
], GoodsReceipt.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateCreated",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], GoodsReceipt.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], GoodsReceipt.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'PENDING'" }),
    __metadata("design:type", String)
], GoodsReceipt.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], GoodsReceipt.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "Notes",
        nullable: true,
        default: () => "''",
    }),
    __metadata("design:type", String)
], GoodsReceipt.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.goodsReceipts),
    (0, typeorm_1.JoinColumn)([{ name: "CreatedByUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], GoodsReceipt.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse_1.Warehouse, (warehouse) => warehouse.goodsReceipts),
    (0, typeorm_1.JoinColumn)([{ name: "WarehouseId", referencedColumnName: "warehouseId" }]),
    __metadata("design:type", Warehouse_1.Warehouse)
], GoodsReceipt.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GoodsReceiptItem_1.GoodsReceiptItem, (goodsReceiptItem) => goodsReceiptItem.goodsReceipt),
    __metadata("design:type", Array)
], GoodsReceipt.prototype, "goodsReceiptItems", void 0);
GoodsReceipt = __decorate([
    (0, typeorm_1.Index)("GoodsReceipt_pkey", ["goodsReceiptId"], { unique: true }),
    (0, typeorm_1.Entity)("GoodsReceipt", { schema: "dbo" })
], GoodsReceipt);
exports.GoodsReceipt = GoodsReceipt;
//# sourceMappingURL=GoodsReceipt.js.map