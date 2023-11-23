import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryRequest, InventoryRequestItem } from 'src/app/model/inventory-request';
import { IncomingInventoryRequestTableColumn, InventoryRequestItemTableColumn } from 'src/app/shared/utility/table';

@Component({
  selector: 'app-inventory-request-form',
  templateUrl: './inventory-request-form.component.html',
  styleUrls: ['./inventory-request-form.component.scss']
})
export class InventoryRequestFormComponent {

  form: FormGroup;
  @Input() isReadOnly: any;
  @Input() warehouseCode: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      description: [[null],Validators.required],
      inventoryRequestItems: [[null], Validators.required],
    });
  }

  public setFormValue(value: InventoryRequest) {
    if(this.form) {
      this.form.controls["description"].setValue(value.description);
      const items = value.inventoryRequestItems.map(x=> {
        return {
          quantity: x.quantity,
          itemId: x.item.itemId,
          itemCode: x.item.itemCode,
          itemName: x.item.itemDescription,
          itemDescription: x.item.itemId,
          itemCategory: x.item.itemCategory.name,
        } as InventoryRequestItemTableColumn
      })
      this.form.controls["inventoryRequestItems"].setValue(items);
    }
  }

  public get getFormData() {
    return this.form.value;
  }

  public get inventoryRequestItemsData() {
    if(this.form.controls["inventoryRequestItems"].value &&
    (this.form.controls["inventoryRequestItems"].value as InventoryRequestItemTableColumn[]).length > 0 &&
    (this.form.controls["inventoryRequestItems"].value as InventoryRequestItemTableColumn[]).every(x=>x && x.itemId && x.quantity)) {
      return (this.form.controls["inventoryRequestItems"].value as InventoryRequestItemTableColumn[]);
    } else {
      return null;
    }
  }

  public get valid() {
    return this.form.valid && this.inventoryRequestItemsData;
  }

  public get ready() {
    return this.form.valid && this.form.dirty && (this.form.controls["inventoryRequestItems"].value??[] as InventoryRequestItemTableColumn[]).length > 0;
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
