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
exports.GoodsIssueItem = void 0;
const typeorm_1 = require("typeorm");
const GoodsIssue_1 = require("./GoodsIssue");
const Item_1 = require("./Item");
let GoodsIssueItem = class GoodsIssueItem {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "GoodsIssueId" }),
    __metadata("design:type", String)
], GoodsIssueItem.prototype, "goodsIssueId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "ItemId" }),
    __metadata("design:type", String)
], GoodsIssueItem.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Quantity", default: () => "0" }),
    __metadata("design:type", String)
], GoodsIssueItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GoodsIssue_1.GoodsIssue, (goodsIssue) => goodsIssue.goodsIssueItems),
    (0, typeorm_1.JoinColumn)([{ name: "GoodsIssueId", referencedColumnName: "goodsIssueId" }]),
    __metadata("design:type", GoodsIssue_1.GoodsIssue)
], GoodsIssueItem.prototype, "goodsIssue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Item_1.Item, (item) => item.goodsIssueItems),
    (0, typeorm_1.JoinColumn)([{ name: "ItemId", referencedColumnName: "itemId" }]),
    __metadata("design:type", Item_1.Item)
], GoodsIssueItem.prototype, "item", void 0);
GoodsIssueItem = __decorate([
    (0, typeorm_1.Index)("GoodsIssueItem_pkey", ["goodsIssueId", "itemId"], { unique: true }),
    (0, typeorm_1.Entity)("GoodsIssueItem", { schema: "dbo" })
], GoodsIssueItem);
exports.GoodsIssueItem = GoodsIssueItem;
//# sourceMappingURL=GoodsIssueItem.js.map