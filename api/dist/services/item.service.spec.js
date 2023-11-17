"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const item_service_1 = require("./item.service");
describe('ItemService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [item_service_1.ItemService],
        }).compile();
        service = module.get(item_service_1.ItemService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=item.service.spec.js.map