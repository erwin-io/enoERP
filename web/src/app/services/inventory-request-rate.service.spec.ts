import { TestBed } from '@angular/core/testing';

import { InventoryRequestRateService } from './inventory-request-rate.service';

describe('InventoryRequestRateService', () => {
  let service: InventoryRequestRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryRequestRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
