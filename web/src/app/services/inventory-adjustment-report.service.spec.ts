import { TestBed } from '@angular/core/testing';

import { InventoryAdjustmentReportService } from './inventory-adjustment-report.service';

describe('InventoryAdjustmentReportService', () => {
  let service: InventoryAdjustmentReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryAdjustmentReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
