"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const item_category_constant_1 = require("../common/constant/item-category.constant");
const supplier_constant_1 = require("../common/constant/supplier.constant");
const utils_1 = require("../common/utils/utils");
const Supplier_1 = require("../db/entities/Supplier");
const typeorm_2 = require("typeorm");
let SupplierService = class SupplierService {
    constructor(supplierRepo) {
        this.supplierRepo = supplierRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.supplierRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
            }),
            this.supplierRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
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
            throw Error(supplier_constant_1.SUPPLIER_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.supplierRepo.manager.transaction(async (entityManager) => {
            let supplier = new Supplier_1.Supplier();
            supplier.name = dto.name;
            supplier = await entityManager.save(supplier);
            supplier.supplierCode = (0, utils_1.generateIndentityCode)(supplier.supplierId);
            return await entityManager.save(Supplier_1.Supplier, supplier);
        });
    }
    async update(supplierCode, dto) {
        return await this.supplierRepo.manager.transaction(async (entityManager) => {
            const supplier = await entityManager.findOne(Supplier_1.Supplier, {
                where: {
                    supplierCode,
                    active: true,
                },
            });
            if (!supplier) {
                throw Error(item_category_constant_1.ITEMCATEGORY_ERROR_NOT_FOUND);
            }
            supplier.name = dto.name;
            return await entityManager.save(Supplier_1.Supplier, supplier);
        });
    }
    async delete(supplierCode) {
        return await this.supplierRepo.manager.transaction(async (entityManager) => {
            const supplier = await entityManager.findOne(Supplier_1.Supplier, {
                where: {
                    supplierCode,
                    active: true,
                },
            });
            if (!supplier) {
                throw Error(item_category_constant_1.ITEMCATEGORY_ERROR_NOT_FOUND);
            }
            supplier.active = false;
            return await entityManager.save(Supplier_1.Supplier, supplier);
        });
    }
};
SupplierService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Supplier_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SupplierService);
exports.SupplierService = SupplierService;
//# sourceMappingURL=supplier.service.js.map