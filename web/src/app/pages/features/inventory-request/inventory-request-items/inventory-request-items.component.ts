import { Component, ElementRef, Input, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InventoryRequest, InventoryRequestItem } from 'src/app/model/inventory-request';
import { InventoryRequestRate } from 'src/app/model/inventory-request-rate';
import { Item } from 'src/app/model/item';
import { InventoryRequestRateService } from 'src/app/services/inventory-request-rate.service';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { ItemService } from 'src/app/services/item.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { SelectItemDialogComponent } from 'src/app/shared/select-item-dialog/select-item-dialog.component';
import { InventoryRequestItemTableColumn } from 'src/app/shared/utility/table';
import { InventoryRequestRateSelectComponent } from './inventory-request-rate-select/inventory-request-rate-select.component';
import { ItemWarehouse } from 'src/app/model/item-warehouse';
import { WarehouseInventoryService } from 'src/app/services/warehouse-inventory.service';
export class WarehouseInventory extends ItemWarehouse {
  availableToRequest: string;
}
@Component({
  selector: 'app-inventory-request-items',
  templateUrl: './inventory-request-items.component.html',
  styleUrls: ['./inventory-request-items.component.scss']
})
export class InventoryRequestItemComponent {
  @Input() warehouseCode;
  id;
  isProcessing = false;
  isNew = false;
  accTotalAmount = 0;
  displayedColumns = ['itemName', 'itemCategory', 'quantity', 'totalAmount', 'controls'];
  dataSource = new MatTableDataSource<InventoryRequestItemTableColumn>();
  @Input() inventoryRequest!: InventoryRequest;
  @Input() isReadOnly = true;
  @ViewChild('inventoryRequestItemFormDialog') inventoryRequestItemFormDialogTemp: TemplateRef<any>;

  matcher = new MyErrorStateMatcher();
  itemId = new FormControl("", [Validators.required]);
  quantity = new FormControl("",[
    Validators.minLength(1),
    Validators.max(1000),
    Validators.pattern('^[0-9]*$'),
    Validators.required,
  ]);
  inventoryRequestRateCode = new FormControl("", [Validators.required])

  currentSelected: InventoryRequestItemTableColumn = {
    itemId: "",
    itemCode: "",
    itemName: "",
    itemCategory: "",
    quantity: "",
    inventoryRequestRateCode: "",
    totalAmount: "0",
  } as any;

  currentRateSelected: InventoryRequestRate = {
    inventoryRequestRateId: "",
    inventoryRequestRateCode: "",
    rate: "",
    rateName: "",
    minQuantity: "",
    maxQuantity: "",
    baseRate: false
  } as any;

  currentWarehouseInventory: WarehouseInventory = {
    availableToRequest: "0"
  } as any;

  error;

