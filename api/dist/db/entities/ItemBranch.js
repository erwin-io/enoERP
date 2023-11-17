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
exports.ItemBranch = void 0;
const typeorm_1 = require("typeorm");
const Branch_1 = require("./Branch");
const Item_1 = require("./Item");
let ItemBranch = class ItemBranch {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "ItemId" }),
    __metadata("design:type", String)
], ItemBranch.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "BranchId" }),
    __metadata("design:type", String)
], ItemBranch.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "Quantity", default: () => "0" }),
    __metadata("design:type", String)
], ItemBranch.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch, (branch) => branch.itemBranches),
    (0, typeorm_1.JoinColumn)([{ name: "BranchId", referencedColumnName: "branchId" }]),
    __metadata("design:type", Branch_1.Branch)
], ItemBranch.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Item_1.Item, (item) => item.itemBranches),
    (0, typeorm_1.JoinColumn)([{ name: "ItemId", referencedColumnName: "itemId" }]),
    __metadata("design:type", Item_1.Item)
], ItemBranch.prototype, "item", void 0);
ItemBranch = __decorate([
    (0, typeorm_1.Index)("ItemBranch_pkey", ["branchId", "itemId"], { unique: true }),
    (0, typeorm_1.Entity)("ItemBranch", { schema: "dbo" })
], ItemBranch);
exports.ItemBranch = ItemBranch;
//# sourceMappingURL=ItemBranch.js.map