"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const warehouse_inventory_controller_1 = require("./warehouse-inventory.controller");
describe("WarehouseInventoryController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [warehouse_inventory_controller_1.WarehouseInventoryController],
        }).compile();
        controller = module.get(warehouse_inventory_controller_1.WarehouseInventoryController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=warehouse-inventory.controller.spec.js.map