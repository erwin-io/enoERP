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
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { ItemBranch } from "src/db/entities/ItemBranch";
import { InventoryMasterlistService } from "src/services/inventory-masterlist.service";

@ApiTags("inventoryMasterlist")
@Controller("inventoryMasterlist")
export class InventoryMasterlistController {
  constructor(
    private readonly inventoryMasterlistService: InventoryMasterlistService
  ) {}

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{
      results: ItemBranch[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.inventoryMasterlistService.getPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
