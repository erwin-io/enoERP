import { ItemCategoryService } from 'src/app/services/item-category.service';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Item } from 'src/app/model/item';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent {
  form: FormGroup;
  @Input() isReadOnly: any;
  itemCategorySearchCtrl = new FormControl()
  isOptionsItemCategoryLoading = false;
  optionsItemCategory: { name: string; id: string}[] = [];
  @ViewChild('itemCategorySearchInput', { static: true}) itemCategorySearchInput: ElementRef<HTMLInputElement>;
  item!: Item;
  constructor(
    private formBuilder: FormBuilder,
    private itemCategoryService: ItemCategoryService
  ) {
    this.form = this.formBuilder.group({
      itemCode: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      itemName: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      itemDescription: ['',Validators.required],
      price: ['',
      [
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
      ],],
      itemCategoryId: ['',Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initItemCategoryOptions();
    this.itemCategorySearchCtrl.valueChanges
    .pipe(
        debounceTime(2000),
        distinctUntilChanged()
    )
    .subscribe(async value => {
        //your API call
        await this.initItemCategoryOptions();
    });
  }

  async init(detais: Item) {
    this.item = detais;
    if(this.form) {
      this.form.controls["itemCode"].setValue(detais.itemCode);
      this.form.controls["itemName"].setValue(detais.itemName);
      this.form.controls["itemDescription"].setValue(detais.itemDescription);
      this.form.controls["price"].setValue(detais.price);
      this.form.controls["itemCategoryId"].setValue(detais.itemCategory?.itemCategoryId);
      this.itemCategorySearchCtrl.setValue(detais.itemCategory?.itemCategoryId);
    }
  }

  async initItemCategoryOptions() {
    this.isOptionsItemCategoryLoading = true;
    const res = await this.itemCategoryService.getByAdvanceSearch({
      order: {},
      columnDef: [{
        apiNotation: "name",
        filter: this.itemCategorySearchInput.nativeElement.value
      }],
      pageIndex: 0,
      pageSize: 10
    }).toPromise();
    this.optionsItemCategory = res.data.results.map(a=> { return { name: a.name, id: a.itemCategoryId }});
    this.mapSearchItemCategory();
    this.isOptionsItemCategoryLoading = false;
  }

  mapSearchItemCategory() {
    if(this.form.controls['itemCategoryId'] !== this.itemCategorySearchCtrl.value){
      this.form.controls['itemCategoryId'].setErrors({ required: true});
      const selected = this.optionsItemCategory.find(x=>x.id === this.itemCategorySearchCtrl.value);
      if(selected) {
        this.form.controls["itemCategoryId"].setValue(selected.id);
        this.form.controls['itemCategoryId'].markAsDirty();
        this.form.controls['itemCategoryId'].markAsTouched();
      } else {
        this.form.controls["itemCategoryId"].setValue(null);
      }
      if(!this.form.controls["itemCategoryId"].value) {
        this.form.controls["itemCategoryId"].setErrors({required: true});
      } else {
        this.form.controls['itemCategoryId'].setErrors(null);
        this.form.controls['itemCategoryId'].markAsPristine();
      }
    }
    this.itemCategorySearchCtrl.setErrors(this.form.controls["itemCategoryId"].errors);
  }

  public get getFormData() {
    return this.form.value;
  }

  public get valid() {
    return this.form.valid && this.itemCategorySearchCtrl.valid;
  }

  public get ready() {
    return (this.form.valid && this.form.dirty) || (this.itemCategorySearchCtrl.valid && this.itemCategorySearchCtrl.dirty);
  }

  getError(key: string) {
    if(key === "itemCode") {
      if(/\s/.test(this.form.controls[key].value)) {
        this.form.controls[key].setErrors({ whitespace: true})
      }
    }
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }

  displayFn(value?: number) {
    return value ? this.optionsItemCategory.find(_ => _.id === value?.toString())?.name : undefined;
  }
}
