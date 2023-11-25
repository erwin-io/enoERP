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
import { CreateGoodsReceiptDto } from "src/core/dto/goods-receipt/goods-receipt.create.dto";
import {
  UpdateGoodsReceiptDto,
  UpdateGoodsReceiptStatusDto,
} from "src/core/dto/goods-receipt/goods-receipt.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { GoodsReceiptService } from "src/services/goods-receipt.service";

@ApiTags("goodsReceipt")
@Controller("goodsReceipt")
export class GoodsReceiptController {
  constructor(private readonly goodsReceiptService: GoodsReceiptService) {}

  @Get("/:goodsReceiptCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("goodsReceiptCode") goodsReceiptCode: string) {
    const res = {} as ApiResponseModel<GoodsReceipt>;
    try {
      res.data = await this.goodsReceiptService.getByCode(goodsReceiptCode);
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
      results: GoodsReceipt[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.goodsReceiptService.getPagination(params);
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
  async create(@Body() goodsReceiptDto: CreateGoodsReceiptDto) {
    const res: ApiResponseModel<GoodsReceipt> = {} as any;
    try {
      res.data = await this.goodsReceiptService.create(goodsReceiptDto);
      res.success = true;
      res.message = `Goods Receipt ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:goodsReceiptCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("goodsReceiptCode") goodsReceiptCode: string,
    @Body() dto: UpdateGoodsReceiptDto
  ) {
    const res: ApiResponseModel<GoodsReceipt> = {} as any;
    try {
      res.data = await this.goodsReceiptService.update(goodsReceiptCode, dto);
      res.success = true;
      res.message = `Goods Receipt ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateStatus/:goodsReceiptCode/")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("goodsReceiptCode") goodsReceiptCode: string,
    @Body() dto: UpdateGoodsReceiptStatusDto
  ) {
    const res: ApiResponseModel<GoodsReceipt> = {} as any;
    try {
      res.data = await this.goodsReceiptService.updateStatus(
        goodsReceiptCode,
        dto
      );
      res.success = true;
      res.message = `Goods Receipt ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
