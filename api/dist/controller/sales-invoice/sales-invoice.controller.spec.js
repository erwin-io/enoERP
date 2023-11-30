"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sales_invoice_controller_1 = require("./sales-invoice.controller");
describe("SalesInvoiceController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [sales_invoice_controller_1.SalesInvoiceController],
        }).compile();
        controller = module.get(sales_invoice_controller_1.SalesInvoiceController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=sales-invoice.controller.spec.js.map