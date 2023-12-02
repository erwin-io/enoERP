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
exports.SalesInvoicePayments = void 0;
const typeorm_1 = require("typeorm");
const SalesInvoice_1 = require("./SalesInvoice");
let SalesInvoicePayments = class SalesInvoicePayments {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "SalesInvoiceId" }),
    __metadata("design:type", String)
], SalesInvoicePayments.prototype, "salesInvoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { primary: true, name: "PaymentType" }),
    __metadata("design:type", String)
], SalesInvoicePayments.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Amount", default: () => "0" }),
    __metadata("design:type", String)
], SalesInvoicePayments.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SalesInvoice_1.SalesInvoice, (salesInvoice) => salesInvoice.salesInvoicePayments),
    (0, typeorm_1.JoinColumn)([
        { name: "SalesInvoiceId", referencedColumnName: "salesInvoiceId" },
    ]),
    __metadata("design:type", SalesInvoice_1.SalesInvoice)
], SalesInvoicePayments.prototype, "salesInvoice", void 0);
SalesInvoicePayments = __decorate([
    (0, typeorm_1.Index)("SalesInvoicePayments_pkey", ["paymentType", "salesInvoiceId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("SalesInvoicePayments", { schema: "dbo" })
], SalesInvoicePayments);
exports.SalesInvoicePayments = SalesInvoicePayments;
//# sourceMappingURL=SalesInvoicePayments.js.map