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
exports.ItemCategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const item_category_constant_1 = require("../common/constant/item-category.constant");
const utils_1 = require("../common/utils/utils");
const ItemCategory_1 = require("../db/entities/ItemCategory");
const typeorm_2 = require("typeorm");
let ItemCategoryService = class ItemCategoryService {
    constructor(itemCategoryRepo) {
        this.itemCategoryRepo = itemCategoryRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.itemCategoryRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
            }),
            this.itemCategoryRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getById(itemCategoryId) {
        const result = await this.itemCategoryRepo.findOne({
            where: {
                itemCategoryId,
                active: true,
            },
        });
        if (!result) {
            throw Error(item_category_constant_1.ITEMCATEGORY_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.itemCategoryRepo.manager.transaction(async (entityManager) => {
            const itemCategory = new ItemCategory_1.ItemCategory();
            itemCategory.name = dto.name;
            itemCategory.description = dto.description;
            return await entityManager.save(itemCategory);
        });
    }
    async update(itemCategoryId, dto) {
        return await this.itemCategoryRepo.manager.transaction(async (entityManager) => {
            const itemCategory = await entityManager.findOne(ItemCategory_1.ItemCategory, {
                where: {
                    itemCategoryId,
                    active: true,
                },
            });
            if (!itemCategory) {
                throw Error(item_category_constant_1.ITEMCATEGORY_ERROR_NOT_FOUND);
            }
            itemCategory.name = dto.name;
            itemCategory.description = dto.description;
            return await entityManager.save(ItemCategory_1.ItemCategory, itemCategory);
        });
    }
    async delete(itemCategoryId) {
        return await this.itemCategoryRepo.manager.transaction(async (entityManager) => {
            const itemCategory = await entityManager.findOne(ItemCategory_1.ItemCategory, {
                where: {
                    itemCategoryId,
                    active: true,
                },
            });
            if (!itemCategory) {
                throw Error(item_category_constant_1.ITEMCATEGORY_ERROR_NOT_FOUND);
            }
            itemCategory.active = false;
            return await entityManager.save(ItemCategory_1.ItemCategory, itemCategory);
        });
    }
};
ItemCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ItemCategory_1.ItemCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ItemCategoryService);
exports.ItemCategoryService = ItemCategoryService;
//# sourceMappingURL=item-category.service.js.map