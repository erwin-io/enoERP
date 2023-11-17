import { Module } from "@nestjs/common";
import { BranchController } from "./branch.controller";
import { Branch } from "src/db/entities/Branch";
import { BranchService } from "src/services/branch.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Branch])],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
