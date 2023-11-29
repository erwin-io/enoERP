import { Test, TestingModule } from '@nestjs/testing';
import { GoodsIssueService } from './goods-issue.service';

describe('GoodsIssueService', () => {
  let service: GoodsIssueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsIssueService],
    }).compile();

    service = module.get<GoodsIssueService>(GoodsIssueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
