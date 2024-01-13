import { Module } from "@nestjs/common";
import { GoodsReceiptController } from "./goods-receipt.controller";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { GoodsReceiptService } from "src/services/goods-receipt.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PusherService } from "src/services/pusher.service";

@Module({
  imports: [TypeOrmModule.forFeature([GoodsReceipt])],
  controllers: [GoodsReceiptController],
  providers: [GoodsReceiptService, PusherService],
  exports: [GoodsReceiptService, PusherService],
})
export class GoodsReceiptModule {}
