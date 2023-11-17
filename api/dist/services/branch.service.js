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
exports.BranchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const branch_constant_1 = require("../common/constant/branch.constant");
const utils_1 = require("../common/utils/utils");
const Branch_1 = require("../db/entities/Branch");
const Item_1 = require("../db/entities/Item");
const ItemBranch_1 = require("../db/entities/ItemBranch");
const typeorm_2 = require("typeorm");
let BranchService = class BranchService {
    constructor(branchRepo) {
        this.branchRepo = branchRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.branchRepo.find({
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
            }),
            this.branchRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
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
            throw Error(branch_constant_1.BRANCH_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.branchRepo.manager.transaction(async (entityManager) => {
            let branch = new Branch_1.Branch();
            branch.branchCode = dto.branchCode;
            branch.name = dto.name;
            branch = await entityManager.save(branch);
            const items = await entityManager.find(Item_1.Item);
            const itemWarehouses = [];
            for (const item of items) {
                const itemWarehouse = new ItemBranch_1.ItemBranch();
                itemWarehouse.item = item;
                itemWarehouse.branch = branch;
                itemWarehouses.push(itemWarehouse);
            }
            await entityManager.insert(ItemBranch_1.ItemBranch, itemWarehouses);
            return branch;
        });
    }
    async update(branchId, dto) {
        return await this.branchRepo.manager.transaction(async (entityManager) => {
            const branch = await entityManager.findOne(Branch_1.Branch, {
                where: {
                    branchId,
                    active: true,
                },
            });
            if (!branch) {
                throw Error(branch_constant_1.BRANCH_ERROR_NOT_FOUND);
            }
            branch.branchCode = dto.branchCode;
            branch.name = dto.name;
            return await entityManager.save(Branch_1.Branch, branch);
        });
    }
    async delete(branchId) {
        return await this.branchRepo.manager.transaction(async (entityManager) => {
            const branch = await entityManager.findOne(Branch_1.Branch, {
                where: {
                    branchId,
                    active: true,
                },
            });
            if (!branch) {
                throw Error(branch_constant_1.BRANCH_ERROR_NOT_FOUND);
            }
            branch.active = false;
            return await entityManager.save(Branch_1.Branch, branch);
        });
    }
};
BranchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Branch_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BranchService);
exports.BranchService = BranchService;
//# sourceMappingURL=branch.service.js.map