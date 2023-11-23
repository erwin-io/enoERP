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
import { CreateInventoryRequestRateDto } from "src/core/dto/inventory-request-rate/inventory-request-rate.create.dto";
import { UpdateInventoryRequestRateDto } from "src/core/dto/inventory-request-rate/inventory-request-rate.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { InventoryRequestRate } from "src/db/entities/InventoryRequestRate";
import { InventoryRequestRateService } from "src/services/inventory-request-rate.service";

@ApiTags("inventoryRequestRate")
@Controller("inventoryRequestRate")
export class InventoryRequestRateController {
  constructor(
    private readonly inventoryRequestRateService: InventoryRequestRateService
  ) {}

  @Get("/:inventoryRequestRateCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(
    @Param("inventoryRequestRateCode") inventoryRequestRateCode: string
  ) {
    const res = {} as ApiResponseModel<InventoryRequestRate>;
    try {
      res.data = await this.inventoryRequestRateService.getByCode(
        inventoryRequestRateCode
      );
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
    const res: ApiResponseModel<{
      results: InventoryRequestRate[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.inventoryRequestRateService.getPagination(params);
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
  async create(@Body() inventoryRequestRateDto: CreateInventoryRequestRateDto) {
    const res: ApiResponseModel<InventoryRequestRate> = {} as any;
    try {
      res.data = await this.inventoryRequestRateService.create(
        inventoryRequestRateDto
      );
      res.success = true;
      res.message = `Inventory request rate ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:inventoryRequestRateCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("inventoryRequestRateCode") inventoryRequestRateCode: string,
    @Body() dto: UpdateInventoryRequestRateDto
  ) {
    const res: ApiResponseModel<InventoryRequestRate> = {} as any;
    try {
      res.data = await this.inventoryRequestRateService.update(
        inventoryRequestRateCode,
        dto
      );
      res.success = true;
      res.message = `Inventory request rate ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:inventoryRequestRateCode")
  //   @UseGuards(JwtAuthGuard)
  async delete(
    @Param("inventoryRequestRateCode") inventoryRequestRateCode: string
  ) {
    const res: ApiResponseModel<InventoryRequestRate> = {} as any;
    try {
      res.data = await this.inventoryRequestRateService.delete(
        inventoryRequestRateCode
      );
      res.success = true;
      res.message = `Inventory request rate ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
