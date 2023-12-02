import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesInvoicePaymentsComponent } from './sales-invoice-payments.component';

describe('SalesInvoicePaymentsComponent', () => {
  let component: SalesInvoicePaymentsComponent;
  let fixture: ComponentFixture<SalesInvoicePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesInvoicePaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesInvoicePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
