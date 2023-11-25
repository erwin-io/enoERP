import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier } from 'src/app/model/supplier';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent {

  form: FormGroup;
  @Input() isReadOnly: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      name: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
    });
  }

  public setFormValue(value: Supplier) {
    if(this.form) {
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
