import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestRateSelectComponent } from './inventory-request-rate-select.component';

describe('InventoryRequestRateSelectComponent', () => {
  let component: InventoryRequestRateSelectComponent;
  let fixture: ComponentFixture<InventoryRequestRateSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryRequestRateSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryRequestRateSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
