import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WAREHOUSE_ERROR_NOT_FOUND } from "src/common/constant/warehouse.constant";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { CreateWarehouseDto } from "src/core/dto/warehouse/warehouse.create.dto";
import { UpdateWarehouseDto } from "src/core/dto/warehouse/warehouse.update.dto";
import { Item } from "src/db/entities/Item";
import { ItemWarehouse } from "src/db/entities/ItemWarehouse";
import { Warehouse } from "src/db/entities/Warehouse";
import { Repository } from "typeorm";

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.warehouseRepo.find({
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
      }),
      this.warehouseRepo.count({
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

  async getById(warehouseId) {
    const result = await this.warehouseRepo.findOne({
      where: {
        warehouseId,
        active: true,
      },
    });
    if (!result) {
      throw Error(WAREHOUSE_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateWarehouseDto) {
    return await this.warehouseRepo.manager.transaction(
      async (entityManager) => {
        let warehouse = new Warehouse();
        warehouse.warehouseCode = dto.warehouseCode;
        warehouse.name = dto.name;
        warehouse = await entityManager.save(warehouse);

        //create itemWarehouse entries
        const items = await entityManager.find(Item);
        const itemWarehouses: ItemWarehouse[] = [];
        for (const item of items) {
          const itemWarehouse = new ItemWarehouse();
          itemWarehouse.item = item;
          itemWarehouse.warehouse = warehouse;
          itemWarehouses.push(itemWarehouse);
        }
        await entityManager.insert(ItemWarehouse, itemWarehouses);
        return warehouse;
      }
    );
  }

  async update(warehouseId, dto: UpdateWarehouseDto) {
    return await this.warehouseRepo.manager.transaction(
      async (entityManager) => {
        const warehouse = await entityManager.findOne(Warehouse, {
          where: {
            warehouseId,
            active: true,
          },
        });
        if (!warehouse) {
          throw Error(WAREHOUSE_ERROR_NOT_FOUND);
        }
        warehouse.name = dto.name;
        warehouse.warehouseCode = dto.warehouseCode;
        return await entityManager.save(Warehouse, warehouse);
      }
    );
  }

  async delete(warehouseId) {
    return await this.warehouseRepo.manager.transaction(
      async (entityManager) => {
        const warehouse = await entityManager.findOne(Warehouse, {
          where: {
            warehouseId,
            active: true,
          },
        });
        if (!warehouse) {
          throw Error(WAREHOUSE_ERROR_NOT_FOUND);
        }
        warehouse.active = false;
        return await entityManager.save(Warehouse, warehouse);
      }
    );
  }
}
