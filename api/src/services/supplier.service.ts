import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITEMCATEGORY_ERROR_NOT_FOUND } from "src/common/constant/item-category.constant";
import { SUPPLIER_ERROR_NOT_FOUND } from "src/common/constant/supplier.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateSupplierDto } from "src/core/dto/supplier/supplier.create.dto";
import { UpdateSupplierDto } from "src/core/dto/supplier/supplier.update.dto";
import { Supplier } from "src/db/entities/Supplier";
import { Repository } from "typeorm";

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.supplierRepo.find({
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
      }),
      this.supplierRepo.count({
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

  async getByCode(supplierCode) {
    const result = await this.supplierRepo.findOne({
      where: {
        supplierCode,
        active: true,
      },
    });
    if (!result) {
      throw Error(SUPPLIER_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateSupplierDto) {
    return await this.supplierRepo.manager.transaction(
      async (entityManager) => {
        let supplier = new Supplier();
        supplier.name = dto.name;
        supplier = await entityManager.save(supplier);
        supplier.supplierCode = generateIndentityCode(supplier.supplierId);
        return await entityManager.save(Supplier, supplier);
      }
    );
  }

  async update(supplierCode, dto: UpdateSupplierDto) {
    return await this.supplierRepo.manager.transaction(
      async (entityManager) => {
        const supplier = await entityManager.findOne(Supplier, {
          where: {
            supplierCode,
            active: true,
          },
        });
        if (!supplier) {
          throw Error(ITEMCATEGORY_ERROR_NOT_FOUND);
        }
        supplier.name = dto.name;
        return await entityManager.save(Supplier, supplier);
      }
    );
  }

  async delete(supplierCode) {
    return await this.supplierRepo.manager.transaction(
      async (entityManager) => {
        const supplier = await entityManager.findOne(Supplier, {
          where: {
            supplierCode,
            active: true,
          },
        });
        if (!supplier) {
          throw Error(ITEMCATEGORY_ERROR_NOT_FOUND);
        }
        supplier.active = false;
        return await entityManager.save(Supplier, supplier);
      }
    );
  }
}
