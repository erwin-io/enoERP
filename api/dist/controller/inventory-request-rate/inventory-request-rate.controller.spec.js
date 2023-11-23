"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const inventory_request_rate_controller_1 = require("./inventory-request-rate.controller");
describe("InventoryRequestRateController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [inventory_request_rate_controller_1.InventoryRequestRateController],
        }).compile();
        controller = module.get(inventory_request_rate_controller_1.InventoryRequestRateController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=inventory-request-rate.controller.spec.js.map