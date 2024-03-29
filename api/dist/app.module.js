"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_service_1 = require("./db/typeorm/typeorm.service");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./controller/auth/auth.module");
const Joi = __importStar(require("@hapi/joi"));
const utils_1 = require("./common/utils/utils");
const users_module_1 = require("./controller/users/users.module");
const access_module_1 = require("./controller/access/access.module");
const item_category_module_1 = require("./controller/item-category/item-category.module");
const item_module_1 = require("./controller/item/item.module");
const warehouse_module_1 = require("./controller/warehouse/warehouse.module");
const branch_module_1 = require("./controller/branch/branch.module");
const inventory_masterlist_module_1 = require("./controller/inventory-masterlist/inventory-masterlist.module");
const firebase_provider_module_1 = require("./core/provider/firebase/firebase-provider.module");
const inventory_request_module_1 = require("./controller/inventory-request/inventory-request.module");
const warehouse_inventory_module_1 = require("./controller/warehouse-inventory/warehouse-inventory.module");
const inventory_request_rate_module_1 = require("./controller/inventory-request-rate/inventory-request-rate.module");
const goods_receipt_module_1 = require("./controller/goods-receipt/goods-receipt.module");
const supplier_module_1 = require("./controller/supplier/supplier.module");
const inventory_adjustment_report_module_1 = require("./controller/inventory-adjustment-report/inventory-adjustment-report.module");
const goods_issue_module_1 = require("./controller/goods-issue/goods-issue.module");
const sales_invoice_module_1 = require("./controller/sales-invoice/sales-invoice.module");
const notifications_module_1 = require("./controller/notifications/notifications.module");
const envFilePath = (0, utils_1.getEnvPath)(`${__dirname}/common/envs`);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath,
                isGlobal: true,
                validationSchema: Joi.object({
                    UPLOADED_FILES_DESTINATION: Joi.string().required(),
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({ useClass: typeorm_service_1.TypeOrmConfigService }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            access_module_1.AccessModule,
            item_category_module_1.ItemCategoryModule,
            item_module_1.ItemModule,
            warehouse_module_1.WarehouseModule,
            branch_module_1.BranchModule,
            inventory_masterlist_module_1.InventoryMasterlistModule,
            inventory_request_module_1.InventoryRequestModule,
            warehouse_inventory_module_1.WarehouseInventoryModule,
            inventory_request_rate_module_1.InventoryRequestRateModule,
            goods_receipt_module_1.GoodsReceiptModule,
            goods_issue_module_1.GoodsIssueModule,
            supplier_module_1.SupplierModule,
            inventory_adjustment_report_module_1.InventoryAdjustmentReportModule,
            sales_invoice_module_1.SalesInvoiceModule,
            notifications_module_1.NotificationsModule,
            firebase_provider_module_1.FirebaseProviderModule,
        ],
        providers: [app_service_1.AppService],
        controllers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map