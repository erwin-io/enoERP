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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmConfigService = void 0;
const SalesInvoiceItem_1 = require("./../entities/SalesInvoiceItem");
const InventoryRequestItem_1 = require("./../entities/InventoryRequestItem");
const InventoryRequest_1 = require("./../entities/InventoryRequest");
const Users_1 = require("../entities/Users");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const Access_1 = require("../entities/Access");
const ItemCategory_1 = require("../entities/ItemCategory");
const Item_1 = require("../entities/Item");
const Warehouse_1 = require("../entities/Warehouse");
const ItemWarehouse_1 = require("../entities/ItemWarehouse");
const Branch_1 = require("../entities/Branch");
const ItemBranch_1 = require("../entities/ItemBranch");
const InventoryRequestRate_1 = require("../entities/InventoryRequestRate");
const GoodsIssue_1 = require("../entities/GoodsIssue");
const GoodsIssueItem_1 = require("../entities/GoodsIssueItem");
const GoodsReceipt_1 = require("../entities/GoodsReceipt");
const GoodsReceiptItem_1 = require("../entities/GoodsReceiptItem");
const Supplier_1 = require("../entities/Supplier");
const InventoryAdjustmentReport_1 = require("../entities/InventoryAdjustmentReport");
const InventoryAdjustmentReportItem_1 = require("../entities/InventoryAdjustmentReportItem");
const SalesInvoice_1 = require("../entities/SalesInvoice");
const SalesInvoicePayments_1 = require("../entities/SalesInvoicePayments");
let TypeOrmConfigService = class TypeOrmConfigService {
    createTypeOrmOptions() {
        const ssl = this.config.get("SSL");
        const config = {
            type: "postgres",
            host: this.config.get("DATABASE_HOST"),
            port: Number(this.config.get("DATABASE_PORT")),
            database: this.config.get("DATABASE_NAME"),
            username: this.config.get("DATABASE_USER"),
            password: this.config.get("DATABASE_PASSWORD"),
            entities: [
                Users_1.Users,
                Access_1.Access,
                ItemCategory_1.ItemCategory,
                Item_1.Item,
                Warehouse_1.Warehouse,
                ItemWarehouse_1.ItemWarehouse,
                Branch_1.Branch,
                ItemBranch_1.ItemBranch,
                InventoryRequest_1.InventoryRequest,
                InventoryRequestItem_1.InventoryRequestItem,
                InventoryRequestRate_1.InventoryRequestRate,
                GoodsIssue_1.GoodsIssue,
                GoodsIssueItem_1.GoodsIssueItem,
                GoodsReceipt_1.GoodsReceipt,
                GoodsReceiptItem_1.GoodsReceiptItem,
                Supplier_1.Supplier,
                InventoryAdjustmentReport_1.InventoryAdjustmentReport,
                InventoryAdjustmentReportItem_1.InventoryAdjustmentReportItem,
                SalesInvoice_1.SalesInvoice,
                SalesInvoiceItem_1.SalesInvoiceItem,
                SalesInvoicePayments_1.SalesInvoicePayments,
            ],
            synchronize: false,
            ssl: ssl.toLocaleLowerCase().includes("true"),
            extra: {},
        };
        if (config.ssl) {
            config.extra.ssl = {
                require: true,
                rejectUnauthorized: false,
            };
        }
        return config;
    }
};
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], TypeOrmConfigService.prototype, "config", void 0);
TypeOrmConfigService = __decorate([
    (0, common_1.Injectable)()
], TypeOrmConfigService);
exports.TypeOrmConfigService = TypeOrmConfigService;
//# sourceMappingURL=typeorm.service.js.map