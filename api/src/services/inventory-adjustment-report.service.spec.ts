import { Test, TestingModule } from '@nestjs/testing';
import { InventoryAdjustmentReportService } from './inventory-adjustment-report.service';

describe('InventoryAdjustmentReportService', () => {
  let service: InventoryAdjustmentReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryAdjustmentReportService],
    }).compile();

    service = module.get<InventoryAdjustmentReportService>(InventoryAdjustmentReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
