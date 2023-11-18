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
import { CreateInventoryRequestDto } from "src/core/dto/inventory-request/inventory-request.create.dto";
import {
  UpdateInventoryRequestDto,
  UpdateInventoryRequestStatusDto,
} from "src/core/dto/inventory-request/inventory-request.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { InventoryRequestService } from "src/services/inventory-request.service";

@ApiTags("inventoryRequest")
@Controller("inventoryRequest")
export class InventoryRequestController {
  constructor(
    private readonly inventoryRequestService: InventoryRequestService
  ) {}

  @Get("/:inventoryRequestCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(
    @Param("inventoryRequestCode") inventoryRequestCode: string
  ) {
    const res = {} as ApiResponseModel<InventoryRequest>;
    try {
      res.data = await this.inventoryRequestService.getByCode(
        inventoryRequestCode
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
      results: InventoryRequest[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.inventoryRequestService.getPagination(params);
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
  async create(@Body() inventoryRequestDto: CreateInventoryRequestDto) {
    const res: ApiResponseModel<InventoryRequest> = {} as any;
    try {
      res.data = await this.inventoryRequestService.create(inventoryRequestDto);
      res.success = true;
      res.message = `Inventory Request ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:inventoryRequestCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("inventoryRequestCode") inventoryRequestCode: string,
    @Body() dto: UpdateInventoryRequestDto
  ) {
    const res: ApiResponseModel<InventoryRequest> = {} as any;
    try {
      res.data = await this.inventoryRequestService.update(
        inventoryRequestCode,
        dto
      );
      res.success = true;
      res.message = `Inventory Request ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateStatus/:inventoryRequestCode/")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("inventoryRequestCode") inventoryRequestCode: string,
    @Body() dto: UpdateInventoryRequestStatusDto
  ) {
    const res: ApiResponseModel<InventoryRequest> = {} as any;
    try {
      res.data = await this.inventoryRequestService.updateStatus(
        inventoryRequestCode,
        dto
      );
      res.success = true;
      res.message = `Inventory Request ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
