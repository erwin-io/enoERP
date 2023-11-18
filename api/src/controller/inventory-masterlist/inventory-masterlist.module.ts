import { InventoryMasterlistService } from "../../services/inventory-masterlist.service";
import { ItemBranch } from "src/db/entities/ItemBranch";
import { Module } from "@nestjs/common";
import { InventoryMasterlistController } from "./inventory-masterlist.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ItemBranch])],
  controllers: [InventoryMasterlistController],
  providers: [InventoryMasterlistService],
  exports: [InventoryMasterlistService],
})
export class InventoryMasterlistModule {}
