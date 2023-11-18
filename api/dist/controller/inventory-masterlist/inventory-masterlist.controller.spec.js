"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const inventory_masterlist_controller_1 = require("./inventory-masterlist.controller");
describe("InventoryMasterlistController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [inventory_masterlist_controller_1.InventoryMasterlistController],
        }).compile();
        controller = module.get(inventory_masterlist_controller_1.InventoryMasterlistController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=inventory-masterlist.controller.spec.js.map