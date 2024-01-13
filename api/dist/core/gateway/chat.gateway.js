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
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const GoodsIssue_1 = require("../../db/entities/GoodsIssue");
const GoodsReceipt_1 = require("../../db/entities/GoodsReceipt");
const InventoryRequest_1 = require("../../db/entities/InventoryRequest");
const gateway_connected_users_service_1 = require("../../services/gateway-connected-users.service");
let ChatGateway = class ChatGateway {
    constructor(gatewayConnectedUsersService) {
        this.gatewayConnectedUsersService = gatewayConnectedUsersService;
    }
    async onModuleInit() {
        console.log("start");
    }
    async handleConnection(socket) {
        var _a, _b, _c;
        try {
            const userId = ((_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.headers) && ((_b = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _b === void 0 ? void 0 : _b.headers["userid"])
                ? (_c = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _c === void 0 ? void 0 : _c.headers["userid"]
                : null;
            if (userId &&
                userId !== "undefined" &&
                !isNaN(Number(userId)) &&
                socket.id) {
                const gateway = await this.gatewayConnectedUsersService.findByUserId(userId);
                if (!gateway) {
                    await this.gatewayConnectedUsersService.add({
                        userId,
                        socketId: socket.id,
                    });
                }
            }
        }
        catch (ex) {
            console.log(ex);
        }
    }
    async handleDisconnect(socket) {
        var _a, _b, _c;
        try {
            const userId = ((_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.headers) && ((_b = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _b === void 0 ? void 0 : _b.headers["userid"])
                ? (_c = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _c === void 0 ? void 0 : _c.headers["userid"]
                : null;
            if (userId && userId !== "undefined" && !isNaN(Number(userId))) {
                const gateway = await this.gatewayConnectedUsersService.findByUserId(userId);
                if (gateway) {
                    await this.gatewayConnectedUsersService.deleteByUserId(userId);
                }
            }
            socket.disconnect();
        }
        catch (ex) {
            console.log(ex);
        }
    }
    disconnect(socket) {
        var _a, _b, _c;
        const userId = ((_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.headers) && ((_b = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _b === void 0 ? void 0 : _b.headers["userid"])
            ? (_c = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _c === void 0 ? void 0 : _c.headers["userid"]
            : null;
        if (userId && userId !== "undefined" && !isNaN(Number(userId))) {
            this.gatewayConnectedUsersService
                .deleteByUserId(userId)
                .then((res) => {
                socket.emit("Error", new common_1.UnauthorizedException());
                socket.disconnect();
            }, () => {
                socket.emit("Error", new common_1.UnauthorizedException());
                socket.disconnect();
            })
                .catch((err) => {
                socket.emit("Error", new common_1.UnauthorizedException());
                socket.disconnect();
            });
        }
    }
    async reSync(type, data) {
        try {
            await this.server.emit("reSync", { type, data });
        }
        catch (ex) {
            throw ex;
        }
    }
    async inventoryRequestChanges(userIds, inventoryRequest) {
        try {
            const gateWays = await this.gatewayConnectedUsersService.findByUserIds(userIds);
            if (gateWays && gateWays.length > 0) {
                for (const gateWay of gateWays) {
                    await this.server
                        .to(gateWay.socketId)
                        .emit("inventoryRequestChanges", inventoryRequest);
                }
            }
            await this.server.emit("reSync", {
                type: "INVENTORY_REQUEST",
                data: null,
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async goodsIssueChanges(userIds, goodsIssue) {
        try {
            const gateWays = await this.gatewayConnectedUsersService.findByUserIds(userIds);
            if (gateWays && gateWays.length > 0) {
                for (const gateWay of gateWays) {
                    await this.server
                        .to(gateWay.socketId)
                        .emit("goodsIssueChanges", goodsIssue);
                }
            }
            await this.server.emit("reSync", { type: "GOODS_ISSUE", data: null });
        }
        catch (ex) {
            throw ex;
        }
    }
    async goodsReceiptChanges(userIds, goodsReceipt) {
        try {
            const gateWays = await this.gatewayConnectedUsersService.findByUserIds(userIds);
            if (gateWays && gateWays.length > 0) {
                for (const gateWay of gateWays) {
                    await this.server
                        .to(gateWay.socketId)
                        .emit("goodsReceiptChanges", goodsReceipt);
                }
            }
            await this.server.emit("reSync", { type: "GOODS_RECEIPT", data: null });
        }
        catch (ex) {
            throw ex;
        }
    }
    async sendNotif(userIds, title, description) {
        try {
            const gateWays = await this.gatewayConnectedUsersService.findByUserIds(userIds);
            if (gateWays && gateWays.length > 0) {
                for (const gateWay of gateWays) {
                    await this.server.to(gateWay.socketId).emit("notifAdded", {
                        title,
                        description,
                        unRead: gateWay.unRead,
                    });
                }
            }
        }
        catch (ex) {
            throw ex;
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("reSync"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "reSync", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("inventoryRequestChanges"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, InventoryRequest_1.InventoryRequest]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "inventoryRequestChanges", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("goodsIssueChanges"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, GoodsIssue_1.GoodsIssue]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "goodsIssueChanges", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("goodsReceiptChanges"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, GoodsReceipt_1.GoodsReceipt]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "goodsReceiptChanges", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("notifAdded"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendNotif", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [gateway_connected_users_service_1.GatewayConnectedUsersService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map