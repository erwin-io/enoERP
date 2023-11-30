import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesInvoiceItemComponent } from './sales-invoice-items.component';

describe('SalesInvoiceItemComponent', () => {
  let component: SalesInvoiceItemComponent;
  let fixture: ComponentFixture<SalesInvoiceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesInvoiceItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesInvoiceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
