import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  INVENTORYREQUESTRATE_BASERATE_ERROR_NOT_FOUND,
  INVENTORYREQUESTRATE_ERROR_NOT_FOUND,
} from "src/common/constant/inventory-request-rate.constant";
import { ITEM_ERROR_NOT_FOUND } from "src/common/constant/item.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateInventoryRequestRateDto } from "src/core/dto/inventory-request-rate/inventory-request-rate.create.dto";
import { UpdateInventoryRequestRateDto } from "src/core/dto/inventory-request-rate/inventory-request-rate.update.dto";
import { InventoryRequestRate } from "src/db/entities/InventoryRequestRate";
import { Item } from "src/db/entities/Item";
import { Repository } from "typeorm";

@Injectable()
export class InventoryRequestRateService {
  constructor(
    @InjectRepository(InventoryRequestRate)
    private readonly inventoryRequestRateRepo: Repository<InventoryRequestRate>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.inventoryRequestRateRepo.find({
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
        relations: {
          item: {
            itemCategory: true,
          },
        },
      }),
      this.inventoryRequestRateRepo.count({
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

  async getByCode(inventoryRequestRateCode) {
    const result = await this.inventoryRequestRateRepo.findOne({
      where: {
        inventoryRequestRateCode,
        active: true,
      },
      relations: {
        item: {
          itemCategory: true,
        },
      },
    });
    if (!result) {
      throw Error(INVENTORYREQUESTRATE_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateInventoryRequestRateDto) {
    return await this.inventoryRequestRateRepo.manager.transaction(
      async (entityManager) => {
        let inventoryRequestRate = new InventoryRequestRate();
        inventoryRequestRate.rateName = dto.rateName;
        inventoryRequestRate.rate = dto.rate.toString();
        inventoryRequestRate.minQuantity = dto.minQuantity.toString();
        inventoryRequestRate.maxQuantity = dto.maxQuantity.toString();
        const item = await entityManager.findOne(Item, {
          where: { itemId: dto.itemId, active: true },
        });
        if (!item) {
          throw Error(ITEM_ERROR_NOT_FOUND);
        }
        if (
          Number(inventoryRequestRate.minQuantity) === 1 ||
          Number(inventoryRequestRate.maxQuantity) === 1
        ) {
          throw Error(
            "Not allowed!, max and min quantity should not be equal to base rate!"
          );
        }
        const baseRate = await entityManager.findOne(InventoryRequestRate, {
          where: {
            item: {
              itemId: dto.itemId,
            },
            active: true,
            baseRate: true,
          },
        });
        if (
          Number(dto.rate) <= Number(baseRate.rate) &&
          Number(dto.minQuantity) > 1
        ) {
          throw Error(
            `Invalid rate!, rate should not be less than the base rate, since min quantity is ${dto.minQuantity}!`
          );
        }
        inventoryRequestRate.item = item;
        inventoryRequestRate = await entityManager.save(inventoryRequestRate);
        inventoryRequestRate.inventoryRequestRateCode = generateIndentityCode(
          inventoryRequestRate.inventoryRequestRateId
        );
        return await entityManager.save(
          InventoryRequestRate,
          inventoryRequestRate
        );
      }
    );
  }

  async update(inventoryRequestRateCode, dto: UpdateInventoryRequestRateDto) {
    return await this.inventoryRequestRateRepo.manager.transaction(
      async (entityManager) => {
        const inventoryRequestRate = await entityManager.findOne(
          InventoryRequestRate,
          {
            where: {
              inventoryRequestRateCode,
              active: true,
            },
            relations: {
              item: {
                itemCategory: true,
              },
            },
          }
        );
        if (!inventoryRequestRate) {
          throw Error(INVENTORYREQUESTRATE_ERROR_NOT_FOUND);
        }
        if (
          inventoryRequestRate.baseRate &&
          dto.minQuantity !== Number(inventoryRequestRate.minQuantity) &&
          dto.maxQuantity !== Number(inventoryRequestRate.maxQuantity)
        ) {
          throw Error("Not allowed to update base rate!");
        }
        if (
          (!inventoryRequestRate.baseRate &&
            Number(inventoryRequestRate.minQuantity) === 1) ||
          Number(inventoryRequestRate.maxQuantity) === 1
        ) {
          throw Error(
            "Not allowed!, max and min quantity should not be equal to base rate!"
          );
        }
        const baseRate = await entityManager.findOne(InventoryRequestRate, {
          where: {
            item: {
              itemId: inventoryRequestRate.item.itemId,
            },
            active: true,
            baseRate: true,
          },
        });
        if (
          !inventoryRequestRate.baseRate &&
          Number(baseRate.rate) > Number(dto.rate) * Number(dto.minQuantity)
        ) {
          throw Error(
            `Invalid rate!, rate should not be less than the base rate, since min quantity is ${dto.minQuantity}!`
          );
        }
        inventoryRequestRate.rateName = dto.rateName;
        inventoryRequestRate.rate = dto.rate.toString();
        inventoryRequestRate.minQuantity = dto.minQuantity.toString();
        inventoryRequestRate.maxQuantity = dto.maxQuantity.toString();
        return await entityManager.save(
          InventoryRequestRate,
          inventoryRequestRate
        );
      }
    );
  }

  async delete(inventoryRequestRateCode) {
    return await this.inventoryRequestRateRepo.manager.transaction(
      async (entityManager) => {
        const inventoryRequestRate = await entityManager.findOne(
          InventoryRequestRate,
          {
            where: {
              inventoryRequestRateCode,
              active: true,
            },
          }
        );
        if (!inventoryRequestRate) {
          throw Error(INVENTORYREQUESTRATE_ERROR_NOT_FOUND);
        }
        if (inventoryRequestRate.baseRate) {
          throw Error(INVENTORYREQUESTRATE_BASERATE_ERROR_NOT_FOUND);
        }
        inventoryRequestRate.active = false;
        return await entityManager.save(
          InventoryRequestRate,
          inventoryRequestRate
        );
      }
    );
  }
}
