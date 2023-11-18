import { Component, ElementRef, Input, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InventoryRequest, InventoryRequestItem } from 'src/app/model/inventory-request';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { ItemService } from 'src/app/services/item.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { InventoryRequestItemTableColumn } from 'src/app/shared/utility/table';

@Component({
  selector: 'app-inventory-request-items',
  templateUrl: './inventory-request-items.component.html',
  styleUrls: ['./inventory-request-items.component.scss']
})
export class InventoryRequestItemComponent {
  id;
  isProcessing = false;
  isNew = false;
  displayedColumns = ['itemName', 'quantity', 'controls'];
  dataSource = new MatTableDataSource<InventoryRequestItemTableColumn>();
  @Input() inventoryRequest!: InventoryRequest;
  @Input() isReadOnly = true;
  @ViewChild('inventoryRequestItemFormDialog') inventoryRequestItemFormDialogTemp: TemplateRef<any>;

  matcher = new MyErrorStateMatcher();
  itemId = new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]);
  quantity = new FormControl("",[
    Validators.minLength(1),
    Validators.max(1000),
    Validators.pattern('^[0-9]*$'),
    Validators.required,
  ]);
  triggerLoadTimeOut;
  isOptionsItemNameLoading = false;
  optionItems: {id: string; name: string}[] = [];
  itemNameSearchCtrl = new FormControl();
  itemNameSearchInput: string = "";

  currentSelected: InventoryRequestItemTableColumn;

  error;

  @Output() itemsChanged = new EventEmitter()
  constructor(
    private inventoryRequestService: InventoryRequestService,
    private itemService: ItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,) {
  }


  get f() {
    return {
      itemId: this.itemId,
      quantity: this.quantity,
    }
  }

  get form() {
    return {
      valid: this.itemId.valid && this.quantity.valid,
      dirty: this.itemId.dirty || this.quantity.dirty,
      value: {
        itemId: this.itemId.value,
        quantity: this.quantity.value
      },
      validate: ()=> {
        this.itemId.updateValueAndValidity();
        this.quantity.updateValueAndValidity();
      }
    }
  }


  ngAfterViewInit() {
    this.itemNameSearchCtrl.valueChanges
    .pipe(
        debounceTime(2000),
        distinctUntilChanged()
    )
    .subscribe(async value => {
      this.isOptionsItemNameLoading = false;
      await this.initItemNameOptions();
    });
    this.itemId.valueChanges
    .subscribe(async value => {
      if(this.dataSource.data.some(x=>x.itemId === this.itemId.value) && this.currentSelected?.itemId !== this.itemId.value) {
        this.snackBar.open("Item already exist in table!", 'close', {
          panelClass: ['style-error'],
        });
        this.itemId.setErrors({ exist: true});
        this.itemId.markAsDirty();
      }
    });
  }

  init(data: InventoryRequestItemTableColumn[]) {
    if(data) {
      this.dataSource = new MatTableDataSource(data);
    }
  }

  async initItemNameOptions() {
    if(!this.isOptionsItemNameLoading) {
      this.isOptionsItemNameLoading = true;
      const res = await this.itemService.getByAdvanceSearch({
        order: {},
        columnDef: [{
          apiNotation: "itemName",
          filter: this.itemNameSearchInput??""
        }],
        pageIndex: 0,
        pageSize: 10
      }).toPromise();
      this.optionItems = res.data.results.map(a=> { return { name: a.itemName, id: a.itemId }});
      this.mapSearchItem();
      this.isOptionsItemNameLoading = false;
    }
  }

  displayItemName(value?: number) {
    return value ? this.optionItems.find(_ => _.id === value?.toString())?.name : undefined;
  }

  mapSearchItem() {
    if(this.f['itemId'].value !== this.itemNameSearchInput) {
      this.f['itemId'].setErrors({ required: true});
      const selected = this.optionItems.find(x=>x.id === this.itemNameSearchInput);
      if(selected) {
        this.f["itemId"].setValue(selected.id);
      } else {
        this.f["itemId"].setValue(null);
      }
      if(!this.f["itemId"].value) {
        this.f["itemId"].setErrors({required: true});
      } else {
        this.f['itemId'].setErrors(null);
        this.f['itemId'].markAsPristine();
      }
    }
    this.itemNameSearchCtrl.setErrors(this.f["itemId"].errors);
  }

  async onShowNewItem() {
    this.currentSelected = null;
    this.itemId.reset();
    this.quantity.reset();
    this.itemNameSearchInput = null;
    this.itemNameSearchCtrl.reset();
    this.itemNameSearchCtrl.enable();
    this.isNew = true;
    const dialogRef = this.dialog.open(this.inventoryRequestItemFormDialogTemp, {
      disableClose: true,
      panelClass: 'inventory-request-items'
    });
    dialogRef.afterOpened().subscribe(async res=> {
      await this.initItemNameOptions();
    });
    dialogRef.afterClosed().subscribe(async res=> {
    });
  }

  async editInventoryRequestItem(data: InventoryRequestItemTableColumn) {
    this.currentSelected = data;
    this.itemId.setValue(this.currentSelected.itemId);
    this.itemNameSearchCtrl.setValue(this.currentSelected.itemId);
    this.itemNameSearchInput = this.currentSelected.itemId;
    this.quantity.setValue(this.currentSelected.quantity);
    this.itemNameSearchCtrl.disable();
    await this.initItemNameOptions();
    this.isNew = false;;
    const dialogRef = this.dialog.open(this.inventoryRequestItemFormDialogTemp, {
      disableClose: true,
      panelClass: 'inventory-request-items'
    });
    dialogRef.afterClosed().subscribe(async res=> {
    });
    this.itemId.markAsPristine();
    this.itemNameSearchCtrl.markAsPristine();
    this.quantity.markAsPristine();
  }

  deleteInventoryRequestItem(selected: InventoryRequestItemTableColumn) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Remove item?';
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
      color: 'primary',
    };
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel',
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
    });
    dialogRef.componentInstance.alertDialogConfig = dialogData;
    dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {
    dialogRef.close();
      try {
        const items = this.dataSource.data.filter(x=>x.itemId !== selected.itemId);
        this.dataSource = new MatTableDataSource(items);
        this.snackBar.open('Item removed!', 'close', {
          panelClass: ['style-success'],
        });
        this.itemsChanged.emit(this.dataSource.data);
        this.dialog.closeAll();
      } catch (e) {
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }

  onSubmit() {
    this.form.validate();
    if(!this.form.valid) {
      return;
    }
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = this.isNew ? "New item?" : "Update item?";
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
      color: 'primary',
    };
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel',
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
    });
    dialogRef.componentInstance.alertDialogConfig = dialogData;
    dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {
      try {
        dialogRef.close();
        const { data } = await this.itemService.getById(this.itemId.value).toPromise();
        if(data) {
          if(this.dataSource.data.some(x=>x.itemId === this.itemId.value) && this.currentSelected?.itemId !== this.itemId.value) {
            this.snackBar.open("Item already exist in table!", 'close', {
              panelClass: ['style-error'],
            });
            this.itemId.setErrors({ exist: true});
            this.itemId.markAsDirty();
          } else {
            this.dataSource.data
            const items = this.dataSource.data;
            if(items.some(x=>x.itemId === this.itemId.value)) {
              items.find(x=>x.itemId === this.itemId.value).quantity = this.quantity.value;
            } else {
              items.push({
                itemId: data.itemId,
                itemCode: data.itemCode,
                itemName: data.itemName,
                itemDescription: data.itemDescription,
                itemCategory: data.itemCategory.name,
                quantity: this.quantity.value,
              });
            }
            this.dataSource = new MatTableDataSource(items);
            this.itemsChanged.emit(this.dataSource.data);
            this.dialog.closeAll();
          }
        } else {
          this.snackBar.open("Item not available!", 'close', {
            panelClass: ['style-error'],
          });
          this.itemId.setErrors({ notavailable: true});
          this.itemId.markAsDirty();
        }
      } catch (e) {
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }

  getError(key: string) {
    return this.f && this.f[key] ? this.f[key].errors : null;
  }

}
