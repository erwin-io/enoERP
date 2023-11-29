import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryAdjustmentReport, InventoryAdjustmentReportItem } from 'src/app/model/inventory-adjustment-report';
import { InventoryAdjustmentReportItemTableColumn } from 'src/app/shared/utility/table';

@Component({
  selector: 'app-inventory-adjustment-report-form',
  templateUrl: './inventory-adjustment-report-form.component.html',
  styleUrls: ['./inventory-adjustment-report-form.component.scss']
})
export class InventoryAdjustmentReportFormComponent {

  form: FormGroup;
  @Input() isReadOnly: any;
  @Input() warehouseCode: any;
  items: InventoryAdjustmentReportItemTableColumn[];
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      description: [null,Validators.required],
      inventoryAdjustmentReportItems: [null, Validators.required],
    });
  }

  public setFormValue(value: InventoryAdjustmentReport, items: InventoryAdjustmentReportItemTableColumn[]) {
    this.items = items;
    if(this.form) {
      this.form.controls["description"].setValue(value?.description ? value?.description : "");
      this.form.controls["inventoryAdjustmentReportItems"].setValue(items);
    }
  }

  public get getFormData() {
    return {
      description: this.form.controls["description"].value,
      inventoryAdjustmentReportItems: this.inventoryAdjustmentReportItemsData,
    };
  }

  public get inventoryAdjustmentReportItemsData() {
    if(this.form.controls["inventoryAdjustmentReportItems"].value &&
    (this.form.controls["inventoryAdjustmentReportItems"].value as InventoryAdjustmentReportItemTableColumn[]).length > 0) {
      return (this.form.controls["inventoryAdjustmentReportItems"].value as InventoryAdjustmentReportItemTableColumn[]).filter(x=>x && x.itemId && Number(x.returnedQuantity) > 0).map(x=> {
        return {
          returnedQuantity: x.returnedQuantity,
          itemId: x.itemId,
          itemCode: x.itemCode,
        }
      });
    } else {
      return null;
    }
  }

  public get valid() {
    return this.form.valid && this.inventoryAdjustmentReportItemsData && this.inventoryAdjustmentReportItemsData.length > 0
    && (this.form.controls["inventoryAdjustmentReportItems"].value as InventoryAdjustmentReportItemTableColumn[]).some(x=>x.isReturnedQuantityChanged)
    && (this.form.controls["inventoryAdjustmentReportItems"].value as InventoryAdjustmentReportItemTableColumn[]).every(x=>!x.isEditMode);
  }

  public get ready() {
    return this.form.valid &&
    this.form.dirty && this.inventoryAdjustmentReportItemsData && this.inventoryAdjustmentReportItemsData.length > 0
    && (this.form.controls["inventoryAdjustmentReportItems"].value as InventoryAdjustmentReportItemTableColumn[]).some(x=>x.isReturnedQuantityChanged)
    && (this.form.controls["inventoryAdjustmentReportItems"].value as InventoryAdjustmentReportItemTableColumn[]).every(x=>!x.isEditMode);
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
