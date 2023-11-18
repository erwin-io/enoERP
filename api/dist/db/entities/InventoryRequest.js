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
exports.InventoryRequest = void 0;
const typeorm_1 = require("typeorm");
const Branch_1 = require("./Branch");
const Users_1 = require("./Users");
const InventoryRequestItem_1 = require("./InventoryRequestItem");
let InventoryRequest = class InventoryRequest {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "InventoryRequestId" }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "inventoryRequestId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "InventoryRequestCode", nullable: true }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "inventoryRequestCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateRequested",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], InventoryRequest.prototype, "dateRequested", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateLastUpdated",
        nullable: true,
    }),
    __metadata("design:type", Date)
], InventoryRequest.prototype, "dateLastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "RequestStatus",
        default: () => "'PENDING'",
    }),
    __metadata("design:type", String)
], InventoryRequest.prototype, "requestStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], InventoryRequest.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch, (branch) => branch.inventoryRequests),
    (0, typeorm_1.JoinColumn)([{ name: "BranchId", referencedColumnName: "branchId" }]),
    __metadata("design:type", Branch_1.Branch)
], InventoryRequest.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.inventoryRequests),
    (0, typeorm_1.JoinColumn)([{ name: "RequestedByUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], InventoryRequest.prototype, "requestedByUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InventoryRequestItem_1.InventoryRequestItem, (inventoryRequestItem) => inventoryRequestItem.inventoryRequest),
    __metadata("design:type", Array)
], InventoryRequest.prototype, "inventoryRequestItems", void 0);
InventoryRequest = __decorate([
    (0, typeorm_1.Index)("InventoryRequest_pkey", ["inventoryRequestId"], { unique: true }),
    (0, typeorm_1.Entity)("InventoryRequest", { schema: "dbo" })
], InventoryRequest);
exports.InventoryRequest = InventoryRequest;
//# sourceMappingURL=InventoryRequest.js.map