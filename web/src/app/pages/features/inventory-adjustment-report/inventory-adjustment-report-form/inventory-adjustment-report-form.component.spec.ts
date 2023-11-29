import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAdjustmentReportFormComponent } from './inventory-adjustment-report-form.component';

describe('InventoryAdjustmentReportFormComponent', () => {
  let component: InventoryAdjustmentReportFormComponent;
  let fixture: ComponentFixture<InventoryAdjustmentReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryAdjustmentReportFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryAdjustmentReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
