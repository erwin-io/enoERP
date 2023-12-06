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
exports.GatewayConnectedUsers = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let GatewayConnectedUsers = class GatewayConnectedUsers {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "Id" }),
    __metadata("design:type", String)
], GatewayConnectedUsers.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SocketId", length: 100 }),
    __metadata("design:type", String)
], GatewayConnectedUsers.prototype, "socketId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.gatewayConnectedUsers),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], GatewayConnectedUsers.prototype, "user", void 0);
GatewayConnectedUsers = __decorate([
    (0, typeorm_1.Index)("pk_gatewayconnectedusers_933578364", ["id"], { unique: true }),
    (0, typeorm_1.Entity)("GatewayConnectedUsers", { schema: "dbo" })
], GatewayConnectedUsers);
exports.GatewayConnectedUsers = GatewayConnectedUsers;
//# sourceMappingURL=GatewayConnectedUsers.js.map