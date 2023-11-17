"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const warehouse_service_1 = require("./warehouse.service");
describe('WarehouseService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [warehouse_service_1.WarehouseService],
        }).compile();
        service = module.get(warehouse_service_1.WarehouseService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=warehouse.service.spec.js.map