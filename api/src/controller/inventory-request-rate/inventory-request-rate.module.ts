import { Module } from "@nestjs/common";
import { InventoryRequestRateController } from "./inventory-request-rate.controller";
import { InventoryRequestRate } from "src/db/entities/InventoryRequestRate";
import { InventoryRequestRateService } from "src/services/inventory-request-rate.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([InventoryRequestRate])],
  controllers: [InventoryRequestRateController],
  providers: [InventoryRequestRateService],
  exports: [InventoryRequestRateService],
})
export class InventoryRequestRateModule {}
