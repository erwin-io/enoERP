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
import { CreateInventoryAdjustmentReportDto } from "src/core/dto/inventory-adjustment-report/inventory-adjustment-report.create.dto";
import { CloseInventoryAdjustmentReportStatusDto, ProcessInventoryAdjustmentReportStatusDto, UpdateInventoryAdjustmentReportDto } from "src/core/dto/inventory-adjustment-report/inventory-adjustment-report.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { InventoryAdjustmentReport } from "src/db/entities/InventoryAdjustmentReport";
import { InventoryAdjustmentReportService } from "src/services/inventory-adjustment-report.service";

@ApiTags("inventoryAdjustmentReport")
@Controller("inventoryAdjustmentReport")
export class InventoryAdjustmentReportController {
  constructor(
    private readonly inventoryAdjustmentReportService: InventoryAdjustmentReportService
  ) {}

  @Get("/:inventoryAdjustmentReportCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(
    @Param("inventoryAdjustmentReportCode")
    inventoryAdjustmentReportCode: string
  ) {
    const res = {} as ApiResponseModel<InventoryAdjustmentReport>;
    try {
      res.data = await this.inventoryAdjustmentReportService.getByCode(
        inventoryAdjustmentReportCode
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
      results: InventoryAdjustmentReport[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.inventoryAdjustmentReportService.getPagination(
        params
      );
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
  async create(
    @Body() inventoryAdjustmentReportDto: CreateInventoryAdjustmentReportDto
  ) {
    const res: ApiResponseModel<InventoryAdjustmentReport> = {} as any;
    try {
      res.data = await this.inventoryAdjustmentReportService.create(
        inventoryAdjustmentReportDto
      );
      res.success = true;
      res.message = `Inventory Adjustment Report ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:inventoryAdjustmentReportCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("inventoryAdjustmentReportCode")
    inventoryAdjustmentReportCode: string,
    @Body() dto: UpdateInventoryAdjustmentReportDto
  ) {
    const res: ApiResponseModel<InventoryAdjustmentReport> = {} as any;
    try {
      res.data = await this.inventoryAdjustmentReportService.update(
        inventoryAdjustmentReportCode,
        dto
      );
      res.success = true;
      res.message = `Inventory Adjustment Report ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/processStatus/:inventoryAdjustmentReportCode/")
  //   @UseGuards(JwtAuthGuard)
  async processStatus(
    @Param("inventoryAdjustmentReportCode")
    inventoryAdjustmentReportCode: string,
    @Body() dto: ProcessInventoryAdjustmentReportStatusDto
  ) {
    const res: ApiResponseModel<InventoryAdjustmentReport> = {} as any;
    try {
      res.data = await this.inventoryAdjustmentReportService.updateStatus(
        inventoryAdjustmentReportCode,
        dto
      );
      res.success = true;
      res.message = `Inventory Adjustment Report ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/closeReport/:inventoryAdjustmentReportCode/")
  //   @UseGuards(JwtAuthGuard)
  async closeReport(
    @Param("inventoryAdjustmentReportCode")
    inventoryAdjustmentReportCode: string,
    @Body() dto: CloseInventoryAdjustmentReportStatusDto
  ) {
    const res: ApiResponseModel<InventoryAdjustmentReport> = {} as any;
    try {
      res.data = await this.inventoryAdjustmentReportService.updateStatus(
        inventoryAdjustmentReportCode,
        dto
      );
      res.success = true;
      res.message = `Inventory Adjustment Report ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
