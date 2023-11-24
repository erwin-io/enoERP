"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const goods_receipt_service_1 = require("./goods-receipt.service");
describe("GoodsReceiptService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [goods_receipt_service_1.GoodsReceiptService],
        }).compile();
        service = module.get(goods_receipt_service_1.GoodsReceiptService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=goods-receipt.service.spec.js.map