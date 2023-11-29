import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoodsIssue, GoodsIssueItem } from 'src/app/model/goods-issue';
import { GoodsIssueItemTableColumn } from 'src/app/shared/utility/table';

@Component({
  selector: 'app-goods-issue-form',
  templateUrl: './goods-issue-form.component.html',
  styleUrls: ['./goods-issue-form.component.scss']
})
export class GoodsIssueFormComponent {

  form: FormGroup;
  @Input() isReadOnly: any;
  @Input() warehouseCode: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      description: [null,Validators.required],
      goodsIssueItems: [[null], Validators.required],
    });
  }

  public setFormValue(value: GoodsIssue, items: GoodsIssueItemTableColumn[]) {
    if(this.form) {
      this.form.controls["description"].setValue(value?.description ? value?.description : "");
      this.form.controls["goodsIssueItems"].setValue(items);
    }
  }

  public get getFormData() {
    return this.form.value;
  }

  public get goodsIssueItemsData() {
    if(this.form.controls["goodsIssueItems"].value &&
    (this.form.controls["goodsIssueItems"].value as GoodsIssueItemTableColumn[]).length > 0 &&
    (this.form.controls["goodsIssueItems"].value as GoodsIssueItemTableColumn[]).every(x=>x && x.itemId && x.quantity && Number(x.quantity) > 0)) {
      return (this.form.controls["goodsIssueItems"].value as GoodsIssueItemTableColumn[]);
    } else {
      return null;
    }
  }

  public get valid() {
    return this.form.valid && this.goodsIssueItemsData;
  }

  public get ready() {
    return this.form.valid && this.form.dirty && this.goodsIssueItemsData && this.goodsIssueItemsData.length > 0;
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
