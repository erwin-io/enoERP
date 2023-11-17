import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Branch } from 'src/app/model/branch';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss']
})
export class BranchFormComponent {

  form: FormGroup;
  @Input() isReadOnly: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      branchCode: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      name: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      isMainBranch: [false],
    });
  }

  public setFormValue(value: Branch) {
    if(this.form) {
      this.form.controls["branchCode"].setValue(value.branchCode);
      this.form.controls["name"].setValue(value.name);
      this.form.controls["isMainBranch"].setValue(value.isMainBranch);
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
