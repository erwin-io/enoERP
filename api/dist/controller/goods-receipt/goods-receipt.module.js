"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoodsReceiptModule = void 0;
const common_1 = require("@nestjs/common");
const goods_receipt_controller_1 = require("./goods-receipt.controller");
const GoodsReceipt_1 = require("../../db/entities/GoodsReceipt");
const goods_receipt_service_1 = require("../../services/goods-receipt.service");
const typeorm_1 = require("@nestjs/typeorm");
const pusher_service_1 = require("../../services/pusher.service");
let GoodsReceiptModule = class GoodsReceiptModule {
};
GoodsReceiptModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([GoodsReceipt_1.GoodsReceipt])],
        controllers: [goods_receipt_controller_1.GoodsReceiptController],
        providers: [goods_receipt_service_1.GoodsReceiptService, pusher_service_1.PusherService],
        exports: [goods_receipt_service_1.GoodsReceiptService, pusher_service_1.PusherService],
    })
], GoodsReceiptModule);
exports.GoodsReceiptModule = GoodsReceiptModule;
//# sourceMappingURL=goods-receipt.module.js.map