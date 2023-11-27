import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { ITEMCATEGORY_ERROR_NOT_FOUND } from "src/common/constant/item-category.constant";
import { ITEM_ERROR_NOT_FOUND } from "src/common/constant/item.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import { WAREHOUSE_ERROR_NO_SETUP } from "src/common/constant/warehouse.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateItemDto } from "src/core/dto/item/item.create.dto";
import { UpdateItemDto } from "src/core/dto/item/item.update.dto";
import { Branch } from "src/db/entities/Branch";
import { InventoryRequestRate } from "src/db/entities/InventoryRequestRate";
import { Item } from "src/db/entities/Item";
import { ItemBranch } from "src/db/entities/ItemBranch";
import { ItemCategory } from "src/db/entities/ItemCategory";
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Warehouse } from "src/db/entities/Warehouse";
import { Repository } from "typeorm";
@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.itemRepo.find({
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
        relations: {
          itemCategory: true,
        },
      }),
      this.itemRepo.count({
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

  async getById(itemId) {
    const result = await this.itemRepo.findOne({
      where: {
        itemId,
        active: true,
      },
      relations: {
        itemCategory: true,
      },
    });
    if (!result) {
      throw Error(ITEM_ERROR_NOT_FOUND);
    }
    return result;
  }

  async getByCode(itemCode = "") {
    const result = await this.itemRepo.findOne({
      where: {
        itemCode: itemCode?.toString()?.toLowerCase(),
        active: true,
      },
      relations: {
        itemCategory: true,
      },
    });
    if (!result) {
      throw Error(ITEM_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateItemDto) {
    return await this.itemRepo.manager.transaction(async (entityManager) => {
      const hasWareHouse = await entityManager.find(Warehouse, {
        where: { active: true },
      });
      if (!hasWareHouse) {
        throw Error(WAREHOUSE_ERROR_NO_SETUP);
      }
      let item = new Item();
      item.itemCode = dto.itemCode.toLowerCase();
      item.itemName = dto.itemName;
      item.itemDescription = dto.itemDescription;
      item.price = dto.price ? dto.price.toString() : "0";

      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      item.dateAdded = timestamp;
      const itemCategory = await entityManager.findOne(ItemCategory, {
        where: {
          itemCategoryId: dto.itemCategoryId,
        },
      });
      if (!itemCategory) {
        throw Error(ITEMCATEGORY_ERROR_NOT_FOUND);
      }
      item.itemCategory = itemCategory;
      item = await entityManager.save(item);
      //create itemWarehouse entries
      const warehouses = await entityManager.find(Warehouse);
      const itemWarehouses: ItemWarehouse[] = [];
      for (const warehouse of warehouses) {
        const itemWarehouse = new ItemWarehouse();
        itemWarehouse.item = item;
        itemWarehouse.warehouse = warehouse;
        itemWarehouses.push(itemWarehouse);
      }
      await entityManager.insert(ItemWarehouse, itemWarehouses);
      //create itemBranch entries
      const branches = await entityManager.find(Branch);
      const itemBranches: ItemBranch[] = [];
      for (const branch of branches) {
        const itemBranch = new ItemBranch();
        itemBranch.item = item;
        itemBranch.branch = branch;
        itemBranches.push(itemBranch);
      }
      await entityManager.insert(ItemBranch, itemBranches);

      let inventoryRequestRate = new InventoryRequestRate();
      inventoryRequestRate.rateName = "1pc";
      inventoryRequestRate.rate = dto.price.toString();
      inventoryRequestRate.minQuantity = "1";
      inventoryRequestRate.maxQuantity = "1";
      inventoryRequestRate.item = item;
      inventoryRequestRate.baseRate = true;
      inventoryRequestRate = await entityManager.save(
        InventoryRequestRate,
        inventoryRequestRate
      );
      inventoryRequestRate.inventoryRequestRateCode = generateIndentityCode(
        inventoryRequestRate.inventoryRequestRateId
      );
      await entityManager.save(InventoryRequestRate, inventoryRequestRate);

      return await entityManager.findOne(Item, {
        where: {
          itemId: item.itemId,
        },
        relations: {
          itemCategory: true,
        },
      });
    });
  }

  async update(itemId, dto: UpdateItemDto) {
    return await this.itemRepo.manager.transaction(async (entityManager) => {
      const item = await entityManager.findOne(Item, {
        where: {
          itemId,
          active: true,
        },
        relations: {
          itemCategory: true,
        },
      });
      if (!item) {
        throw Error(ITEM_ERROR_NOT_FOUND);
      }

      item.itemCode = dto.itemCode.toLowerCase();
      item.itemName = dto.itemName;
      item.itemDescription = dto.itemDescription;
      item.price = dto.price ? dto.price.toString() : "0";

      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      item.dateLastUpdated = timestamp;
      const itemCategory = await entityManager.findOne(ItemCategory, {
        where: {
          itemCategoryId: dto.itemCategoryId,
        },
      });
      if (!itemCategory) {
        throw Error(ITEMCATEGORY_ERROR_NOT_FOUND);
      }
      item.itemCategory = itemCategory;
      return await entityManager.save(Item, item);
    });
  }

  async delete(itemId) {
    return await this.itemRepo.manager.transaction(async (entityManager) => {
      const item = await entityManager.findOne(Item, {
        where: {
          itemId,
          active: true,
        },
        relations: {
          itemCategory: true,
        },
      });
      if (!item) {
        throw Error(ITEM_ERROR_NOT_FOUND);
      }
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      item.dateLastUpdated = timestamp;
      item.active = false;
      return await entityManager.save(Item, item);
    });
  }
}
