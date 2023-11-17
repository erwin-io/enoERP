"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const item_controller_1 = require("./item.controller");
describe("ItemController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [item_controller_1.ItemController],
        }).compile();
        controller = module.get(item_controller_1.ItemController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=item.controller.spec.js.map