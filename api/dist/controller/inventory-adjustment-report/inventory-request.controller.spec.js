"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const inventory_request_controller_1 = require("./inventory-request.controller");
describe("InventoryRequestController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [inventory_request_controller_1.InventoryRequestController],
        }).compile();
        controller = module.get(inventory_request_controller_1.InventoryRequestController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=inventory-request.controller.spec.js.map