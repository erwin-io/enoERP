import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestRateDetailsComponent } from './inventory-request-rate-details.component';

describe('InventoryRequestRateDetailsComponent', () => {
  let component: InventoryRequestRateDetailsComponent;
  let fixture: ComponentFixture<InventoryRequestRateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryRequestRateDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryRequestRateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
