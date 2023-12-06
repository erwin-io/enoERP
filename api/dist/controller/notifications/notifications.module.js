"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_controller_1 = require("./notifications.controller");
const Notifications_1 = require("../../db/entities/Notifications");
const notifications_service_1 = require("../../services/notifications.service");
const typeorm_1 = require("@nestjs/typeorm");
const chat_gateway_1 = require("../../core/gateway/chat.gateway");
const GatewayConnectedUsers_1 = require("../../db/entities/GatewayConnectedUsers");
const gateway_connected_users_service_1 = require("../../services/gateway-connected-users.service");
let NotificationsModule = class NotificationsModule {
};
NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Notifications_1.Notifications, GatewayConnectedUsers_1.GatewayConnectedUsers])],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService, chat_gateway_1.ChatGateway, gateway_connected_users_service_1.GatewayConnectedUsersService],
        exports: [notifications_service_1.NotificationsService, chat_gateway_1.ChatGateway, gateway_connected_users_service_1.GatewayConnectedUsersService],
    })
], NotificationsModule);
exports.NotificationsModule = NotificationsModule;
//# sourceMappingURL=notifications.module.js.map