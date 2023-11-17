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
exports.Branch = void 0;
const typeorm_1 = require("typeorm");
const ItemBranch_1 = require("./ItemBranch");
let Branch = class Branch {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "BranchId" }),
    __metadata("design:type", String)
], Branch.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "BranchCode" }),
    __metadata("design:type", String)
], Branch.prototype, "branchCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], Branch.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Branch.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ItemBranch_1.ItemBranch, (itemBranch) => itemBranch.branch),
    __metadata("design:type", Array)
], Branch.prototype, "itemBranches", void 0);
Branch = __decorate([
    (0, typeorm_1.Index)("u_branch_branchCode", ["active", "branchCode"], { unique: true }),
    (0, typeorm_1.Index)("u_branch_name", ["active", "name"], { unique: true }),
    (0, typeorm_1.Index)("Branch_pkey", ["branchId"], { unique: true }),
    (0, typeorm_1.Entity)("Branch", { schema: "dbo" })
], Branch);
exports.Branch = Branch;
//# sourceMappingURL=Branch.js.map