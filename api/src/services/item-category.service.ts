import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITEMCATEGORY_ERROR_NOT_FOUND } from "src/common/constant/item-category.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateItemCategoryDto } from "src/core/dto/item-category/item-category.create.dto";
import { UpdateItemCategoryDto } from "src/core/dto/item-category/item-category.update.dto";
import { ItemCategory } from "src/db/entities/ItemCategory";
import { Repository } from "typeorm";

@Injectable()
export class ItemCategoryService {
  constructor(
    @InjectRepository(ItemCategory)
    private readonly itemCategoryRepo: Repository<ItemCategory>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.itemCategoryRepo.find({
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
      }),
      this.itemCategoryRepo.count({
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

  async getByCode(itemCategoryCode) {
    const result = await this.itemCategoryRepo.findOne({
      where: {
        itemCategoryCode,
        active: true,
      },
    });
    if (!result) {
      throw Error(ITEMCATEGORY_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateItemCategoryDto) {
    return await this.itemCategoryRepo.manager.transaction(
      async (entityManager) => {
        let itemCategory = new ItemCategory();
        itemCategory.name = dto.name;
        itemCategory.description = dto.description;
        itemCategory = await entityManager.save(itemCategory);
        itemCategory.itemCategoryCode = generateIndentityCode(
          itemCategory.itemCategoryId
        );
        return await entityManager.save(ItemCategory, itemCategory);
      }
    );
  }

  async update(itemCategoryCode, dto: UpdateItemCategoryDto) {
    return await this.itemCategoryRepo.manager.transaction(
      async (entityManager) => {
        const itemCategory = await entityManager.findOne(ItemCategory, {
          where: {
            itemCategoryCode,
            active: true,
          },
        });
        if (!itemCategory) {
          throw Error(ITEMCATEGORY_ERROR_NOT_FOUND);
        }
        itemCategory.name = dto.name;
        itemCategory.description = dto.description;
        return await entityManager.save(ItemCategory, itemCategory);
      }
    );
  }

  async delete(itemCategoryCode) {
    return await this.itemCategoryRepo.manager.transaction(
      async (entityManager) => {
        const itemCategory = await entityManager.findOne(ItemCategory, {
          where: {
            itemCategoryCode,
            active: true,
          },
        });
        if (!itemCategory) {
          throw Error(ITEMCATEGORY_ERROR_NOT_FOUND);
        }
        itemCategory.active = false;
        return await entityManager.save(ItemCategory, itemCategory);
      }
    );
  }
}
