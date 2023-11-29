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
exports.SalesInvoiceItem = void 0;
const typeorm_1 = require("typeorm");
const Item_1 = require("./Item");
const SalesInvoice_1 = require("./SalesInvoice");
let SalesInvoiceItem = class SalesInvoiceItem {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "SalesInvoiceId" }),
    __metadata("design:type", String)
], SalesInvoiceItem.prototype, "salesInvoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "ItemId" }),
    __metadata("design:type", String)
], SalesInvoiceItem.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "UnitPrice", default: () => "0" }),
    __metadata("design:type", String)
], SalesInvoiceItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Quantity", default: () => "0" }),
    __metadata("design:type", String)
], SalesInvoiceItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Amount", default: () => "0" }),
    __metadata("design:type", String)
], SalesInvoiceItem.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Item_1.Item, (item) => item.salesInvoiceItems),
    (0, typeorm_1.JoinColumn)([{ name: "ItemId", referencedColumnName: "itemId" }]),
    __metadata("design:type", Item_1.Item)
], SalesInvoiceItem.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SalesInvoice_1.SalesInvoice, (salesInvoice) => salesInvoice.salesInvoiceItems),
    (0, typeorm_1.JoinColumn)([
        { name: "SalesInvoiceId", referencedColumnName: "salesInvoiceId" },
    ]),
    __metadata("design:type", SalesInvoice_1.SalesInvoice)
], SalesInvoiceItem.prototype, "salesInvoice", void 0);
SalesInvoiceItem = __decorate([
    (0, typeorm_1.Index)("SalesInvoiceItem_pkey", ["itemId", "salesInvoiceId"], { unique: true }),
    (0, typeorm_1.Entity)("SalesInvoiceItem", { schema: "dbo" })
], SalesInvoiceItem);
exports.SalesInvoiceItem = SalesInvoiceItem;
//# sourceMappingURL=SalesInvoiceItem.js.map