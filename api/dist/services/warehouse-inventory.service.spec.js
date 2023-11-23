"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const warehouse_inventory_service_1 = require("./warehouse-inventory.service");
describe('WarehouseInventoryService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [warehouse_inventory_service_1.WarehouseInventoryService],
        }).compile();
        service = module.get(warehouse_inventory_service_1.WarehouseInventoryService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=warehouse-inventory.service.spec.js.map