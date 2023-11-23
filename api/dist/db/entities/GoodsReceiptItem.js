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
exports.GoodsReceiptItem = void 0;
const typeorm_1 = require("typeorm");
const GoodsReceipt_1 = require("./GoodsReceipt");
const Item_1 = require("./Item");
let GoodsReceiptItem = class GoodsReceiptItem {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "GoodsReceiptId" }),
    __metadata("design:type", String)
], GoodsReceiptItem.prototype, "goodsReceiptId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "ItemId" }),
    __metadata("design:type", String)
], GoodsReceiptItem.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Quantity", default: () => "0" }),
    __metadata("design:type", String)
], GoodsReceiptItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GoodsReceipt_1.GoodsReceipt, (goodsReceipt) => goodsReceipt.goodsReceiptItems),
    (0, typeorm_1.JoinColumn)([
        { name: "GoodsReceiptId", referencedColumnName: "goodsReceiptId" },
    ]),
    __metadata("design:type", GoodsReceipt_1.GoodsReceipt)
], GoodsReceiptItem.prototype, "goodsReceipt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Item_1.Item, (item) => item.goodsReceiptItems),
    (0, typeorm_1.JoinColumn)([{ name: "ItemId", referencedColumnName: "itemId" }]),
    __metadata("design:type", Item_1.Item)
], GoodsReceiptItem.prototype, "item", void 0);
GoodsReceiptItem = __decorate([
    (0, typeorm_1.Index)("GoodsReceiptItem_pkey", ["goodsReceiptId", "itemId"], { unique: true }),
    (0, typeorm_1.Entity)("GoodsReceiptItem", { schema: "dbo" })
], GoodsReceiptItem);
exports.GoodsReceiptItem = GoodsReceiptItem;
//# sourceMappingURL=GoodsReceiptItem.js.map