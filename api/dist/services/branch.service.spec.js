"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const branch_service_1 = require("./branch.service");
describe('BranchService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [branch_service_1.BranchService],
        }).compile();
        service = module.get(branch_service_1.BranchService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=branch.service.spec.js.map