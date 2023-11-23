import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Repository } from "typeorm";

@Injectable()
export class WarehouseInventoryService {
  constructor(
    @InjectRepository(ItemWarehouse)
    private readonly itemBranchRepo: Repository<ItemWarehouse>
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
      this.itemBranchRepo.find({
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
      this.itemBranchRepo.count({
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
}
