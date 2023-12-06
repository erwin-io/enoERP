"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRequestModule = void 0;
const common_1 = require("@nestjs/common");
const inventory_request_controller_1 = require("./inventory-request.controller");
const InventoryRequest_1 = require("../../db/entities/InventoryRequest");
const inventory_request_service_1 = require("../../services/inventory-request.service");
const typeorm_1 = require("@nestjs/typeorm");
const chat_gateway_1 = require("../../core/gateway/chat.gateway");
const GatewayConnectedUsers_1 = require("../../db/entities/GatewayConnectedUsers");
const gateway_connected_users_service_1 = require("../../services/gateway-connected-users.service");
let InventoryRequestModule = class InventoryRequestModule {
};
InventoryRequestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([InventoryRequest_1.InventoryRequest, GatewayConnectedUsers_1.GatewayConnectedUsers]),
        ],
        controllers: [inventory_request_controller_1.InventoryRequestController],
        providers: [
            inventory_request_service_1.InventoryRequestService,
            chat_gateway_1.ChatGateway,
            gateway_connected_users_service_1.GatewayConnectedUsersService,
        ],
        exports: [inventory_request_service_1.InventoryRequestService, chat_gateway_1.ChatGateway, gateway_connected_users_service_1.GatewayConnectedUsersService],
    })
], InventoryRequestModule);
exports.InventoryRequestModule = InventoryRequestModule;
//# sourceMappingURL=inventory-request.module.js.map