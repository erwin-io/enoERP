import { Module } from "@nestjs/common";
import { GoodsIssueController } from "./goods-issue.controller";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsIssueService } from "src/services/goods-issue.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGateway } from "src/core/gateway/chat.gateway";
import { GatewayConnectedUsers } from "src/db/entities/GatewayConnectedUsers";
import { GatewayConnectedUsersService } from "src/services/gateway-connected-users.service";

@Module({
  imports: [TypeOrmModule.forFeature([GoodsIssue, GatewayConnectedUsers])],
  controllers: [GoodsIssueController],
  providers: [GoodsIssueService, ChatGateway, GatewayConnectedUsersService],
  exports: [GoodsIssueService, ChatGateway, GatewayConnectedUsersService],
})
export class GoodsIssueModule {}
