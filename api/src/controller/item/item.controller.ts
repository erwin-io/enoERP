import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { CreateItemDto } from "src/core/dto/item/item.create.dto";
import { UpdateItemDto } from "src/core/dto/item/item.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Item } from "src/db/entities/Item";
import { ItemService } from "src/services/item.service";

@ApiTags("item")
@Controller("item")
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get("/:itemId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("itemId") itemId: string) {
    const res = {} as ApiResponseModel<Item>;
    try {
      res.data = await this.itemService.getById(itemId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{ results: Item[]; total: number }> = {} as any;
    try {
      res.data = await this.itemService.getPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  //   @UseGuards(JwtAuthGuard)
  async create(@Body() itemDto: CreateItemDto) {
    const res: ApiResponseModel<Item> = {} as any;
    try {
      res.data = await this.itemService.create(itemDto);
      res.success = true;
      res.message = `Item ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:itemId")
  //   @UseGuards(JwtAuthGuard)
  async update(@Param("itemId") itemId: string, @Body() dto: UpdateItemDto) {
    const res: ApiResponseModel<Item> = {} as any;
    try {
      res.data = await this.itemService.update(itemId, dto);
      res.success = true;
      res.message = `Item ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:itemId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("itemId") itemId: string) {
    const res: ApiResponseModel<Item> = {} as any;
    try {
      res.data = await this.itemService.delete(itemId);
      res.success = true;
      res.message = `Item ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
