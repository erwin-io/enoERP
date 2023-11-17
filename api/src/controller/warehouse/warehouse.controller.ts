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
import { CreateWarehouseDto } from "src/core/dto/warehouse/warehouse.create.dto";
import { UpdateWarehouseDto } from "src/core/dto/warehouse/warehouse.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Warehouse } from "src/db/entities/Warehouse";
import { WarehouseService } from "src/services/warehouse.service";

@ApiTags("warehouse")
@Controller("warehouse")
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get("/:warehouseId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("warehouseId") warehouseId: string) {
    const res = {} as ApiResponseModel<Warehouse>;
    try {
      res.data = await this.warehouseService.getById(warehouseId);
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
    const res: ApiResponseModel<{ results: Warehouse[]; total: number }> =
      {} as any;
    try {
      res.data = await this.warehouseService.getPagination(params);
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
  async create(@Body() warehouseDto: CreateWarehouseDto) {
    const res: ApiResponseModel<Warehouse> = {} as any;
    try {
      res.data = await this.warehouseService.create(warehouseDto);
      res.success = true;
      res.message = `Warehouse ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:warehouseId")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("warehouseId") warehouseId: string,
    @Body() dto: UpdateWarehouseDto
  ) {
    const res: ApiResponseModel<Warehouse> = {} as any;
    try {
      res.data = await this.warehouseService.update(warehouseId, dto);
      res.success = true;
      res.message = `Warehouse ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:warehouseId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("warehouseId") warehouseId: string) {
    const res: ApiResponseModel<Warehouse> = {} as any;
    try {
      res.data = await this.warehouseService.delete(warehouseId);
      res.success = true;
      res.message = `Warehouse ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
