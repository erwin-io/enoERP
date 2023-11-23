import { ItemWarehouse } from "./../../db/entities/ItemWarehouse";
import { WarehouseInventoryService } from "../../services/warehouse-inventory.service";
import { Module } from "@nestjs/common";
import { WarehouseInventoryController } from "./warehouse-inventory.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ItemWarehouse])],
  controllers: [WarehouseInventoryController],
  providers: [WarehouseInventoryService],
  exports: [WarehouseInventoryService],
})
export class WarehouseInventoryModule {}
