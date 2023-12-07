import { Module } from "@nestjs/common";
import { InventoryRequestController } from "./inventory-request.controller";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { InventoryRequestService } from "src/services/inventory-request.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GatewayConnectedUsers } from "src/db/entities/GatewayConnectedUsers";
import { PusherService } from "src/services/pusher.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryRequest, GatewayConnectedUsers]),
  ],
  controllers: [InventoryRequestController],
  providers: [InventoryRequestService, PusherService],
  exports: [InventoryRequestService, PusherService],
})
export class InventoryRequestModule {}
