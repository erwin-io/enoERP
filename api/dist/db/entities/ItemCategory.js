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
exports.ItemCategory = void 0;
const typeorm_1 = require("typeorm");
const Item_1 = require("./Item");
let ItemCategory = class ItemCategory {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "ItemCategoryId" }),
    __metadata("design:type", String)
], ItemCategory.prototype, "itemCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], ItemCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" }),
    __metadata("design:type", String)
], ItemCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], ItemCategory.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Item_1.Item, (item) => item.itemCategory),
    __metadata("design:type", Array)
], ItemCategory.prototype, "items", void 0);
ItemCategory = __decorate([
    (0, typeorm_1.Index)("u_itemcategory", ["active", "name"], { unique: true }),
    (0, typeorm_1.Index)("ItemCategory_pkey", ["itemCategoryId"], { unique: true }),
    (0, typeorm_1.Entity)("ItemCategory", { schema: "dbo" })
], ItemCategory);
exports.ItemCategory = ItemCategory;
//# sourceMappingURL=ItemCategory.js.map