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
import { CreateItemCategoryDto } from "src/core/dto/item-category/item-category.create.dto";
import { UpdateItemCategoryDto } from "src/core/dto/item-category/item-category.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { ItemCategory } from "src/db/entities/ItemCategory";
import { ItemCategoryService } from "src/services/item-category.service";

@ApiTags("itemCategory")
@Controller("itemCategory")
export class ItemCategoryController {
  constructor(private readonly itemCategoryService: ItemCategoryService) {}

  @Get("/:itemCategoryCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("itemCategoryCode") itemCategoryCode: string) {
    const res = {} as ApiResponseModel<ItemCategory>;
    try {
      res.data = await this.itemCategoryService.getByCode(itemCategoryCode);
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
    const res: ApiResponseModel<{ results: ItemCategory[]; total: number }> =
      {} as any;
    try {
      res.data = await this.itemCategoryService.getPagination(params);
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
  async create(@Body() itemCategoryDto: CreateItemCategoryDto) {
    const res: ApiResponseModel<ItemCategory> = {} as any;
    try {
      res.data = await this.itemCategoryService.create(itemCategoryDto);
      res.success = true;
      res.message = `Item category ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:itemCategoryCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("itemCategoryCode") itemCategoryCode: string,
    @Body() dto: UpdateItemCategoryDto
  ) {
    const res: ApiResponseModel<ItemCategory> = {} as any;
    try {
      res.data = await this.itemCategoryService.update(itemCategoryCode, dto);
      res.success = true;
      res.message = `Item category ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:itemCategoryCode")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("itemCategoryCode") itemCategoryCode: string) {
    const res: ApiResponseModel<ItemCategory> = {} as any;
    try {
      res.data = await this.itemCategoryService.delete(itemCategoryCode);
      res.success = true;
      res.message = `Item category ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
