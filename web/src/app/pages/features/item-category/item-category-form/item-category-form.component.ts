import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemCategory } from 'src/app/model/item-category';

@Component({
  selector: 'app-item-category-form',
  templateUrl: './item-category-form.component.html',
  styleUrls: ['./item-category-form.component.scss']
})
export class ItemCategoryFormComponent {

  form: FormGroup;
  @Input() isReadOnly: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      name: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      description: ['',Validators.required]
    });
  }

  public setFormValue(value: ItemCategory) {
    if(this.form) {
      this.form.controls["name"].setValue(value.name);
      this.form.controls["description"].setValue(value.description);
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
