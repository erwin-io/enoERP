import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Warehouse } from 'src/app/model/warehouse';

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss']
})
export class WarehouseFormComponent {

  form: FormGroup;
  @Input() isReadOnly: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      warehouseCode: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      name: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
    });
  }

  public setFormValue(value: Warehouse) {
    if(this.form) {
      this.form.controls["warehouseCode"].setValue(value.warehouseCode);
      this.form.controls["name"].setValue(value.name);
    }
  }

  public get getFormData() {
    return this.form.value;
  }

  public get valid() {
    return this.form.valid;
  }

  public get ready() {
    return this.form.valid && this.form.dirty;
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
