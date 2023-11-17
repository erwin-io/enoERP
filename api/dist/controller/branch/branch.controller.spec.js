"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const branch_controller_1 = require("./branch.controller");
describe("BranchController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [branch_controller_1.BranchController],
        }).compile();
        controller = module.get(branch_controller_1.BranchController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=branch.controller.spec.js.map