import { Module } from "@nestjs/common";
import { GoodsReceiptController } from "./goods-receipt.controller";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { GoodsReceiptService } from "src/services/goods-receipt.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGateway } from "src/core/gateway/chat.gateway";
import { GatewayConnectedUsers } from "src/db/entities/GatewayConnectedUsers";
import { GatewayConnectedUsersService } from "src/services/gateway-connected-users.service";

@Module({
  imports: [TypeOrmModule.forFeature([GoodsReceipt, GatewayConnectedUsers])],
  controllers: [GoodsReceiptController],
  providers: [GoodsReceiptService, ChatGateway, GatewayConnectedUsersService],
  exports: [GoodsReceiptService, ChatGateway, GatewayConnectedUsersService],
})
export class GoodsReceiptModule {}
