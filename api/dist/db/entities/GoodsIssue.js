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
exports.GoodsIssue = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const Warehouse_1 = require("./Warehouse");
const GoodsIssueItem_1 = require("./GoodsIssueItem");
let GoodsIssue = class GoodsIssue {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "GoodsIssueId" }),
    __metadata("design:type", String)
], GoodsIssue.prototype, "goodsIssueId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "GoodsIssueCode" }),
    __metadata("design:type", String)
], GoodsIssue.prototype, "goodsIssueCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" }),
    __metadata("design:type", String)
], GoodsIssue.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "IssueType" }),
    __metadata("design:type", String)
], GoodsIssue.prototype, "issueType", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateCreated",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], GoodsIssue.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], GoodsIssue.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'PENDING'" }),
    __metadata("design:type", String)
], GoodsIssue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], GoodsIssue.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.goodsIssues),
    (0, typeorm_1.JoinColumn)([{ name: "CreatedByUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], GoodsIssue.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse_1.Warehouse, (warehouse) => warehouse.goodsIssues),
    (0, typeorm_1.JoinColumn)([{ name: "WarehouseId", referencedColumnName: "warehouseId" }]),
    __metadata("design:type", Warehouse_1.Warehouse)
], GoodsIssue.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GoodsIssueItem_1.GoodsIssueItem, (goodsIssueItem) => goodsIssueItem.goodsIssue),
    __metadata("design:type", Array)
], GoodsIssue.prototype, "goodsIssueItems", void 0);
GoodsIssue = __decorate([
    (0, typeorm_1.Index)("GoodsIssue_pkey", ["goodsIssueId"], { unique: true }),
    (0, typeorm_1.Entity)("GoodsIssue", { schema: "dbo" })
], GoodsIssue);
exports.GoodsIssue = GoodsIssue;
//# sourceMappingURL=GoodsIssue.js.map