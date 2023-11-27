import { Module } from "@nestjs/common";
import { InventoryAdjustmentReportController } from "./inventory-adjustment-report.controller";
import { InventoryAdjustmentReport } from "src/db/entities/InventoryAdjustmentReport";
import { InventoryAdjustmentReportService } from "src/services/inventory-adjustment-report.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([InventoryAdjustmentReport])],
  controllers: [InventoryAdjustmentReportController],
  providers: [InventoryAdjustmentReportService],
  exports: [InventoryAdjustmentReportService],
})
export class InventoryAdjustmentReportModule {}
