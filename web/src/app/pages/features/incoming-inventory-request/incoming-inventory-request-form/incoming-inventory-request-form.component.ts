import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { InventoryRequest, InventoryRequestItem } from 'src/app/model/inventory-request';
import { IncomingInventoryRequestTableColumn, InventoryRequestItemTableColumn } from 'src/app/shared/utility/table';

@Component({
  selector: 'app-incoming-inventory-request-form',
  templateUrl: './incoming-inventory-request-form.component.html',
  styleUrls: ['./incoming-inventory-request-form.component.scss']
})
export class IncomingInventoryRequestFormComponent {

  form: FormGroup;
  @Input() isReadOnly: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      description: [null,Validators.required],
      branch: [null,Validators.required],
      dateRequested: [null,Validators.required],
      requestedByUser: [null,Validators.required],
      inventoryRequestItems: [[null], Validators.required],
    });
  }

  public setFormValue(value: InventoryRequest) {
    if(this.form) {
      this.form.controls["description"].setValue(value.description);
      this.form.controls["branch"].setValue(value.branch.name);
      this.form.controls["dateRequested"].setValue(moment(value.dateRequested).format("MMMM DD, YYYY h:mm a"));
      this.form.controls["requestedByUser"].setValue(value.requestedByUser.fullName);
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

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
