"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const goods_issue_service_1 = require("./goods-issue.service");
describe('GoodsIssueService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [goods_issue_service_1.GoodsIssueService],
        }).compile();
        service = module.get(goods_issue_service_1.GoodsIssueService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=goods-issue.service.spec.js.map