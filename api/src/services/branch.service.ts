import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BRANCH_ERROR_NOT_FOUND } from "src/common/constant/branch.constant";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { CreateBranchDto } from "src/core/dto/branch/branch.create.dto";
import { UpdateBranchDto } from "src/core/dto/branch/branch.update.dto";
import { Branch } from "src/db/entities/Branch";
import { Item } from "src/db/entities/Item";
import { ItemBranch } from "src/db/entities/ItemBranch";
import { Repository } from "typeorm";

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.branchRepo.find({
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
      }),
      this.branchRepo.count({
        where: {
          ...condition,
          active: true,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getById(branchId) {
    const result = await this.branchRepo.findOne({
      where: {
        branchId,
        active: true,
      },
    });
    if (!result) {
      throw Error(BRANCH_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateBranchDto) {
    return await this.branchRepo.manager.transaction(async (entityManager) => {
      let branch = new Branch();
      branch.branchCode = dto.branchCode;
      branch.name = dto.name;
      branch = await entityManager.save(branch);

      //create itemWarehouse entries
      const items = await entityManager.find(Item);
      const itemWarehouses: ItemBranch[] = [];
      for (const item of items) {
        const itemWarehouse = new ItemBranch();
        itemWarehouse.item = item;
        itemWarehouse.branch = branch;
        itemWarehouses.push(itemWarehouse);
      }
      await entityManager.insert(ItemBranch, itemWarehouses);
      return branch;
    });
  }

  async update(branchId, dto: UpdateBranchDto) {
    return await this.branchRepo.manager.transaction(async (entityManager) => {
      const branch = await entityManager.findOne(Branch, {
        where: {
          branchId,
          active: true,
        },
      });
      if (!branch) {
        throw Error(BRANCH_ERROR_NOT_FOUND);
      }
      branch.branchCode = dto.branchCode;
      branch.name = dto.name;
      return await entityManager.save(Branch, branch);
    });
  }

  async delete(branchId) {
    return await this.branchRepo.manager.transaction(async (entityManager) => {
      const branch = await entityManager.findOne(Branch, {
        where: {
          branchId,
          active: true,
        },
      });
      if (!branch) {
        throw Error(BRANCH_ERROR_NOT_FOUND);
      }
      branch.active = false;
      return await entityManager.save(Branch, branch);
    });
  }
}
