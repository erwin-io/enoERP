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
import { CreateAccessDto } from "src/core/dto/access/access.create.dto";
import { UpdateAccessDto } from "src/core/dto/access/access.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Access } from "src/db/entities/Access";
import { AccessService } from "src/services/access.service";

@ApiTags("access")
@Controller("access")
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get("/:accessId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("accessId") accessId: string) {
    const res = {} as ApiResponseModel<Access>;
    try {
      res.data = await this.accessService.getById(accessId);
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
    const res: ApiResponseModel<{ results: Access[]; total: number }> =
      {} as any;
    try {
      res.data = await this.accessService.getAccessPagination(params);
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
  async create(@Body() accessDto: CreateAccessDto) {
    const res: ApiResponseModel<Access> = {} as any;
    try {
      res.data = await this.accessService.create(accessDto);
      res.success = true;
      res.message = `Access ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:accessId")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("accessId") accessId: string,
    @Body() dto: UpdateAccessDto
  ) {
    const res: ApiResponseModel<Access> = {} as any;
    try {
      res.data = await this.accessService.update(accessId, dto);
      res.success = true;
      res.message = `Access ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:accessId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("accessId") accessId: string) {
    const res: ApiResponseModel<Access> = {} as any;
    try {
      res.data = await this.accessService.delete(accessId);
      res.success = true;
      res.message = `Access ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
