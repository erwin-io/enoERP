"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const inventory_request_service_1 = require("./inventory-request.service");
describe("InventoryRequestService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [inventory_request_service_1.InventoryRequestService],
        }).compile();
        service = module.get(inventory_request_service_1.InventoryRequestService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=inventory-request.service.spec%20copy.js.map