import { Module } from "@nestjs/common";
import { InventoryRequestController } from "./inventory-request.controller";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { InventoryRequestService } from "src/services/inventory-request.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([InventoryRequest])],
  controllers: [InventoryRequestController],
  providers: [InventoryRequestService],
  exports: [InventoryRequestService],
})
export class InventoryRequestModule {}
