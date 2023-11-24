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
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { WarehouseInventoryService } from "src/services/warehouse-inventory.service";

@ApiTags("warehouseInventory")
@Controller("warehouseInventory")
export class WarehouseInventoryController {
  constructor(
    private readonly warehouseInventoryService: WarehouseInventoryService
  ) {}

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{
      results: ItemWarehouse[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.warehouseInventoryService.getPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/:warehouseCode/getByItemCode/:itemCode")
  //   @UseGuards(JwtAuthGuard)
  async getByItemCode(
    @Param("warehouseCode") warehouseCode: string,
    @Param("itemCode") itemCode: string
  ) {
    const res = {} as ApiResponseModel<ItemWarehouse>;
    try {
      res.data = await this.warehouseInventoryService.getByItemCode(
        warehouseCode,
        itemCode
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
