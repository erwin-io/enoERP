import { TestBed } from '@angular/core/testing';

import { GoodsIssueService } from './goods-issue.service';

describe('GoodsIssueService', () => {
  let service: GoodsIssueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsIssueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
