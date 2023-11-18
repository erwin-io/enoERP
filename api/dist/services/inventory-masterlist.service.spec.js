"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const inventory_masterlist_service_1 = require("./inventory-masterlist.service");
describe('InventoryMasterlistService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [inventory_masterlist_service_1.InventoryMasterlistService],
        }).compile();
        service = module.get(inventory_masterlist_service_1.InventoryMasterlistService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=inventory-masterlist.service.spec.js.map