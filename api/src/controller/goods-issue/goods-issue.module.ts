import { Module } from "@nestjs/common";
import { GoodsIssueController } from "./goods-issue.controller";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsIssueService } from "src/services/goods-issue.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([GoodsIssue])],
  controllers: [GoodsIssueController],
  providers: [GoodsIssueService],
  exports: [GoodsIssueService],
})
export class GoodsIssueModule {}
