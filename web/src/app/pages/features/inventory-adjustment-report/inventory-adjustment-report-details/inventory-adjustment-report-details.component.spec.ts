import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdjustmentReportDetailsComponent } from './inventory-adjustment-report-details.component';

describe('InventoryAdjustmentReportDetailsComponent', () => {
  let component: InventoryAdjustmentReportDetailsComponent;
  let fixture: ComponentFixture<InventoryAdjustmentReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryAdjustmentReportDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryAdjustmentReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
