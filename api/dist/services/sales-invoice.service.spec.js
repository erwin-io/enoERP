"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sales_invoice_service_1 = require("./sales-invoice.service");
describe('SalesInvoiceService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [sales_invoice_service_1.SalesInvoiceService],
        }).compile();
        service = module.get(sales_invoice_service_1.SalesInvoiceService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=sales-invoice.service.spec.js.map