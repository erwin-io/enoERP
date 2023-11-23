import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryRequestRate } from 'src/app/model/inventory-request-rate';

@Component({
  selector: 'app-inventory-request-rate-form',
  templateUrl: './inventory-request-rate-form.component.html',
  styleUrls: ['./inventory-request-rate-form.component.scss']
})
export class InventoryRequestRateFormComponent {
  form: FormGroup;
  @Input() isReadOnly: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      rate: ['',
      [
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
      ]],
      rateName: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      minQuantity: ['',[
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
      ]],
      maxQuantity: ['',[
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
      ]]
    });

    this.form.controls["minQuantity"].valueChanges.subscribe(value=> {
      if(!value || value === "") {
        this.form.controls["minQuantity"].setErrors({ required: true});
      } else {
        if(value && this.getFormData.maxQuantity !== "" && Number(value) > Number(this.getFormData.maxQuantity)) {
          this.form.controls["minQuantity"].setErrors({ exceed: true})
        } else {
          this.form.controls["minQuantity"].setErrors(null)
        }
      }
    })

    this.form.controls["maxQuantity"].valueChanges.subscribe(value=> {
      if(!value || value === "") {
        this.form.controls["maxQuantity"].setErrors({ required: true})
      } else {
        if(value && this.getFormData.minQuantity !== "" && Number(value) < Number(this.getFormData.minQuantity)) {
          this.form.controls["maxQuantity"].setErrors({ below: true})
        } else {
          this.form.controls["maxQuantity"].setErrors(null);
        }
      }
    })
  }

  public setFormValue(value: InventoryRequestRate) {
    if(this.form) {
      this.form.controls["rate"].setValue(value.rate);
      this.form.controls["rateName"].setValue(value.rateName);
      this.form.controls["minQuantity"].setValue(value.minQuantity);
      this.form.controls["maxQuantity"].setValue(value.maxQuantity);
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
