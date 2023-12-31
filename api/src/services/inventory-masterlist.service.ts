import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITEM_ERROR_NOT_FOUND } from "src/common/constant/item.constant";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { ItemBranch } from "src/db/entities/ItemBranch";
import { Repository } from "typeorm";

@Injectable()
export class InventoryMasterlistService {
  constructor(
    @InjectRepository(ItemBranch)
    private readonly itemBranchRepo: Repository<ItemBranch>
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
          branch: true,
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

  async getByItemCode(branchCode: string, itemCode: string) {
    const result = await this.itemBranchRepo.findOne({
      where: {
        item: {
          itemCode: itemCode?.toString()?.toLowerCase(),
          active: true,
        },
        branch: {
          branchCode,
        },
      },
      relations: {
        item: {
          itemCategory: true,
        },
        branch: true,
      },
    });
    if (!result) {
      throw Error(ITEM_ERROR_NOT_FOUND);
    }
    return result;
  }
}
