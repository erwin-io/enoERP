import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiptDetailsComponent } from './goods-receipt-details.component';

describe('GoodsReceiptDetailsComponent', () => {
  let component: GoodsReceiptDetailsComponent;
  let fixture: ComponentFixture<GoodsReceiptDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsReceiptDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsReceiptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
