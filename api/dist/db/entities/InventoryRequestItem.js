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
exports.InventoryRequestItem = void 0;
const typeorm_1 = require("typeorm");
const InventoryRequest_1 = require("./InventoryRequest");
const Item_1 = require("./Item");
let InventoryRequestItem = class InventoryRequestItem {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "InventoryRequestId" }),
    __metadata("design:type", String)
], InventoryRequestItem.prototype, "inventoryRequestId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "ItemId" }),
    __metadata("design:type", String)
], InventoryRequestItem.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Quantity", default: () => "0" }),
    __metadata("design:type", String)
], InventoryRequestItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => InventoryRequest_1.InventoryRequest, (inventoryRequest) => inventoryRequest.inventoryRequestItems),
    (0, typeorm_1.JoinColumn)([
        { name: "InventoryRequestId", referencedColumnName: "inventoryRequestId" },
    ]),
    __metadata("design:type", InventoryRequest_1.InventoryRequest)
], InventoryRequestItem.prototype, "inventoryRequest", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Item_1.Item, (item) => item.inventoryRequestItems),
    (0, typeorm_1.JoinColumn)([{ name: "ItemId", referencedColumnName: "itemId" }]),
    __metadata("design:type", Item_1.Item)
], InventoryRequestItem.prototype, "item", void 0);
InventoryRequestItem = __decorate([
    (0, typeorm_1.Index)("InventoryRequestItem_pkey", ["inventoryRequestId", "itemId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("InventoryRequestItem", { schema: "dbo" })
], InventoryRequestItem);
exports.InventoryRequestItem = InventoryRequestItem;
//# sourceMappingURL=InventoryRequestItem.js.map