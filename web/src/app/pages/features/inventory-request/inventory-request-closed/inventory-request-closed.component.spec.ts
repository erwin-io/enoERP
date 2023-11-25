import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestClosedComponent } from './inventory-request-closed.component';

describe('InventoryRequestClosedComponent', () => {
  let component: InventoryRequestClosedComponent;
  let fixture: ComponentFixture<InventoryRequestClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryRequestClosedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryRequestClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
