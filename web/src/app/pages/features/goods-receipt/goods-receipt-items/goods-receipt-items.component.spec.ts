import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiptItemComponent } from './goods-receipt-items.component';

describe('GoodsReceiptItemComponent', () => {
  let component: GoodsReceiptItemComponent;
  let fixture: ComponentFixture<GoodsReceiptItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsReceiptItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsReceiptItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
