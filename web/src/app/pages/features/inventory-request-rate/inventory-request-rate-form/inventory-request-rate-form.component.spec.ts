import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestRateFormComponent } from './inventory-request-rate-form.component';

describe('InventoryRequestRateFormComponent', () => {
  let component: InventoryRequestRateFormComponent;
  let fixture: ComponentFixture<InventoryRequestRateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryRequestRateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryRequestRateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
