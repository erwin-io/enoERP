import { Component, ElementRef, Input, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { GoodsReceipt, GoodsReceiptItem } from 'src/app/model/goods-receipt';
import { Item } from 'src/app/model/item';
import { GoodsReceiptService } from 'src/app/services/goods-receipt.service';
import { ItemService } from 'src/app/services/item.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { SelectItemDialogComponent } from 'src/app/shared/select-item-dialog/select-item-dialog.component';
import { GoodsReceiptItemTableColumn } from 'src/app/shared/utility/table';
import { ItemWarehouse } from 'src/app/model/item-warehouse';
import { WarehouseInventoryService } from 'src/app/services/warehouse-inventory.service';
export class WarehouseInventory extends ItemWarehouse {
  currentStock: string;
}
@Component({
  selector: 'app-goods-receipt-items',
  templateUrl: './goods-receipt-items.component.html',
  styleUrls: ['./goods-receipt-items.component.scss']
})
export class GoodsReceiptItemComponent {
  @Input() warehouseCode;
  id;
  isProcessing = false;
  isNew = false;
  displayedColumns = ['itemName', 'itemCategory', 'quantity', 'controls'];
  dataSource = new MatTableDataSource<GoodsReceiptItemTableColumn>();
  @Input() goodsReceipt!: GoodsReceipt;
  @Input() isReadOnly = true;
  @ViewChild('goodsReceiptItemFormDialog') goodsReceiptItemFormDialogTemp: TemplateRef<any>;

  matcher = new MyErrorStateMatcher();
  itemId = new FormControl("", [Validators.required]);
  quantity = new FormControl("",[
    Validators.minLength(1),
    Validators.max(1000),
    Validators.pattern('^[0-9]*$'),
    Validators.required,
  ]);

  currentSelected: GoodsReceiptItemTableColumn = {
    itemId: "",
    itemCode: "",
    itemName: "",
    itemCategory: "",
    quantity: "",
  } as any;

  currentWarehouseInventory: WarehouseInventory = {
    availableToRequest: "0"
  } as any;

  error;

  @Output() itemsChanged = new EventEmitter();
  constructor(
    private spinner: SpinnerVisibilityService,
    private goodsReceiptService: GoodsReceiptService,
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
            this.currentWarehouseInventory.currentStock = this.currentWarehouseInventory.quantity;
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
      if(!this.isProcessing && (value === '' || isNaN(Number(value)) || Number(value) <= 0)) {
        this.snackBar.open("Quantity must not be less than 1!", 'close', {
          panelClass: ['style-error'],
        });
        this.quantity.setErrors({ min: true});
      } else {
        this.quantity.setErrors(null);
      }
      this.quantity.markAsDirty();
    });
  }

  init(data: GoodsReceiptItemTableColumn[]) {
    if(data) {
      this.dataSource = new MatTableDataSource(data);
    }
  }

  resetCurrentSelected(){
    this.currentSelected = {
      itemId: "",
      itemCode: "",
      itemName: "",
      itemCategory: "",
      quantity: "",
      goodsReceiptRateCode: "",
      totalAmount: "",
    } as any;
  }

  async onShowNewItem() {
    this.isProcessing = true;
    this.resetCurrentSelected();
    this.itemId.reset();
    this.quantity.reset();
    this.isNew = true;
    const dialogRef = this.dialog.open(this.goodsReceiptItemFormDialogTemp, {
      disableClose: true,
      panelClass: 'goods-receipt-items'
    });
    this.isProcessing = false;
    dialogRef.afterOpened().subscribe(async res=> {
      this.quantity.markAsPristine();
      this.resetCurrentSelected();
    });
    dialogRef.afterClosed().subscribe(async res=> {
      this.quantity.markAsPristine();
      this.resetCurrentSelected();
    });
  }

  async editGoodsReceiptItem(data: GoodsReceiptItemTableColumn) {

    this.spinner.show();
    this.currentSelected = {
      itemId: data.itemId,
      itemCode: data.itemCode,
      itemName: data.itemName,
      itemCategory: data.itemCategory,
      quantity: data.quantity,
    } as any;
    this.itemId.setValue(this.currentSelected.itemId);
    this.quantity.setValue(this.currentSelected.quantity);
    this.isNew = false;
    this.spinner.hide();
    this.isProcessing = false;
    const dialogRef = this.dialog.open(this.goodsReceiptItemFormDialogTemp, {
      disableClose: true,
      panelClass: 'goods-receipt-items'
    });
    dialogRef.afterClosed().subscribe(async res=> {
      this.quantity.markAsPristine();
      this.resetCurrentSelected();
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

  deleteGoodsReceiptItem(selected: GoodsReceiptItemTableColumn) {
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
            } else {
              items.push(this.currentSelected);
            }
            this.quantity.markAsPristine();
            this.resetCurrentSelected();
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

  Number(value: any = "0") {
    return isNaN(Number(value ? value.toString() : "0")) ? 0 : Number(value.toString());
  }
}
