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
exports.Supplier = void 0;
const typeorm_1 = require("typeorm");
const GoodsReceipt_1 = require("./GoodsReceipt");
let Supplier = class Supplier {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "SupplierId" }),
    __metadata("design:type", String)
], Supplier.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SupplierCode", nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "supplierCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], Supplier.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Supplier.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GoodsReceipt_1.GoodsReceipt, (goodsReceipt) => goodsReceipt.supplier),
    __metadata("design:type", Array)
], Supplier.prototype, "goodsReceipts", void 0);
Supplier = __decorate([
    (0, typeorm_1.Index)("u_supplier_name", ["active", "name"], { unique: true }),
    (0, typeorm_1.Index)("Supplier_pkey", ["supplierId"], { unique: true }),
    (0, typeorm_1.Entity)("Supplier", { schema: "dbo" })
], Supplier);
exports.Supplier = Supplier;
//# sourceMappingURL=Supplier.js.map