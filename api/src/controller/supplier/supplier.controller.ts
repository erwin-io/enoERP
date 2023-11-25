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
import { CreateSupplierDto } from "src/core/dto/supplier/supplier.create.dto";
import { UpdateSupplierDto } from "src/core/dto/supplier/supplier.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Supplier } from "src/db/entities/Supplier";
import { SupplierService } from "src/services/supplier.service";

@ApiTags("supplier")
@Controller("supplier")
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get("/:supplierCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("supplierCode") supplierCode: string) {
    const res = {} as ApiResponseModel<Supplier>;
    try {
      res.data = await this.supplierService.getByCode(supplierCode);
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
    const res: ApiResponseModel<{ results: Supplier[]; total: number }> =
      {} as any;
    try {
      res.data = await this.supplierService.getPagination(params);
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
  async create(@Body() supplierDto: CreateSupplierDto) {
    const res: ApiResponseModel<Supplier> = {} as any;
    try {
      res.data = await this.supplierService.create(supplierDto);
      res.success = true;
      res.message = `Supplier ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:supplierCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("supplierCode") supplierCode: string,
    @Body() dto: UpdateSupplierDto
  ) {
    const res: ApiResponseModel<Supplier> = {} as any;
    try {
      res.data = await this.supplierService.update(supplierCode, dto);
      res.success = true;
      res.message = `Supplier ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:supplierCode")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("supplierCode") supplierCode: string) {
    const res: ApiResponseModel<Supplier> = {} as any;
    try {
      res.data = await this.supplierService.delete(supplierCode);
      res.success = true;
      res.message = `Supplier ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
