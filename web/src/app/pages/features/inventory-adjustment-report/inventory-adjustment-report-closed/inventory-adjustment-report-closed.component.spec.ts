import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdjustmentReportClosedComponent } from './inventory-adjustment-report-closed.component';

describe('InventoryAdjustmentReportClosedComponent', () => {
  let component: InventoryAdjustmentReportClosedComponent;
  let fixture: ComponentFixture<InventoryAdjustmentReportClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryAdjustmentReportClosedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryAdjustmentReportClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
