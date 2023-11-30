import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SalesInvoice, SalesInvoiceItem } from 'src/app/model/sales-invoice';
import { SalesInvoiceItemTableColumn } from 'src/app/shared/utility/table';

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
    });
  }

  public setFormValue(value: SalesInvoice, items: SalesInvoiceItemTableColumn[]) {
    if(this.form) {
      this.form.controls["salesDate"].setValue(value?.salesDate ? moment(value?.salesDate).format("MMM DD, YYYY H:MM A") : "");
      this.form.controls["createdByUser"].setValue(value.createdByUser.fullName);
      this.form.controls["salesInvoiceItems"].setValue(items);
    }
  }

  ngAfterViewInit(): void {
    this.form.controls["salesDate"].setValue(this.salesDate ? moment(this.salesDate).format("MMM DD, YYYY") : "");
    this.form.controls["createdByUser"].setValue(this.createdByUser);
  }

  public get getFormData() {
    return this.form.value;
  }

  public get salesInvoiceItemsData() {
    if(this.form.controls["salesInvoiceItems"].value &&
    (this.form.controls["salesInvoiceItems"].value as SalesInvoiceItemTableColumn[]).length > 0 &&
    (this.form.controls["salesInvoiceItems"].value as SalesInvoiceItemTableColumn[]).every(x=>x && x.itemId && x.quantity && Number(x.quantity) > 0)) {
      return (this.form.controls["salesInvoiceItems"].value as SalesInvoiceItemTableColumn[]);
    } else {
      return null;
    }
  }

  public get valid() {
    return this.form.valid && this.salesInvoiceItemsData;
  }

  public get ready() {
    return this.form.valid && this.form.dirty && this.salesInvoiceItemsData && this.salesInvoiceItemsData.length > 0;
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
