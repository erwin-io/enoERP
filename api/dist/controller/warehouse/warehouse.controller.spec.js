"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const warehouse_controller_1 = require("./warehouse.controller");
describe("WarehouseController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [warehouse_controller_1.WarehouseController],
        }).compile();
        controller = module.get(warehouse_controller_1.WarehouseController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=warehouse.controller.spec.js.map