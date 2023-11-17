"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const item_category_service_1 = require("./item-category.service");
describe('ItemCategoryService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [item_category_service_1.ItemCategoryService],
        }).compile();
        service = module.get(item_category_service_1.ItemCategoryService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=item-category.service.spec.js.map