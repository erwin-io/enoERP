"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const inventory_request_rate_service_1 = require("./inventory-request-rate.service");
describe("InventoryRequestRateService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [inventory_request_rate_service_1.InventoryRequestRateService],
        }).compile();
        service = module.get(inventory_request_rate_service_1.InventoryRequestRateService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=inventory-request-rate.service.spec.js.map