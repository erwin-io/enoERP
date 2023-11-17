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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const Access_1 = require("./Access");
const Branch_1 = require("./Branch");
let Users = class Users {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "UserId" }),
    __metadata("design:type", String)
], Users.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "UserName" }),
    __metadata("design:type", String)
], Users.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Password" }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "FullName" }),
    __metadata("design:type", String)
], Users.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Gender", default: () => "'Others'" }),
    __metadata("design:type", String)
], Users.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "BirthDate" }),
    __metadata("design:type", String)
], Users.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "MobileNumber" }),
    __metadata("design:type", String)
], Users.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Email" }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "AccessGranted" }),
    __metadata("design:type", Boolean)
], Users.prototype, "accessGranted", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Users.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "UserCode", nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "userCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Address", default: () => "'NA'" }),
    __metadata("design:type", String)
], Users.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Access_1.Access, (access) => access.users),
    (0, typeorm_1.JoinColumn)([{ name: "AccessId", referencedColumnName: "accessId" }]),
    __metadata("design:type", Access_1.Access)
], Users.prototype, "access", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch, (branch) => branch.users),
    (0, typeorm_1.JoinColumn)([{ name: "BranchId", referencedColumnName: "branchId" }]),
    __metadata("design:type", Branch_1.Branch)
], Users.prototype, "branch", void 0);
Users = __decorate([
    (0, typeorm_1.Index)("u_user_number", ["active", "mobileNumber"], { unique: true }),
    (0, typeorm_1.Index)("u_user_email", ["active", "email"], { unique: true }),
    (0, typeorm_1.Index)("u_user", ["active", "userName"], { unique: true }),
    (0, typeorm_1.Index)("pk_users_1557580587", ["userId"], { unique: true }),
    (0, typeorm_1.Entity)("Users", { schema: "dbo" })
], Users);
exports.Users = Users;
//# sourceMappingURL=Users.js.map