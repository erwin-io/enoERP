import { Module } from "@nestjs/common";
import { GoodsIssueController } from "./goods-issue.controller";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsIssueService } from "src/services/goods-issue.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PusherService } from "src/services/pusher.service";

@Module({
  imports: [TypeOrmModule.forFeature([GoodsIssue])],
  controllers: [GoodsIssueController],
  providers: [GoodsIssueService, PusherService],
  exports: [GoodsIssueService, PusherService],
})
export class GoodsIssueModule {}
