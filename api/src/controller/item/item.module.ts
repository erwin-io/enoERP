import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { Item } from "src/db/entities/Item";
import { ItemService } from "src/services/item.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
