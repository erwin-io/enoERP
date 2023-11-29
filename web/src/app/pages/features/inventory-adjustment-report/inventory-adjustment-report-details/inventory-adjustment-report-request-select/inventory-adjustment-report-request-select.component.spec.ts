import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdjustmentReportRequestSelectComponent } from './inventory-adjustment-report-request-select.component';

describe('InventoryAdjustmentReportRequestSelectComponent', () => {
  let component: InventoryAdjustmentReportRequestSelectComponent;
  let fixture: ComponentFixture<InventoryAdjustmentReportRequestSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryAdjustmentReportRequestSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryAdjustmentReportRequestSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
