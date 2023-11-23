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
exports.InventoryRequestRate = void 0;
const typeorm_1 = require("typeorm");
const InventoryRequestItem_1 = require("./InventoryRequestItem");
const Item_1 = require("./Item");
let InventoryRequestRate = class InventoryRequestRate {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "InventoryRequestRateId" }),
    __metadata("design:type", String)
], InventoryRequestRate.prototype, "inventoryRequestRateId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Rate" }),
    __metadata("design:type", String)
], InventoryRequestRate.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "RateName" }),
    __metadata("design:type", String)
], InventoryRequestRate.prototype, "rateName", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "MinQuantity", default: () => "0" }),
    __metadata("design:type", String)
], InventoryRequestRate.prototype, "minQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "MaxQuantity", default: () => "0" }),
    __metadata("design:type", String)
], InventoryRequestRate.prototype, "maxQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], InventoryRequestRate.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "BaseRate", default: () => "false" }),
    __metadata("design:type", Boolean)
], InventoryRequestRate.prototype, "baseRate", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "InventoryRequestRateCode",
        nullable: true,
    }),
    __metadata("design:type", String)
], InventoryRequestRate.prototype, "inventoryRequestRateCode", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InventoryRequestItem_1.InventoryRequestItem, (inventoryRequestItem) => inventoryRequestItem.inventoryRequestRate),
    __metadata("design:type", Array)
], InventoryRequestRate.prototype, "inventoryRequestItems", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Item_1.Item, (item) => item.inventoryRequestRates),
    (0, typeorm_1.JoinColumn)([{ name: "ItemId", referencedColumnName: "itemId" }]),
    __metadata("design:type", Item_1.Item)
], InventoryRequestRate.prototype, "item", void 0);
InventoryRequestRate = __decorate([
    (0, typeorm_1.Index)("InventoryRequestRate_pkey", ["inventoryRequestRateId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("InventoryRequestRate", { schema: "dbo" })
], InventoryRequestRate);
exports.InventoryRequestRate = InventoryRequestRate;
//# sourceMappingURL=InventoryRequestRate.js.map