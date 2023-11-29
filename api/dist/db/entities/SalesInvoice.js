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
exports.SalesInvoice = void 0;
const typeorm_1 = require("typeorm");
const Branch_1 = require("./Branch");
const Users_1 = require("./Users");
const SalesInvoiceItem_1 = require("./SalesInvoiceItem");
let SalesInvoice = class SalesInvoice {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "SalesInvoiceId" }),
    __metadata("design:type", String)
], SalesInvoice.prototype, "salesInvoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SalesInvoiceCode", nullable: true }),
    __metadata("design:type", String)
], SalesInvoice.prototype, "salesInvoiceCode", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "SalesDate",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], SalesInvoice.prototype, "salesDate", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "TotalAmount", default: () => "0" }),
    __metadata("design:type", String)
], SalesInvoice.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsVoid", default: () => "false" }),
    __metadata("design:type", Boolean)
], SalesInvoice.prototype, "isVoid", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], SalesInvoice.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch, (branch) => branch.salesInvoices),
    (0, typeorm_1.JoinColumn)([{ name: "BranchId", referencedColumnName: "branchId" }]),
    __metadata("design:type", Branch_1.Branch)
], SalesInvoice.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.salesInvoices),
    (0, typeorm_1.JoinColumn)([{ name: "CreatedByUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], SalesInvoice.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SalesInvoiceItem_1.SalesInvoiceItem, (salesInvoiceItem) => salesInvoiceItem.salesInvoice),
    __metadata("design:type", Array)
], SalesInvoice.prototype, "salesInvoiceItems", void 0);
SalesInvoice = __decorate([
    (0, typeorm_1.Index)("SalesInvoice_pkey", ["salesInvoiceId"], { unique: true }),
    (0, typeorm_1.Entity)("SalesInvoice", { schema: "dbo" })
], SalesInvoice);
exports.SalesInvoice = SalesInvoice;
//# sourceMappingURL=SalesInvoice.js.map