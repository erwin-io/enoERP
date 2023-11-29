import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdjustmentReportItemComponent } from './inventory-adjustment-report-items.component';

describe('InventoryAdjustmentReportItemComponent', () => {
  let component: InventoryAdjustmentReportItemComponent;
  let fixture: ComponentFixture<InventoryAdjustmentReportItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryAdjustmentReportItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryAdjustmentReportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
