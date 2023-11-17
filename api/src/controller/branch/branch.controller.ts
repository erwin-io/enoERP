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
import { CreateBranchDto } from "src/core/dto/branch/branch.create.dto";
import { UpdateBranchDto } from "src/core/dto/branch/branch.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Branch } from "src/db/entities/Branch";
import { BranchService } from "src/services/branch.service";

@ApiTags("branch")
@Controller("branch")
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get("/:branchId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("branchId") branchId: string) {
    const res = {} as ApiResponseModel<Branch>;
    try {
      res.data = await this.branchService.getById(branchId);
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
    const res: ApiResponseModel<{ results: Branch[]; total: number }> =
      {} as any;
    try {
      res.data = await this.branchService.getPagination(params);
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
  async create(@Body() branchDto: CreateBranchDto) {
    const res: ApiResponseModel<Branch> = {} as any;
    try {
      res.data = await this.branchService.create(branchDto);
      res.success = true;
      res.message = `Item category ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:branchId")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("branchId") branchId: string,
    @Body() dto: UpdateBranchDto
  ) {
    const res: ApiResponseModel<Branch> = {} as any;
    try {
      res.data = await this.branchService.update(branchId, dto);
      res.success = true;
      res.message = `Item category ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:branchId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("branchId") branchId: string) {
    const res: ApiResponseModel<Branch> = {} as any;
    try {
      res.data = await this.branchService.delete(branchId);
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