  @Output() itemsChanged = new EventEmitter();
  constructor(
    private spinner: SpinnerVisibilityService,
    private inventoryRequestService: InventoryRequestService,
    private inventoryRequestRateService: InventoryRequestRateService,
    private warehouseInventoryService: WarehouseInventoryService,
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
      valid: this.itemId.valid && this.quantity.valid && this.inventoryRequestRateCode.valid,
      dirty: this.itemId.dirty || this.quantity.dirty || this.inventoryRequestRateCode.dirty,
      value: {
        itemId: this.itemId.value,
        quantity: this.quantity.value,
        inventoryRequestRateId: this.inventoryRequestRateCode.value
      },
      validate: ()=> {
        this.itemId.updateValueAndValidity();
        this.quantity.updateValueAndValidity();
        this.inventoryRequestRateCode.updateValueAndValidity();
      }
    }
  }


  ngAfterViewInit() {
    this.itemId.valueChanges
    .subscribe(async value => {
      this.itemId.setErrors(null);
      this.itemId.markAsDirty();
      if(this.dataSource.data.some(x=>x.itemId === this.itemId.value) && this.currentSelected?.itemId !== this.itemId.value) {
        this.snackBar.open("Item already exist in table!", 'close', {
          panelClass: ['style-error'],
        });
        this.itemId.setErrors({ exist: true});
        this.itemId.markAsDirty();
      } else if(this.warehouseCode && this.currentSelected?.itemCode) {
        try {
          this.spinner.show();
          const res = await this.warehouseInventoryService.getByItemCode(this.warehouseCode, this.currentSelected.itemCode).toPromise();
          this.spinner.hide();
          if(res.success) {
            this.currentWarehouseInventory = res.data as WarehouseInventory;
            let available = 0;
            if(this.isNew) {
              available = Number(this.currentWarehouseInventory.quantity) - Number(this.currentWarehouseInventory.orderedQuantity);
            } else if(this.currentSelected?.quantity && !isNaN(Number(this.currentSelected?.quantity))) {
              const currentQuantity = Number(this.currentSelected?.quantity)
              available = (currentQuantity + Number(this.currentWarehouseInventory.quantity)) - Number(this.currentWarehouseInventory.orderedQuantity);
            }
            this.currentWarehouseInventory.availableToRequest = available >= 0 ? available.toString() : "0";
            if(available <= 0) {
              this.snackBar.open("No stock available!", 'close', {
                panelClass: ['style-error'],
              });
              this.itemId.setErrors({ stockError: true});
              this.itemId.markAsDirty();
            }
          } else {
            this.snackBar.open("No stock available!", 'close', {
              panelClass: ['style-error'],
            });
            this.itemId.setErrors({ stockError: true});
            this.itemId.markAsDirty();
          }
        } catch(ex) {
          this.snackBar.open("No stock available!", 'close', {
            panelClass: ['style-error'],
          });
          this.itemId.setErrors({ stockError: true});
          this.itemId.markAsDirty();
        }
      } else {
        this.itemId.setErrors(null);
        this.itemId.markAsDirty();
      }
    });
    this.quantity.valueChanges
    .subscribe(async value => {
      if(this.currentRateSelected) {
        const { maxQuantity, minQuantity, baseRate } = this.currentRateSelected;
        if(Number(value) > Number(maxQuantity) && !baseRate && this.inventoryRequestRateCode.dirty && this.inventoryRequestRateCode.touched) {
          this.snackBar.open("Quantity must not exceed max quantity!", 'close', {
            panelClass: ['style-error'],
          });
          this.quantity.setErrors({ exceed: true});
        } else if(Number(value) < Number(minQuantity) && !baseRate && this.inventoryRequestRateCode.dirty && this.inventoryRequestRateCode.touched) {
          this.snackBar.open("Quantity must not be less than min quantity!", 'close', {
            panelClass: ['style-error'],
          });
          this.quantity.setErrors({ below: true});
        } else if(Number(value) < 1 && baseRate && this.inventoryRequestRateCode.dirty && this.inventoryRequestRateCode.touched) {
          this.snackBar.open("Quantity must not be less than 1!", 'close', {
            panelClass: ['style-error'],
          });
          this.quantity.setErrors({ min: true});
        } else if(!this.isProcessing && (value === '' || isNaN(Number(value)) || Number(value) <= 0)) {
          this.snackBar.open("Quantity must not be less than 1!", 'close', {
            panelClass: ['style-error'],
          });
          this.quantity.setErrors({ min: true});
        } else if(!this.isProcessing && Number(this.currentWarehouseInventory.availableToRequest) < Number(this.quantity.value)) {
          this.snackBar.open("Quantity must not be less than available stock!", 'close', {
            panelClass: ['style-error'],
          });
          this.quantity.setErrors({ below: true});
        } else {
          this.quantity.setErrors(null);
        }
        this.quantity.markAsDirty();
        this.computeItemTotalAmount();
      }
    });
    this.inventoryRequestRateCode.valueChanges
    .subscribe(async value => {
      if(this.currentRateSelected) {
        const { maxQuantity, minQuantity, baseRate } = this.currentRateSelected;
        if(Number(this.quantity.value) > Number(maxQuantity) && !baseRate && this.inventoryRequestRateCode.dirty && this.inventoryRequestRateCode.touched) {
          this.snackBar.open("Quantity must not exceed max quantity!", 'close', {
            panelClass: ['style-error'],
          });
          this.quantity.setErrors({ exceed: true});
        } else if(Number(this.quantity.value) < Number(minQuantity) && !baseRate && this.inventoryRequestRateCode.dirty && this.inventoryRequestRateCode.touched) {
          this.snackBar.open("Quantity must not be less than min quantity!", 'close', {
            panelClass: ['style-error'],
          });
          this.quantity.setErrors({ below: true});
        } else if(Number(this.quantity.value) < 1 && baseRate && this.quantity.dirty && this.quantity.touched) {
          this.snackBar.open("Quantity must not be less than 1!", 'close', {
            panelClass: ['style-error'],
          });
          this.quantity.setErrors({ below: true});
        } else {
          this.quantity.setErrors(null)
        }
        this.quantity.markAsDirty();
        this.computeItemTotalAmount();
      }
    });
  }

  computeItemTotalAmount() {
    this.currentSelected.totalAmount = Number(this.currentRateSelected.rate) * Number(this.quantity.value);
  }

  computeAccTotalAmount() {
    this.accTotalAmount = this.dataSource.data.map(x=>x.totalAmount).reduce((curr, prev) => {
      return Number(curr) + Number(prev);
    });
  }

  init(data: InventoryRequestItemTableColumn[]) {
    if(data) {
      this.dataSource = new MatTableDataSource(data);
      this.computeAccTotalAmount();
    }
  }

  resetCurrentSelected(){
    this.currentSelected = {
      itemId: "",
      itemCode: "",
      itemName: "",
      itemCategory: "",
      quantity: "",
      inventoryRequestRateCode: "",
      totalAmount: "",
    } as any;
  }

  resetCurrentRateSelected(){
    this.currentRateSelected = {
      inventoryRequestRateId: "",
      inventoryRequestRateCode: "",
      rate: "",
      rateName: "",
      minQuantity: "",
      maxQuantity: "",
      baseRate: false
    } as any;
  }

  async onShowNewItem() {
    this.isProcessing = true;
    this.resetCurrentSelected();
    this.itemId.reset();
    this.quantity.reset();
    this.inventoryRequestRateCode.reset();
    this.isNew = true;
    const dialogRef = this.dialog.open(this.inventoryRequestItemFormDialogTemp, {
      disableClose: true,
      panelClass: 'inventory-request-items'
    });
    this.isProcessing = false;
    dialogRef.afterOpened().subscribe(async res=> {
      this.inventoryRequestRateCode.markAsPristine();
      this.quantity.markAsPristine();
      this.resetCurrentSelected();
      this.resetCurrentRateSelected();
    });
    dialogRef.afterClosed().subscribe(async res=> {
      this.inventoryRequestRateCode.markAsPristine();
      this.quantity.markAsPristine();
      this.resetCurrentSelected();
      this.resetCurrentRateSelected();
    });
  }

  async editInventoryRequestItem(data: InventoryRequestItemTableColumn) {

    this.spinner.show();
    try {
      this.isProcessing = true;
      const res = await this.inventoryRequestRateService.getByCode(data.inventoryRequestRateCode).toPromise();
      if(res.success) {
        this.currentRateSelected.inventoryRequestRateId = res.data.inventoryRequestRateId;
        this.currentRateSelected.inventoryRequestRateCode = res.data.inventoryRequestRateCode;
        this.currentRateSelected.rate = res.data.rate;
        this.currentRateSelected.rateName = res.data.rateName;
        this.currentRateSelected.minQuantity = res.data.minQuantity;
        this.currentRateSelected.maxQuantity = res.data.maxQuantity;
        this.currentRateSelected.baseRate = res.data.baseRate;
        this.currentSelected = {
          itemId: data.itemId,
          itemCode: data.itemCode,
          itemName: data.itemName,
          itemCategory: data.itemCategory,
          quantity: data.quantity,
          inventoryRequestRateCode: data.inventoryRequestRateCode,
          totalAmount: data.totalAmount,
        } as any;
        this.itemId.setValue(this.currentSelected.itemId);
        this.quantity.setValue(this.currentSelected.quantity);
        this.inventoryRequestRateCode.setValue(this.currentSelected.inventoryRequestRateCode);
        this.isNew = false;
        this.spinner.hide();
        this.isProcessing = false;
      } else {
        this.error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        this.spinner.hide();
      }
    } catch (e) {
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.spinner.hide();
    }
    const dialogRef = this.dialog.open(this.inventoryRequestItemFormDialogTemp, {
      disableClose: true,
      panelClass: 'inventory-request-items'
    });
    dialogRef.afterClosed().subscribe(async res=> {
      this.inventoryRequestRateCode.markAsPristine();
      this.quantity.markAsPristine();
      this.resetCurrentSelected();
      this.resetCurrentRateSelected();
    });
    this.itemId.markAsPristine();
    this.quantity.markAsPristine();
  }

  showSelectItemDialog() {
    const dialogRef = this.dialog.open(SelectItemDialogComponent, {
        disableClose: true,
        panelClass: "select-item-dialog"
    });
    dialogRef.componentInstance.selected = {
      itemId: this.currentSelected?.itemId,
      itemCode: this.currentSelected?.itemCode,
      itemName: this.currentSelected?.itemName,
      itemCategory: this.currentSelected?.itemCategory,
      selected: true
    }
    dialogRef.afterClosed().subscribe((res:Item)=> {
      console.log(res);
      if(res) {
        if(!this.dataSource.data.some(x=>x.itemId ===  res.itemId) ) {
          this.currentSelected.itemId = res.itemId;
          this.currentSelected.itemCode = res.itemCode;
          this.currentSelected.itemName = res.itemName;
          this.currentSelected.itemCategory = res.itemCategory.name;
          this.itemId.setValue(this.currentSelected.itemId);
        } else {
          this.snackBar.open("Item already exist in table!", 'close', {
            panelClass: ['style-error'],
          });
          this.itemId.setErrors({ exist: true});
          this.itemId.markAsDirty();
        }
      }
    })
  }

  showSelectRateDialog() {

    const dialogRef = this.dialog.open(InventoryRequestRateSelectComponent, {
        disableClose: true,
        panelClass: "select-rate-dialog"
    });
    dialogRef.componentInstance.item = { itemId: this.currentSelected?.itemId, itemCode: this.currentSelected?.itemCode } as any;
    dialogRef.componentInstance.selected = {
      inventoryRequestRateId: this.currentRateSelected?.inventoryRequestRateId,
      inventoryRequestRateCode: this.currentRateSelected?.inventoryRequestRateCode,
      rate: this.currentRateSelected?.rate,
      rateName: this.currentRateSelected?.rateName,
      minQuantity: this.currentRateSelected?.minQuantity,
      maxQuantity: this.currentRateSelected?.maxQuantity,
      baseRate: this.currentRateSelected?.baseRate,
      selected: true
    }
    dialogRef.afterClosed().subscribe((res:InventoryRequestRate)=> {
      console.log(res);
      if(res) {
        this.currentRateSelected.inventoryRequestRateId = res.inventoryRequestRateId;
        this.currentRateSelected.inventoryRequestRateCode = res.inventoryRequestRateCode;
        this.currentRateSelected.rate = res.rate;
        this.currentRateSelected.rateName = res.rateName;
        this.currentRateSelected.minQuantity = res.minQuantity;
        this.currentRateSelected.maxQuantity = res.maxQuantity;
        this.currentRateSelected.baseRate = res.baseRate;
        this.currentSelected.inventoryRequestRateCode = this.currentRateSelected.inventoryRequestRateCode;
        this.inventoryRequestRateCode.setValue(this.currentRateSelected.inventoryRequestRateCode);
        this.inventoryRequestRateCode.markAsDirty();
        this.inventoryRequestRateCode.markAsTouched();
      }
    })
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
            this.currentSelected.quantity = this.quantity.value;
            if(items.some(x=>x.itemId === this.currentSelected.itemId)) {
              items.find(x=>x.itemId === this.itemId.value).quantity = this.currentSelected.quantity;
              items.find(x=>x.itemId === this.itemId.value).inventoryRequestRateCode = this.inventoryRequestRateCode.value;
              items.find(x=>x.itemId === this.itemId.value).inventoryRequestRateCode = this.inventoryRequestRateCode.value;
              items.find(x=>x.itemId === this.itemId.value).totalAmount = Number(this.currentSelected?.totalAmount);
            } else {
              items.push(this.currentSelected);
            }
            this.inventoryRequestRateCode.markAsPristine();
            this.quantity.markAsPristine();
            this.resetCurrentSelected();
            this.resetCurrentRateSelected();
            this.dataSource = new MatTableDataSource(items);
            this.itemsChanged.emit(this.dataSource.data);
            this.computeAccTotalAmount();
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
