"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const item_category_controller_1 = require("./item-category.controller");
describe("ItemCategoryController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [item_category_controller_1.ItemCategoryController],
        }).compile();
        controller = module.get(item_category_controller_1.ItemCategoryController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=item-category.controller.spec.js.map