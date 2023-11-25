import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestItemComponent } from './goods-receipt-items.component';

describe('InventoryRequestItemComponent', () => {
  let component: InventoryRequestItemComponent;
  let fixture: ComponentFixture<InventoryRequestItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryRequestItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryRequestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
