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
exports.InventoryAdjustmentReport = void 0;
const typeorm_1 = require("typeorm");
const Branch_1 = require("./Branch");
const GoodsIssue_1 = require("./GoodsIssue");
const InventoryRequest_1 = require("./InventoryRequest");
const Users_1 = require("./Users");
const InventoryAdjustmentReportItem_1 = require("./InventoryAdjustmentReportItem");
let InventoryAdjustmentReport = class InventoryAdjustmentReport {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: "bigint",
        name: "InventoryAdjustmentReportId",
    }),
    __metadata("design:type", String)
], InventoryAdjustmentReport.prototype, "inventoryAdjustmentReportId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "InventoryAdjustmentReportCode",
        nullable: true,
    }),
    __metadata("design:type", String)
], InventoryAdjustmentReport.prototype, "inventoryAdjustmentReportCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ReportType" }),
    __metadata("design:type", String)
], InventoryAdjustmentReport.prototype, "reportType", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" }),
    __metadata("design:type", String)
], InventoryAdjustmentReport.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateReported",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], InventoryAdjustmentReport.prototype, "dateReported", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], InventoryAdjustmentReport.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "ReportStatus",
        default: () => "'PENDING'",
    }),
    __metadata("design:type", String)
], InventoryAdjustmentReport.prototype, "reportStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Notes", nullable: true }),
    __metadata("design:type", String)
], InventoryAdjustmentReport.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], InventoryAdjustmentReport.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch, (branch) => branch.inventoryAdjustmentReports),
    (0, typeorm_1.JoinColumn)([{ name: "BranchId", referencedColumnName: "branchId" }]),
    __metadata("design:type", Branch_1.Branch)
], InventoryAdjustmentReport.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GoodsIssue_1.GoodsIssue, (goodsIssue) => goodsIssue.inventoryAdjustmentReports),
    (0, typeorm_1.JoinColumn)([{ name: "GoodsIssueId", referencedColumnName: "goodsIssueId" }]),
    __metadata("design:type", GoodsIssue_1.GoodsIssue)
], InventoryAdjustmentReport.prototype, "goodsIssue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => InventoryRequest_1.InventoryRequest, (inventoryRequest) => inventoryRequest.inventoryAdjustmentReports),
    (0, typeorm_1.JoinColumn)([
        { name: "InventoryRequestId", referencedColumnName: "inventoryRequestId" },
    ]),
    __metadata("design:type", InventoryRequest_1.InventoryRequest)
], InventoryAdjustmentReport.prototype, "inventoryRequest", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.inventoryAdjustmentReports),
    (0, typeorm_1.JoinColumn)([{ name: "ReportedByUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], InventoryAdjustmentReport.prototype, "reportedByUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem, (inventoryAdjustmentReportItem) => inventoryAdjustmentReportItem.inventoryAdjustmentReport),
    __metadata("design:type", Array)
], InventoryAdjustmentReport.prototype, "inventoryAdjustmentReportItems", void 0);
InventoryAdjustmentReport = __decorate([
    (0, typeorm_1.Index)("InventoryAdjustmentReport_pkey", ["inventoryAdjustmentReportId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("InventoryAdjustmentReport", { schema: "dbo" })
], InventoryAdjustmentReport);
exports.InventoryAdjustmentReport = InventoryAdjustmentReport;
//# sourceMappingURL=InventoryAdjustmentReport.js.map