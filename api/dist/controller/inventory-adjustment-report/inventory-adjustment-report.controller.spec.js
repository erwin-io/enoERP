"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const inventory_adjustment_report_controller_1 = require("./inventory-adjustment-report.controller");
describe("InventoryAdjustmentReportController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [inventory_adjustment_report_controller_1.InventoryAdjustmentReportController],
        }).compile();
        controller = module.get(inventory_adjustment_report_controller_1.InventoryAdjustmentReportController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=inventory-adjustment-report.controller.spec.js.map