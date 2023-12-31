import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SalesInvoice, SalesInvoiceItem } from 'src/app/model/sales-invoice';
import { SalesInvoiceItemTableColumn, SalesInvoicePaymentsTableColumn } from 'src/app/shared/utility/table';

@Component({
  selector: 'app-sales-invoice-form',
  templateUrl: './sales-invoice-form.component.html',
  styleUrls: ['./sales-invoice-form.component.scss']
})
export class SalesInvoiceFormComponent {

  form: FormGroup;
  @Input() isReadOnly: any;
  @Input() isNew: any;
  @Input() createdByUser: any;
  @Input() salesDate = new Date();
  @Input() branchCode: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      salesDate: [this.salesDate],
      createdByUser: [this.createdByUser],
      salesInvoiceItems: [[null], Validators.required],
      salesInvoicePayments: [[null], Validators.required],
    });
  }

  public setFormValue(value: SalesInvoice, items: SalesInvoiceItemTableColumn[], payments: SalesInvoicePaymentsTableColumn[]) {
    if(this.form) {
      this.form.controls["salesDate"].setValue(value?.salesDate ? moment(value?.salesDate).format("MMM DD, YYYY H:MM A") : "");
      this.form.controls["createdByUser"].setValue(value.createdByUser.fullName);
      this.form.controls["salesInvoiceItems"].setValue(items);
      this.form.controls["salesInvoicePayments"].setValue(payments);
    }
  }

  ngAfterViewInit(): void {
    this.form.controls["salesDate"].setValue(this.salesDate ? moment(this.salesDate).format("MMM DD, YYYY") : "");
    this.form.controls["createdByUser"].setValue(this.createdByUser);
  }

  public get getFormData() {
    return {
      salesInvoiceItems: this.salesInvoiceItemsData,
      salesInvoicePayments: this.salesInvoicePaymentsData,
    };
  }

  public get salesInvoiceItemsData() {
    if(this.form.controls["salesInvoiceItems"].value &&
    (this.form.controls["salesInvoiceItems"].value as SalesInvoiceItemTableColumn[]).length > 0 &&
    (this.form.controls["salesInvoiceItems"].value as SalesInvoiceItemTableColumn[]).every(x=>x && x.itemId && x.quantity && Number(x.quantity) > 0)) {
      return (this.form.controls["salesInvoiceItems"].value as SalesInvoiceItemTableColumn[]).map(x=> {
        return {
          itemId: x.itemId,
          quantity: x.quantity,
          unitPrice: x.unitPrice,
        }
      });
    } else {
      return null;
    }
  }

  public get salesInvoicePaymentsData() {
    if(this.form.controls["salesInvoicePayments"].value &&
    (this.form.controls["salesInvoicePayments"].value as SalesInvoicePaymentsTableColumn[]).length > 0 &&
    (this.form.controls["salesInvoicePayments"].value as SalesInvoicePaymentsTableColumn[]).every(x=>x && x.paymentType && Number(x.amount) > 0)) {
      return (this.form.controls["salesInvoicePayments"].value as SalesInvoicePaymentsTableColumn[]).map(x=> {
        return {
          paymentType: x.paymentType,
          amount: x.amount
        }
      });
    } else {
      return null;
    }
  }

  public get valid() {
    return this.form.valid && this.salesInvoiceItemsData && this.salesInvoicePaymentsData;
  }

  public get ready() {
    return this.form.valid && this.form.dirty && this.salesInvoiceItemsData && this.salesInvoiceItemsData.length > 0 && this.salesInvoicePaymentsData && this.salesInvoicePaymentsData.length > 0;
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
