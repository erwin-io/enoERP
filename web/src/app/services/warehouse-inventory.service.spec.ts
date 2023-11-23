import { TestBed } from '@angular/core/testing';

import { WarehouseInventoryService } from './warehouse-inventory.service';

describe('WarehouseInventoryService', () => {
  let service: WarehouseInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
