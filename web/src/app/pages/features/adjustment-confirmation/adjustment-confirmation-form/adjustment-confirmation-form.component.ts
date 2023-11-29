import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryAdjustmentReport, InventoryAdjustmentReportItem } from 'src/app/model/inventory-adjustment-report';
import { AdjustmentConfirmationItemTableColumn } from 'src/app/shared/utility/table';

@Component({
  selector: 'app-adjustment-confirmation-form',
  templateUrl: './adjustment-confirmation-form.component.html',
  styleUrls: ['./adjustment-confirmation-form.component.scss']
})
export class AdjustmentConfirmationFormComponent {

  form: FormGroup;
  @Input() warehouseCode: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      description: [null,Validators.required],
      adjustmentConfirmationItems: [null, Validators.required],
    });
  }

  public setFormValue(value: InventoryAdjustmentReport, items: AdjustmentConfirmationItemTableColumn[]) {
    if(this.form) {
      this.form.controls["description"].setValue(value?.description ? value?.description : "");
      this.form.controls["adjustmentConfirmationItems"].setValue(items);
      this.form.disable();
    }
    this.form.disable();
  }

  public get getFormData() {
    console.log(this.adjustmentConfirmationItemsData)
    return {
      description: this.form.controls["description"].value,
      adjustmentConfirmationItems: this.adjustmentConfirmationItemsData,
    };
  }

  public get adjustmentConfirmationItemsData() {
    if(this.form.controls["adjustmentConfirmationItems"].value &&
    (this.form.controls["adjustmentConfirmationItems"].value as AdjustmentConfirmationItemTableColumn[]).length > 0){
      return (this.form.controls["adjustmentConfirmationItems"].value as AdjustmentConfirmationItemTableColumn[]).filter(x=>x && x.itemId && x.proposedUnitReturnRate && Number(x.proposedUnitReturnRate) > 0 && !x.isInvalidProposedUnitReturnRate && x.isProposedUnitReturnRateChanged && !x.isEditMode).map(x=> {
        return {
          proposedUnitReturnRate: x.proposedUnitReturnRate,
          itemId: x.itemId,
          itemCode: x.itemCode,
        }
      });
    } else {
      return null;
    }
  }

  public get valid() {
    return this.form.valid && this.adjustmentConfirmationItemsData && this.adjustmentConfirmationItemsData.length > 0;
  }

  public get ready() {
    return this.form.valid &&
    this.form.dirty &&this.adjustmentConfirmationItemsData && this.adjustmentConfirmationItemsData.length > 0;
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
