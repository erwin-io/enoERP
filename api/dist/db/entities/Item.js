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
exports.Item = void 0;
const typeorm_1 = require("typeorm");
const GoodsIssueItem_1 = require("./GoodsIssueItem");
const GoodsReceiptItem_1 = require("./GoodsReceiptItem");
const InventoryAdjustmentReportItem_1 = require("./InventoryAdjustmentReportItem");
const InventoryRequestItem_1 = require("./InventoryRequestItem");
const InventoryRequestRate_1 = require("./InventoryRequestRate");
const ItemCategory_1 = require("./ItemCategory");
const ItemBranch_1 = require("./ItemBranch");
const ItemWarehouse_1 = require("./ItemWarehouse");
const SalesInvoiceItem_1 = require("./SalesInvoiceItem");
let Item = class Item {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "ItemId" }),
    __metadata("design:type", String)
], Item.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ItemCode" }),
    __metadata("design:type", String)
], Item.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ItemName" }),
    __metadata("design:type", String)
], Item.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ItemDescription", default: () => "''" }),
    __metadata("design:type", String)
], Item.prototype, "itemDescription", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Price", default: () => "0" }),
    __metadata("design:type", String)
], Item.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "DateAdded", default: () => "now()" }),
    __metadata("design:type", String)
], Item.prototype, "dateAdded", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "DateLastUpdated", nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Item.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GoodsIssueItem_1.GoodsIssueItem, (goodsIssueItem) => goodsIssueItem.item),
    __metadata("design:type", Array)
], Item.prototype, "goodsIssueItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GoodsReceiptItem_1.GoodsReceiptItem, (goodsReceiptItem) => goodsReceiptItem.item),
    __metadata("design:type", Array)
], Item.prototype, "goodsReceiptItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem, (inventoryAdjustmentReportItem) => inventoryAdjustmentReportItem.item),
    __metadata("design:type", Array)
], Item.prototype, "inventoryAdjustmentReportItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InventoryRequestItem_1.InventoryRequestItem, (inventoryRequestItem) => inventoryRequestItem.item),
    __metadata("design:type", Array)
], Item.prototype, "inventoryRequestItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InventoryRequestRate_1.InventoryRequestRate, (inventoryRequestRate) => inventoryRequestRate.item),
    __metadata("design:type", Array)
], Item.prototype, "inventoryRequestRates", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ItemCategory_1.ItemCategory, (itemCategory) => itemCategory.items),
    (0, typeorm_1.JoinColumn)([
        { name: "ItemCategoryId", referencedColumnName: "itemCategoryId" },
    ]),
    __metadata("design:type", ItemCategory_1.ItemCategory)
], Item.prototype, "itemCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ItemBranch_1.ItemBranch, (itemBranch) => itemBranch.item),
    __metadata("design:type", Array)
], Item.prototype, "itemBranches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ItemWarehouse_1.ItemWarehouse, (itemWarehouse) => itemWarehouse.item),
    __metadata("design:type", Array)
], Item.prototype, "itemWarehouses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SalesInvoiceItem_1.SalesInvoiceItem, (salesInvoiceItem) => salesInvoiceItem.item),
    __metadata("design:type", Array)
], Item.prototype, "salesInvoiceItems", void 0);
Item = __decorate([
    (0, typeorm_1.Index)("u_item_itemName", ["active", "itemName"], { unique: true }),
    (0, typeorm_1.Index)("u_item_itemCode", ["active", "itemCode"], { unique: true }),
    (0, typeorm_1.Index)("Item_pkey", ["itemId"], { unique: true }),
    (0, typeorm_1.Entity)("Item", { schema: "dbo" })
], Item);
exports.Item = Item;
//# sourceMappingURL=Item.js.map