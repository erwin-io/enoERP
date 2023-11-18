import { TestBed } from '@angular/core/testing';

import { InventoryMasterlistService } from './inventory-masterlist.service';

describe('InventoryMasterlistService', () => {
  let service: InventoryMasterlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryMasterlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
