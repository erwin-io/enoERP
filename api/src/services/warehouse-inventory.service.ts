import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITEM_ERROR_NOT_FOUND } from "src/common/constant/item.constant";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Repository } from "typeorm";

@Injectable()
export class WarehouseInventoryService {
  constructor(
    @InjectRepository(ItemWarehouse)
    private readonly itemWarehouse: Repository<ItemWarehouse>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    if (condition.item) {
      condition.item.active = true;
    } else {
      condition.item = {
        active: true,
      };
    }
    const [results, total] = await Promise.all([
      this.itemWarehouse.find({
        where: {
          ...condition,
        },
        skip,
        take,
        order,
        relations: {
          item: {
            itemCategory: true,
          },
          warehouse: true,
        },
      }),
      this.itemWarehouse.count({
        where: {
          ...condition,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getByItemCode(warehouseCode: string, itemCode: string) {
    const result = await this.itemWarehouse.findOne({
      where: {
        item: {
          itemCode: itemCode?.toString()?.toLowerCase(),
          active: true,
        },
        warehouse: {
          warehouseCode,
        },
      },
      relations: {
        item: {
          itemCategory: true,
        },
        warehouse: true,
      },
    });
    if (!result) {
      throw Error(ITEM_ERROR_NOT_FOUND);
    }
    return result;
  }
}
