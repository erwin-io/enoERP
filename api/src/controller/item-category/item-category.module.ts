import { Module } from "@nestjs/common";
import { ItemCategoryController } from "./item-category.controller";
import { ItemCategory } from "src/db/entities/ItemCategory";
import { ItemCategoryService } from "src/services/item-category.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ItemCategory])],
  controllers: [ItemCategoryController],
  providers: [ItemCategoryService],
  exports: [ItemCategoryService],
})
export class ItemCategoryModule {}
