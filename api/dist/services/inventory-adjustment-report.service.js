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
exports.InventoryAdjustmentReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const branch_constant_1 = require("../common/constant/branch.constant");
const inventory_adjustment_report_constant_1 = require("../common/constant/inventory-adjustment-report.constant");
const inventory_request_constant_1 = require("../common/constant/inventory-request.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const utils_1 = require("../common/utils/utils");
const Branch_1 = require("../db/entities/Branch");
const InventoryAdjustmentReport_1 = require("../db/entities/InventoryAdjustmentReport");
const InventoryAdjustmentReportItem_1 = require("../db/entities/InventoryAdjustmentReportItem");
const InventoryRequest_1 = require("../db/entities/InventoryRequest");
const InventoryRequestItem_1 = require("../db/entities/InventoryRequestItem");
const Item_1 = require("../db/entities/Item");
const ItemBranch_1 = require("../db/entities/ItemBranch");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
const deafaultInventoryAdjustmentReportSelect = {
    inventoryAdjustmentReportId: true,
    inventoryAdjustmentReportCode: true,
    reportType: true,
    description: true,
    dateReported: true,
    dateLastUpdated: true,
    reportStatus: true,
    notes: true,
    reportedByUser: {
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
    inventoryAdjustmentReportItems: {
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
        returnedQuantity: true,
        proposedUnitReturnRate: true,
        totalRefund: true,
        inventoryAdjustmentReport: {
            inventoryAdjustmentReportId: true,
            inventoryAdjustmentReportCode: true,
        },
        inventoryAdjustmentReportId: true,
    },
};
let InventoryAdjustmentReportService = class InventoryAdjustmentReportService {
    constructor(inventoryAdjustmentReportRepo) {
        this.inventoryAdjustmentReportRepo = inventoryAdjustmentReportRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.inventoryAdjustmentReportRepo.find({
                select: deafaultInventoryAdjustmentReportSelect,
                where: Object.assign(Object.assign({}, condition), { active: true }),
                skip,
                take,
                order,
                relations: {
                    reportedByUser: {
                        branch: true,
                    },
                    branch: true,
                    inventoryAdjustmentReportItems: {
                        item: {
                            itemCategory: true,
                        },
                    },
                },
            }),
            this.inventoryAdjustmentReportRepo.count({
                where: Object.assign(Object.assign({}, condition), { active: true }),
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async getByCode(inventoryAdjustmentReportCode) {
        const result = await this.inventoryAdjustmentReportRepo.findOne({
            select: deafaultInventoryAdjustmentReportSelect,
            where: {
                inventoryAdjustmentReportCode,
                active: true,
            },
            relations: {
                reportedByUser: {
                    branch: true,
                },
                branch: true,
                inventoryAdjustmentReportItems: {
                    item: {
                        itemCategory: true,
                    },
                },
            },
        });
        if (!result) {
            throw Error(inventory_adjustment_report_constant_1.INVENTORYADJUSTMENTREPORT_ERROR_NOT_FOUND);
        }
        return result;
    }
    async create(dto) {
        return await this.inventoryAdjustmentReportRepo.manager.transaction(async (entityManager) => {
            let inventoryAdjustmentReport = new InventoryAdjustmentReport_1.InventoryAdjustmentReport();
            const inventoryRequest = await entityManager.findOne(InventoryRequest_1.InventoryRequest, {
                where: {
                    inventoryRequestCode: dto.inventoryRequestCode,
                    active: true,
                },
                relations: {
                    branch: true,
                    inventoryRequestItems: {
                        item: {
                            itemCategory: true,
                        },
                    },
                    fromWarehouse: true,
                },
            });
            if (!inventoryRequest) {
                throw Error(inventory_request_constant_1.INVENTORYREQUEST_ERROR_NOT_FOUND);
            }
            if (inventoryRequest.requestStatus !== "COMPLETED") {
                throw Error(inventory_request_constant_1.INVENTORYREQUEST_ERROR_ADJUSTMENT_NOT_ALLOWED_);
            }
            inventoryAdjustmentReport.inventoryRequest = inventoryRequest;
            const reportedByUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userId: dto.reportedByUserId,
                    active: true,
                },
            });
            if (!reportedByUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            inventoryAdjustmentReport.reportedByUser = reportedByUser;
            const branch = await entityManager.findOne(Branch_1.Branch, {
                where: {
                    branchId: inventoryRequest.branch.branchId,
                    active: true,
                },
            });
            if (!branch) {
                throw Error(branch_constant_1.BRANCH_ERROR_NOT_FOUND);
            }
            inventoryAdjustmentReport.branch = branch;
            inventoryAdjustmentReport.description = dto.description;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            inventoryAdjustmentReport.dateReported = timestamp;
            inventoryAdjustmentReport.reportType = dto.reportType;
            inventoryAdjustmentReport = await entityManager.save(InventoryAdjustmentReport_1.InventoryAdjustmentReport, inventoryAdjustmentReport);
            inventoryAdjustmentReport.inventoryAdjustmentReportCode =
                (0, utils_1.generateIndentityCode)(inventoryAdjustmentReport.inventoryAdjustmentReportId);
            dto.inventoryAdjustmentReportItems =
                dto.inventoryAdjustmentReportItems.reduce((acc, cur) => {
                    const item = acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
                    if (item) {
                        item.quantity =
                            Number(item.quantity) + Number(cur.returnedQuantity);
                    }
                    else
                        acc.push({
                            itemId: cur.itemId,
                            returnedQuantity: cur.returnedQuantity,
                        });
                    return acc;
                }, []);
            for (const item of dto.inventoryAdjustmentReportItems) {
                let newItem = new InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem();
                newItem.item = await entityManager.findOne(Item_1.Item, {
                    where: { itemId: item.itemId },
                });
                newItem.inventoryAdjustmentReport = inventoryAdjustmentReport;
                newItem.returnedQuantity = item.returnedQuantity.toString();
                newItem = await entityManager.save(InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem, newItem);
                const inventoryRequestItem = await entityManager.findOne(InventoryRequestItem_1.InventoryRequestItem, {
                    where: {
                        item: {
                            itemId: item.itemId,
                        },
                        inventoryRequest: {
                            inventoryRequestCode: inventoryRequest.inventoryRequestCode,
                        },
                    },
                });
                if (!inventoryRequestItem) {
                    throw Error("Inventory request item not found");
                }
                if (Number(item.returnedQuantity) >
                    Number(inventoryRequestItem.quantity)) {
                    throw Error("Total returned quantity is more thant the total inventory requested item quantity");
                }
                const newQuantityReceived = Number(inventoryRequestItem.quantityReceived) -
                    Number(item.returnedQuantity);
                inventoryRequestItem.quantityReceived =
                    newQuantityReceived >= 0 ? newQuantityReceived.toString() : "0";
                await entityManager.save(InventoryRequestItem_1.InventoryRequestItem, inventoryRequestItem);
                const itemBranch = await entityManager.findOne(ItemBranch_1.ItemBranch, {
                    where: {
                        item: {
                            itemId: item.itemId,
                        },
                        branch: {
                            branchId: inventoryRequest.branch.branchId,
                        },
                    },
                });
                const newItemBrancQuantity = Number(itemBranch.quantity) - item.returnedQuantity;
                itemBranch.quantity =
                    newItemBrancQuantity >= 0 ? newItemBrancQuantity.toString() : "0";
                await entityManager.save(ItemBranch_1.ItemBranch, itemBranch);
            }
            inventoryAdjustmentReport = await entityManager.save(InventoryAdjustmentReport_1.InventoryAdjustmentReport, inventoryAdjustmentReport);
            inventoryAdjustmentReport = await entityManager.findOne(InventoryAdjustmentReport_1.InventoryAdjustmentReport, {
                select: deafaultInventoryAdjustmentReportSelect,
                where: {
                    inventoryAdjustmentReportId: inventoryAdjustmentReport.inventoryAdjustmentReportId,
                },
                relations: {
                    reportedByUser: {
                        branch: true,
                    },
                    branch: true,
                    inventoryAdjustmentReportItems: {
                        item: {
                            itemCategory: true,
                        },
                    },
                },
            });
            return inventoryAdjustmentReport;
        });
    }
    async update(inventoryAdjustmentReportCode, dto) {
        return await this.inventoryAdjustmentReportRepo.manager.transaction(async (entityManager) => {
            let inventoryAdjustmentReport = await entityManager.findOne(InventoryAdjustmentReport_1.InventoryAdjustmentReport, {
                where: {
                    inventoryAdjustmentReportCode,
                    active: true,
                },
                relations: {
                    reportedByUser: {
                        branch: true,
                    },
                    branch: true,
                    inventoryRequest: {
                        inventoryRequestItems: {
                            item: {
                                itemCategory: true,
                            },
                        },
                        fromWarehouse: true,
                        requestedByUser: true,
                        branch: true,
                    },
                },
            });
            if (!inventoryAdjustmentReport) {
                throw Error(inventory_adjustment_report_constant_1.INVENTORYADJUSTMENTREPORT_ERROR_NOT_FOUND);
            }
            if (inventoryAdjustmentReport.reportStatus !== "PENDING") {
                throw Error("Not allowed to update request, the request was already being - processed");
            }
            inventoryAdjustmentReport.description = dto.description;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            inventoryAdjustmentReport.dateLastUpdated = timestamp;
            dto.inventoryAdjustmentReportItems =
                dto.inventoryAdjustmentReportItems.reduce((acc, cur) => {
                    const item = acc.length > 0 && acc.find(({ itemId }) => itemId === cur.itemId);
                    if (item) {
                        item.quantity =
                            Number(item.quantity) + Number(cur.returnedQuantity);
                    }
                    else
                        acc.push({
                            itemId: cur.itemId,
                            returnedQuantity: cur.returnedQuantity,
                        });
                    return acc;
                }, []);
            let originalAdjustmentReportItems = await entityManager.find(InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem, {
                where: {
                    inventoryAdjustmentReport: {
                        inventoryAdjustmentReportId: inventoryAdjustmentReport.inventoryAdjustmentReportId,
                    },
                },
                relations: {
                    inventoryAdjustmentReport: {
                        inventoryRequest: true,
                    },
                    item: {
                        itemCategory: true,
                    },
                },
            });
            originalAdjustmentReportItems = originalAdjustmentReportItems.filter((x) => !dto.inventoryAdjustmentReportItems.some((i) => i.itemId === x.item.itemId));
            for (const item of originalAdjustmentReportItems) {
                const itemBranch = await entityManager.findOne(ItemBranch_1.ItemBranch, {
                    where: {
                        itemId: item.itemId,
                        branch: {
                            branchId: inventoryAdjustmentReport.branch.branchId,
                        },
                    },
                });
                const newItemBranchQuantity = Number(itemBranch.quantity) + Number(item.returnedQuantity);
                itemBranch.quantity =
                    newItemBranchQuantity >= 0 ? newItemBranchQuantity.toString() : "0";
                await entityManager.save(ItemBranch_1.ItemBranch, itemBranch);
            }
            if (originalAdjustmentReportItems.length > 0) {
                await entityManager.delete(InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem, originalAdjustmentReportItems);
            }
            for (const item of dto.inventoryAdjustmentReportItems) {
                let isNew = false;
                if (isNaN(item.returnedQuantity) || item.returnedQuantity <= 0) {
                    throw Error("Invalid returned quantity");
                }
                let inventoryAdjustmentReportItem = await entityManager.findOne(InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem, {
                    where: {
                        itemId: item.itemId,
                        inventoryAdjustmentReportId: inventoryAdjustmentReport.inventoryAdjustmentReportId,
                    },
                    relations: {
                        inventoryAdjustmentReport: true,
                    },
                });
                if (!inventoryAdjustmentReportItem) {
                    isNew = true;
                    inventoryAdjustmentReportItem = new InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem();
                    inventoryAdjustmentReportItem.item = await entityManager.findOne(Item_1.Item, {
                        where: { itemId: item.itemId },
                    });
                    inventoryAdjustmentReportItem.returnedQuantity =
                        item.returnedQuantity.toString();
                }
                inventoryAdjustmentReportItem.inventoryAdjustmentReport =
                    inventoryAdjustmentReport;
                inventoryAdjustmentReportItem.inventoryAdjustmentReport =
                    inventoryAdjustmentReport;
                const origReturnedQuantity = inventoryAdjustmentReportItem.returnedQuantity;
                inventoryAdjustmentReportItem.returnedQuantity =
                    item.returnedQuantity.toString();
                inventoryAdjustmentReportItem = await entityManager.save(InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem, inventoryAdjustmentReportItem);
                const itemBranch = await entityManager.findOne(ItemBranch_1.ItemBranch, {
                    where: {
                        itemId: item.itemId,
                        branch: { branchId: inventoryAdjustmentReport.branch.branchId },
                    },
                });
                if (isNew) {
                    const newItemBranchQuantity = Number(itemBranch.quantity) -
                        Number(inventoryAdjustmentReportItem.returnedQuantity);
                    itemBranch.quantity =
                        newItemBranchQuantity >= 9
                            ? newItemBranchQuantity.toString()
                            : "0";
                }
                else {
                    const oldItemBrancQuantity = Number(itemBranch.quantity) + Number(origReturnedQuantity);
                    const newItemBrancQuantity = oldItemBrancQuantity - Number(item.returnedQuantity);
                    itemBranch.quantity =
                        newItemBrancQuantity >= 0 ? newItemBrancQuantity.toString() : "0";
                }
                await entityManager.save(ItemBranch_1.ItemBranch, itemBranch);
                const inventoryRequestItem = await entityManager.findOne(InventoryRequestItem_1.InventoryRequestItem, {
                    where: {
                        item: {
                            itemId: item.itemId,
                        },
                        inventoryRequest: {
                            inventoryRequestCode: inventoryAdjustmentReport.inventoryRequest
                                .inventoryRequestCode,
                        },
                    },
                });
                if (!inventoryRequestItem) {
                    throw Error("Inventory request item not found");
                }
                const oldQuantityReceived = Number(inventoryRequestItem.quantityReceived) +
                    Number(origReturnedQuantity);
                const newQuantityReceived = oldQuantityReceived - Number(item.returnedQuantity);
                if (newQuantityReceived > Number(inventoryRequestItem.quantity)) {
                    throw Error("Total received quantity is more thant the total inventory requested item quantity");
                }
                if (newQuantityReceived < 0) {
                    throw Error("Total received quantity results to negative");
                }
                inventoryRequestItem.quantityReceived =
                    newQuantityReceived.toString();
                await entityManager.save(InventoryRequestItem_1.InventoryRequestItem, inventoryRequestItem);
            }
            inventoryAdjustmentReport = await entityManager.save(InventoryAdjustmentReport_1.InventoryAdjustmentReport, inventoryAdjustmentReport);
            inventoryAdjustmentReport = await entityManager.findOne(InventoryAdjustmentReport_1.InventoryAdjustmentReport, {
                select: deafaultInventoryAdjustmentReportSelect,
                where: {
                    inventoryAdjustmentReportId: inventoryAdjustmentReport.inventoryAdjustmentReportId,
                },
                relations: {
                    reportedByUser: {
                        branch: true,
                    },
                    branch: true,
                    inventoryAdjustmentReportItems: {
                        item: {
                            itemCategory: true,
                        },
                    },
                },
            });
            return inventoryAdjustmentReport;
        });
    }
    async updateStatus(inventoryAdjustmentReportCode, dto) {
        return await this.inventoryAdjustmentReportRepo.manager.transaction(async (entityManager) => {
            const { status } = dto;
            let inventoryAdjustmentReport = await entityManager.findOne(InventoryAdjustmentReport_1.InventoryAdjustmentReport, {
                where: {
                    inventoryAdjustmentReportCode,
                    active: true,
                },
                relations: {
                    branch: true,
                    reportedByUser: true,
                    inventoryAdjustmentReportItems: {
                        inventoryAdjustmentReport: true,
                        item: {
                            itemCategory: true,
                        },
                    },
                    inventoryRequest: {
                        inventoryRequestItems: {
                            item: {
                                itemCategory: true,
                            },
                        },
                    },
                },
            });
            if (!inventoryAdjustmentReport) {
                throw Error(inventory_adjustment_report_constant_1.INVENTORYADJUSTMENTREPORT_ERROR_NOT_FOUND);
            }
            if (inventoryAdjustmentReport.reportStatus === "CLOSED" ||
                inventoryAdjustmentReport.reportStatus === "CANCELLED" ||
                inventoryAdjustmentReport.reportStatus === "REJECTED") {
                throw Error("Not allowed to update status, the request was already - " +
                    inventoryAdjustmentReport.reportStatus.toLowerCase());
            }
            if (inventoryAdjustmentReport.reportStatus === "COMPLETED") {
                if (["PENDING", "REJECTED", "REVIEWED", "CANCELLED", "REVIEWED"].some((x) => x.toUpperCase() === status.toUpperCase())) {
                    throw Error("Not allowed to update status, the request was already - " +
                        inventoryAdjustmentReport.reportStatus.toLowerCase());
                }
            }
            if (inventoryAdjustmentReport.reportStatus === "REVIEWED") {
                if (["PENDING"].some((x) => x.toUpperCase() === status.toUpperCase())) {
                    throw Error("Not allowed to update status, the request was already - " +
                        inventoryAdjustmentReport.reportStatus.toLowerCase());
                }
            }
            if (inventoryAdjustmentReport.reportStatus === "REJECTED") {
                throw Error("Not allowed to update status, the request was already being - " +
                    inventoryAdjustmentReport.reportStatus.toLowerCase());
            }
            if (inventoryAdjustmentReport.reportStatus === "PENDING") {
                if (status === "PENDING") {
                    throw Error("Not allowed to update status, the request was already - " +
                        inventoryAdjustmentReport.reportStatus.toLowerCase());
                }
                if (["COMPLETED", "CLOSED"].some((x) => x.toUpperCase() === status.toUpperCase())) {
                    throw Error("Not allowed to update status, the request was not yet reviewed");
                }
            }
            if (status === "CANCELLED" || status === "REJECTED") {
                inventoryAdjustmentReport.inventoryAdjustmentReportItems =
                    await entityManager.find(InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem, {
                        where: {
                            inventoryAdjustmentReport: {
                                inventoryAdjustmentReportCode,
                                active: true,
                            },
                        },
                        relations: {
                            item: {
                                itemCategory: true,
                            },
                            inventoryAdjustmentReport: true,
                        },
                    });
                for (const item of inventoryAdjustmentReport.inventoryAdjustmentReportItems) {
                    const inventoryRequestItem = await entityManager.findOne(InventoryRequestItem_1.InventoryRequestItem, {
                        where: {
                            item: {
                                itemId: item.itemId,
                            },
                            inventoryRequest: {
                                inventoryRequestCode: inventoryAdjustmentReport.inventoryRequest
                                    .inventoryRequestCode,
                            },
                        },
                    });
                    if (!inventoryRequestItem) {
                        throw Error("Inventory request item not found");
                    }
                    const newQuantityReceived = Number(inventoryRequestItem.quantityReceived) +
                        Number(item.returnedQuantity);
                    inventoryRequestItem.quantityReceived =
                        newQuantityReceived.toString();
                    await entityManager.save(InventoryRequestItem_1.InventoryRequestItem, inventoryRequestItem);
                    const itemBranch = await entityManager.findOne(ItemBranch_1.ItemBranch, {
                        where: {
                            itemId: item.item.itemId,
                            branch: { branchId: inventoryAdjustmentReport.branch.branchId },
                        },
                    });
                    const newItemBranchQuantity = Number(itemBranch.quantity) + Number(item.returnedQuantity);
                    itemBranch.quantity =
                        newItemBranchQuantity >= 0
                            ? newItemBranchQuantity.toString()
                            : "0";
                    await entityManager.save(ItemBranch_1.ItemBranch, itemBranch);
                }
            }
            if (status === "CANCELLED" ||
                status === "REJECTED" ||
                status === "CLOSED") {
                inventoryAdjustmentReport.notes = dto["notes"];
            }
            if (status === "REVIEWED") {
                for (const item of dto.inventoryAdjustmentReportItems) {
                    const inventoryAdjustmentReportItem = await entityManager.findOne(InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem, {
                        where: {
                            item: {
                                itemId: item.itemId,
                            },
                            inventoryAdjustmentReport: {
                                inventoryAdjustmentReportCode,
                                active: true,
                            },
                        },
                        relations: {
                            item: {
                                itemCategory: true,
                            },
                            inventoryAdjustmentReport: true,
                        },
                    });
                    if (!inventoryAdjustmentReportItem) {
                        throw Error("Invalid item, item not found on inventory request items");
                    }
                    inventoryAdjustmentReportItem.proposedUnitReturnRate =
                        item.proposedUnitReturnRate.toString();
                    const totalRefund = Number(inventoryAdjustmentReportItem.proposedUnitReturnRate) *
                        Number(inventoryAdjustmentReportItem.returnedQuantity);
                    inventoryAdjustmentReportItem.totalRefund = totalRefund.toString();
                    await entityManager.save(InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem, inventoryAdjustmentReportItem);
                }
            }
            delete inventoryAdjustmentReport.inventoryAdjustmentReportItems;
            inventoryAdjustmentReport.reportStatus = status;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            inventoryAdjustmentReport.dateLastUpdated = timestamp;
            inventoryAdjustmentReport = await entityManager.save(InventoryAdjustmentReport_1.InventoryAdjustmentReport, inventoryAdjustmentReport);
            inventoryAdjustmentReport = await entityManager.findOne(InventoryAdjustmentReport_1.InventoryAdjustmentReport, {
                select: deafaultInventoryAdjustmentReportSelect,
                where: {
                    inventoryAdjustmentReportId: inventoryAdjustmentReport.inventoryAdjustmentReportId,
                },
                relations: {
                    reportedByUser: {
                        branch: true,
                    },
                    branch: true,
                    inventoryAdjustmentReportItems: {
                        item: {
                            itemCategory: true,
                        },
                    },
                },
            });
            return inventoryAdjustmentReport;
        });
    }
};
InventoryAdjustmentReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(InventoryAdjustmentReport_1.InventoryAdjustmentReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InventoryAdjustmentReportService);
exports.InventoryAdjustmentReportService = InventoryAdjustmentReportService;
//# sourceMappingURL=inventory-adjustment-report.service.js.map