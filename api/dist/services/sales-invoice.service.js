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
exports.SalesInvoiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const goods_issue_constant_1 = require("../common/constant/goods-issue.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const utils_1 = require("../common/utils/utils");
const Item_1 = require("../db/entities/Item");
const ItemBranch_1 = require("../db/entities/ItemBranch");
const SalesInvoice_1 = require("../db/entities/SalesInvoice");
const SalesInvoiceItem_1 = require("../db/entities/SalesInvoiceItem");
const Users_1 = require("../db/entities/Users");
const Branch_1 = require("../db/entities/Branch");
const typeorm_2 = require("typeorm");
const branch_constant_1 = require("../common/constant/branch.constant");
const deafaultSalesInvoiceSelect = {
    salesInvoiceId: true,
    salesInvoiceCode: true,
    salesDate: true,
    isVoid: true,
    dateLastUpdated: true,
    totalAmount: true,
    createdByUser: {
        userId: true,
        userName: true,
        fullName: true,
        userCode: true,
        branch: {
            branchId: true,
            branchCode: true,
            name: true,
        },
    },
    branch: {
        branchId: true,
        branchCode: true,
        name: true,
    },
    salesInvoiceItems: {
        salesInvoiceId: true,
        itemId: true,
        item: {
            itemId: true,
            itemCode: true,
            itemName: true,
            itemDescription: true,
            itemCategory: {
                itemCategoryId: true,
                name: true,
                description: true,
            },
        },
        unitPrice: true,
        quantity: true,
        amount: true,
        salesInvoice: true,
    },
};
let SalesInvoiceService = class SalesInvoiceService {
    constructor(salesInvoiceRepo) {
        this.salesInvoiceRepo = salesInvoiceRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.salesInvoiceRepo.find({
                select: deafaultSalesInvoiceSelect,
                where: condition,
                skip,
                take,
                order,
                relations: {
                    branch: true,
                    createdByUser: {
                        branch: true,
                    },
                    salesInvoiceItems: {
                        item: {
                            itemCategory: true,
                        },
                    },
                },
            }),
            this.salesInvoiceRepo.count({
                where: condition,
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByCode(salesInvoiceCode) {
        const result = await this.salesInvoiceRepo.findOne({
            where: {
                salesInvoiceCode,
            },
            relations: {
                createdByUser: true,
                branch: true,
                salesInvoiceItems: {
                    item: {
                        itemCategory: true,
                    },
                    salesInvoice: true,
                },
            },
        });
        if (!result) {
            throw Error(goods_issue_constant_1.GOODSISSUE_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.salesInvoiceRepo.manager.transaction(async (entityManager) => {
            let salesInvoice = new SalesInvoice_1.SalesInvoice();
            const createdByUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userId: dto.createdByUserId,
                    active: true,
                },
            });
            if (!createdByUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            salesInvoice.createdByUser = createdByUser;
            const branch = await entityManager.findOne(Branch_1.Branch, {
                where: {
                    branchId: dto.branchId,
                    active: true,
                },
            });
            if (!branch) {
                throw Error(branch_constant_1.BRANCH_ERROR_NOT_FOUND);
            }
            salesInvoice.branch = branch;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            salesInvoice.salesDate = timestamp;
            salesInvoice = await entityManager.save(SalesInvoice_1.SalesInvoice, salesInvoice);
            salesInvoice.salesInvoiceCode = (0, utils_1.generateIndentityCode)(salesInvoice.salesInvoiceId);
            dto.salesInvoiceItems = dto.salesInvoiceItems.reduce((acc, cur) => {
                const item = acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
                if (item) {
                    item.quantity = Number(item.quantity) + Number(cur.quantity);
                }
                else
                    acc.push({
                        itemId: cur.itemId,
                        quantity: cur.quantity ? Number(cur.quantity) : 0,
                        unitPrice: cur.unitPrice && cur.unitPrice !== ""
                            ? Number(cur.unitPrice)
                            : 0,
                    });
                return acc;
            }, []);
            for (const item of dto.salesInvoiceItems) {
                let newItem = new SalesInvoiceItem_1.SalesInvoiceItem();
                newItem.item = await entityManager.findOne(Item_1.Item, {
                    where: { itemId: item.itemId },
                });
                if (item.quantity <= 0) {
                    throw Error("Quantity must not be less than or zero!");
                }
                if (item.unitPrice <= 0) {
                    throw Error("Unit price must not be less than or zero!");
                }
                newItem.quantity = item.quantity.toString();
                newItem.unitPrice = item.unitPrice.toString();
                const amount = item.quantity * item.unitPrice;
                newItem.amount = amount.toString();
                newItem.salesInvoice = salesInvoice;
                newItem = await entityManager.save(SalesInvoiceItem_1.SalesInvoiceItem, newItem);
                let itemBranch = await entityManager.findOne(ItemBranch_1.ItemBranch, {
                    where: {
                        itemId: item.itemId,
                        branch: {
                            branchId: salesInvoice.branch.branchId,
                        },
                    },
                });
                const newQuantity = Number(itemBranch.quantity) - Number(item.quantity);
                if (Number(item.quantity) > Number(itemBranch.quantity)) {
                    throw Error("Goods issue quantity exceeds current item branch quantity");
                }
                itemBranch.quantity = newQuantity.toString();
                itemBranch = await entityManager.save(ItemBranch_1.ItemBranch, itemBranch);
            }
            salesInvoice.salesInvoiceItems = await entityManager.find(SalesInvoiceItem_1.SalesInvoiceItem, {
                where: {
                    salesInvoice: {
                        salesInvoiceId: salesInvoice.salesInvoiceId,
                    },
                },
            });
            const totalAmount = salesInvoice.salesInvoiceItems
                .map((x) => Number(x.amount))
                .reduce(function (curr, prev) {
                return curr + prev;
            });
            salesInvoice.totalAmount = totalAmount.toString();
            salesInvoice = await entityManager.save(SalesInvoice_1.SalesInvoice, salesInvoice);
            salesInvoice = await entityManager.findOne(SalesInvoice_1.SalesInvoice, {
                where: {
                    salesInvoiceId: salesInvoice.salesInvoiceId,
                },
                relations: {
                    createdByUser: {
                        branch: true,
                    },
                    branch: true,
                    salesInvoiceItems: {
                        item: {
                            itemCategory: true,
                        },
                    },
                },
            });
            delete salesInvoice.createdByUser.password;
            return salesInvoice;
        });
    }
    async void(salesInvoiceCode) {
        return await this.salesInvoiceRepo.manager.transaction(async (entityManager) => {
            let salesInvoice = await entityManager.findOne(SalesInvoice_1.SalesInvoice, {
                select: deafaultSalesInvoiceSelect,
                where: {
                    salesInvoiceCode,
                    isVoid: false,
                },
                relations: {
                    branch: true,
                    createdByUser: true,
                    salesInvoiceItems: {
                        salesInvoice: true,
                        item: {
                            itemCategory: true,
                        },
                    },
                },
            });
            if (!salesInvoice) {
                throw Error(goods_issue_constant_1.GOODSISSUE_ERROR_NOT_FOUND);
            }
            for (const item of salesInvoice.salesInvoiceItems) {
                let itemBranch = await entityManager.findOne(ItemBranch_1.ItemBranch, {
                    where: {
                        itemId: item.item.itemId,
                        branch: {
                            branchId: salesInvoice.branch.branchId,
                        },
                    },
                });
                const newQuantity = Number(itemBranch.quantity) + Number(item.quantity);
                itemBranch.quantity = newQuantity.toString();
                itemBranch = await entityManager.save(ItemBranch_1.ItemBranch, itemBranch);
            }
            delete salesInvoice.salesInvoiceItems;
            salesInvoice.isVoid = true;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            salesInvoice.dateLastUpdated = timestamp;
            salesInvoice = await entityManager.save(SalesInvoice_1.SalesInvoice, salesInvoice);
            salesInvoice = await entityManager.findOne(SalesInvoice_1.SalesInvoice, {
                where: {
                    salesInvoiceId: salesInvoice.salesInvoiceId,
                },
                relations: {
                    createdByUser: {
                        branch: true,
                    },
                    branch: true,
                    salesInvoiceItems: {
                        item: {
                            itemCategory: true,
                        },
                    },
                },
            });
            delete salesInvoice.createdByUser.password;
            return salesInvoice;
        });
    }
};
SalesInvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(SalesInvoice_1.SalesInvoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SalesInvoiceService);
exports.SalesInvoiceService = SalesInvoiceService;
//# sourceMappingURL=sales-invoice.service.js.map