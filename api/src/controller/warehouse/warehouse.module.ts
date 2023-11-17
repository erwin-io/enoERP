import { Module } from "@nestjs/common";
import { WarehouseController } from "./warehouse.controller";
import { Warehouse } from "src/db/entities/Warehouse";
import { WarehouseService } from "src/services/warehouse.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
