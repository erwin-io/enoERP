import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoodsReceipt, GoodsReceiptItem } from 'src/app/model/goods-receipt';
import { GoodsReceiptItemTableColumn } from 'src/app/shared/utility/table';

@Component({
  selector: 'app-goods-receipt-form',
  templateUrl: './goods-receipt-form.component.html',
  styleUrls: ['./goods-receipt-form.component.scss']
})
export class GoodsReceiptFormComponent {

  form: FormGroup;
  @Input() isReadOnly: any;
  @Input() warehouseCode: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      description: [null,Validators.required],
      goodsReceiptItems: [[null], Validators.required],
    });
  }

  public setFormValue(value: GoodsReceipt, items: GoodsReceiptItemTableColumn[]) {
    if(this.form) {
      this.form.controls["description"].setValue(value?.description ? value?.description : "");
      this.form.controls["goodsReceiptItems"].setValue(items);
    }
  }

  public get getFormData() {
    return this.form.value;
  }

  public get goodsReceiptItemsData() {
    if(this.form.controls["goodsReceiptItems"].value &&
    (this.form.controls["goodsReceiptItems"].value as GoodsReceiptItemTableColumn[]).length > 0 &&
    (this.form.controls["goodsReceiptItems"].value as GoodsReceiptItemTableColumn[]).every(x=>x && x.itemId && x.quantity)) {
      return (this.form.controls["goodsReceiptItems"].value as GoodsReceiptItemTableColumn[]);
    } else {
      return null;
    }
  }

  public get valid() {
    return this.form.valid && this.goodsReceiptItemsData;
  }

  public get ready() {
    return this.form.valid && this.form.dirty && (this.form.controls["goodsReceiptItems"].value??[] as GoodsReceiptItemTableColumn[]).length > 0;
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
