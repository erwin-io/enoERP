"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const inventory_adjustment_report_service_1 = require("./inventory-adjustment-report.service");
describe('InventoryAdjustmentReportService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [inventory_adjustment_report_service_1.InventoryAdjustmentReportService],
        }).compile();
        service = module.get(inventory_adjustment_report_service_1.InventoryAdjustmentReportService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=inventory-adjustment-report.service.spec.js.map