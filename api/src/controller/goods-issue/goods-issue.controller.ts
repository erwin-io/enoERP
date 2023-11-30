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
import { CreateGoodsIssueDto } from "src/core/dto/goods-issue/goods-issue.create.dto";
import {
  UpdateGoodsIssueDto,
  UpdateGoodsIssueStatusDto,
} from "src/core/dto/goods-issue/goods-issue.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsIssueService } from "src/services/goods-issue.service";

@ApiTags("goodsIssue")
@Controller("goodsIssue")
export class GoodsIssueController {
  constructor(private readonly goodsIssueService: GoodsIssueService) {}

  @Get("/:goodsIssueCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("goodsIssueCode") goodsIssueCode: string) {
    const res = {} as ApiResponseModel<GoodsIssue>;
    try {
      res.data = await this.goodsIssueService.getByCode(goodsIssueCode);
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
      results: GoodsIssue[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.goodsIssueService.getPagination(params);
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
  async create(@Body() goodsIssueDto: CreateGoodsIssueDto) {
    const res: ApiResponseModel<GoodsIssue> = {} as any;
    try {
      res.data = await this.goodsIssueService.create(goodsIssueDto);
      res.success = true;
      res.message = `Goods Issue ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:goodsIssueCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("goodsIssueCode") goodsIssueCode: string,
    @Body() dto: UpdateGoodsIssueDto
  ) {
    const res: ApiResponseModel<GoodsIssue> = {} as any;
    try {
      res.data = await this.goodsIssueService.update(goodsIssueCode, dto);
      res.success = true;
      res.message = `Goods Issue ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateStatus/:goodsIssueCode/")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("goodsIssueCode") goodsIssueCode: string,
    @Body() dto: UpdateGoodsIssueStatusDto
  ) {
    const res: ApiResponseModel<GoodsIssue> = {} as any;
    try {
      res.data = await this.goodsIssueService.updateStatus(
        goodsIssueCode,
        dto
      );
      res.success = true;
      res.message = `Goods Issue ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
