import { Module } from "@nestjs/common";
import { InventoryRequestController } from "./inventory-request.controller";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { InventoryRequestService } from "src/services/inventory-request.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGateway } from "src/core/gateway/chat.gateway";
import { GatewayConnectedUsers } from "src/db/entities/GatewayConnectedUsers";
import { GatewayConnectedUsersService } from "src/services/gateway-connected-users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryRequest, GatewayConnectedUsers]),
  ],
  controllers: [InventoryRequestController],
  providers: [
    InventoryRequestService,
    ChatGateway,
    GatewayConnectedUsersService,
  ],
  exports: [InventoryRequestService, ChatGateway, GatewayConnectedUsersService],
})
export class InventoryRequestModule {}
