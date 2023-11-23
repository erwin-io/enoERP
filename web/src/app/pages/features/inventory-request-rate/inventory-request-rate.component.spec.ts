import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestRateComponent } from './inventory-request-rate.component';

describe('InventoryRequestRateComponent', () => {
  let component: InventoryRequestRateComponent;
  let fixture: ComponentFixture<InventoryRequestRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryRequestRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryRequestRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
