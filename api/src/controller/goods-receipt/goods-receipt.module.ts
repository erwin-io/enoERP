import { Module } from "@nestjs/common";
import { GoodsReceiptController } from "./goods-receipt.controller";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { GoodsReceiptService } from "src/services/goods-receipt.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([GoodsReceipt])],
  controllers: [GoodsReceiptController],
  providers: [GoodsReceiptService],
  exports: [GoodsReceiptService],
})
export class GoodsReceiptModule {}
