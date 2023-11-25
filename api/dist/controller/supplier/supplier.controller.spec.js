"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supplier_controller_1 = require("./supplier.controller");
describe("SupplierController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [supplier_controller_1.SupplierController],
        }).compile();
        controller = module.get(supplier_controller_1.SupplierController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=supplier.controller.spec.js.map