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
import { CreateSalesInvoiceDto } from "src/core/dto/sales-invoice/sales-invoice.create.dto";
import { UpdateSalesInvoiceDto } from "src/core/dto/sales-invoice/sales-invoice.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { SalesInvoice } from "src/db/entities/SalesInvoice";
import { SalesInvoiceService } from "src/services/sales-invoice.service";

@ApiTags("salesInvoice")
@Controller("salesInvoice")
export class SalesInvoiceController {
  constructor(private readonly salesInvoiceService: SalesInvoiceService) {}

  @Get("/:salesInvoiceCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("salesInvoiceCode") salesInvoiceCode: string) {
    const res = {} as ApiResponseModel<SalesInvoice>;
    try {
      res.data = await this.salesInvoiceService.getByCode(salesInvoiceCode);
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
      results: SalesInvoice[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.salesInvoiceService.getPagination(params);
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
  async create(@Body() salesInvoiceDto: CreateSalesInvoiceDto) {
    const res: ApiResponseModel<SalesInvoice> = {} as any;
    try {
      res.data = await this.salesInvoiceService.create(salesInvoiceDto);
      res.success = true;
      res.message = `Sales Invoice ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/void/:salesInvoiceCode/")
  //   @UseGuards(JwtAuthGuard)
  async void(@Param("salesInvoiceCode") salesInvoiceCode: string) {
    const res: ApiResponseModel<SalesInvoice> = {} as any;
    try {
      res.data = await this.salesInvoiceService.void(salesInvoiceCode);
      res.success = true;
      res.message = `Sales Invoice ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
