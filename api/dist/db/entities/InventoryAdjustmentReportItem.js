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
exports.InventoryAdjustmentReportItem = void 0;
const typeorm_1 = require("typeorm");
const InventoryAdjustmentReport_1 = require("./InventoryAdjustmentReport");
const Item_1 = require("./Item");
let InventoryAdjustmentReportItem = class InventoryAdjustmentReportItem {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "InventoryAdjustmentReportId" }),
    __metadata("design:type", String)
], InventoryAdjustmentReportItem.prototype, "inventoryAdjustmentReportId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "ItemId" }),
    __metadata("design:type", String)
], InventoryAdjustmentReportItem.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "ReturnedQuantity", default: () => "0" }),
    __metadata("design:type", String)
], InventoryAdjustmentReportItem.prototype, "returnedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "ProposedUnitReturnRate", default: () => "0" }),
    __metadata("design:type", String)
], InventoryAdjustmentReportItem.prototype, "proposedUnitReturnRate", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "TotalRefund", default: () => "0" }),
    __metadata("design:type", String)
], InventoryAdjustmentReportItem.prototype, "totalRefund", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => InventoryAdjustmentReport_1.InventoryAdjustmentReport, (inventoryAdjustmentReport) => inventoryAdjustmentReport.inventoryAdjustmentReportItems),
    (0, typeorm_1.JoinColumn)([
        {
            name: "InventoryAdjustmentReportId",
            referencedColumnName: "inventoryAdjustmentReportId",
        },
    ]),
    __metadata("design:type", InventoryAdjustmentReport_1.InventoryAdjustmentReport)
], InventoryAdjustmentReportItem.prototype, "inventoryAdjustmentReport", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Item_1.Item, (item) => item.inventoryAdjustmentReportItems),
    (0, typeorm_1.JoinColumn)([{ name: "ItemId", referencedColumnName: "itemId" }]),
    __metadata("design:type", Item_1.Item)
], InventoryAdjustmentReportItem.prototype, "item", void 0);
InventoryAdjustmentReportItem = __decorate([
    (0, typeorm_1.Index)("InventoryAdjustmentReportItem_pkey", ["inventoryAdjustmentReportId", "itemId"], { unique: true }),
    (0, typeorm_1.Entity)("InventoryAdjustmentReportItem", { schema: "dbo" })
], InventoryAdjustmentReportItem);
exports.InventoryAdjustmentReportItem = InventoryAdjustmentReportItem;
//# sourceMappingURL=InventoryAdjustmentReportItem.js.map