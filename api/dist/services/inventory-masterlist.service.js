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
exports.InventoryMasterlistService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const utils_1 = require("../common/utils/utils");
const ItemBranch_1 = require("../db/entities/ItemBranch");
const typeorm_2 = require("typeorm");
let InventoryMasterlistService = class InventoryMasterlistService {
    constructor(itemBranchRepo) {
        this.itemBranchRepo = itemBranchRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        if (condition.item) {
            condition.item.active = true;
        }
        else {
            condition.item = {
                active: true,
            };
        }
        const [results, total] = await Promise.all([
            this.itemBranchRepo.find({
                where: Object.assign({}, condition),
                skip,
                take,
                order,
                relations: {
                    item: {
                        itemCategory: true
                    },
                    branch: true
                }
            }),
            this.itemBranchRepo.count({
                where: Object.assign({}, condition),
            }),
        ]);
        return {
            results,
            total,
        };
    }
};
InventoryMasterlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ItemBranch_1.ItemBranch)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InventoryMasterlistService);
exports.InventoryMasterlistService = InventoryMasterlistService;
//# sourceMappingURL=inventory-masterlist.service.js.map