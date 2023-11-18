import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestDetailsComponent } from './inventory-request-details.component';

describe('InventoryRequestDetailsComponent', () => {
  let component: InventoryRequestDetailsComponent;
  let fixture: ComponentFixture<InventoryRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
