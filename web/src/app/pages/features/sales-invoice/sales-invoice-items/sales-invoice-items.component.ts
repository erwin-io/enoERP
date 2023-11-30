import { Component, ElementRef, Input, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SalesInvoice, SalesInvoiceItem } from 'src/app/model/sales-invoice';
import { Item } from 'src/app/model/item';
import { SalesInvoiceService } from 'src/app/services/sales-invoice.service';
import { ItemService } from 'src/app/services/item.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { SelectItemDialogComponent } from 'src/app/shared/select-item-dialog/select-item-dialog.component';
import { SalesInvoiceItemTableColumn } from 'src/app/shared/utility/table';
import { WarehouseInventoryService } from 'src/app/services/warehouse-inventory.service';
import { ItemBranch } from 'src/app/model/item-branch';
import { InventoryMasterlistService } from 'src/app/services/inventory-masterlist.service';
export class BranchInventory extends ItemBranch {
  currentStock: string;
}
@Component({
  selector: 'app-sales-invoice-items',
  templateUrl: './sales-invoice-items.component.html',
  styleUrls: ['./sales-invoice-items.component.scss']
})
export class SalesInvoiceItemComponent {
  @Input() branchCode;
  id;
  isProcessing = false;
  @Input() isNew = false;
  displayedColumns = ['itemName', 'itemCategory', 'unitPrice', 'quantity', 'amount', 'controls'];
  dataSource = new MatTableDataSource<SalesInvoiceItemTableColumn>();
  @Input() salesInvoice!: SalesInvoice;
  @Input() isReadOnly = true;
  isNewItem = false;
  @ViewChild('salesInvoiceItemFormDialog') salesInvoiceItemFormDialogTemp: TemplateRef<any>;

  matcher = new MyErrorStateMatcher();
  itemId = new FormControl("", [Validators.required]);
  quantity = new FormControl("",[
    Validators.minLength(1),
    Validators.max(1000),
    Validators.pattern('^[0-9]*$'),
    Validators.required,
  ]);

  currentSelected: SalesInvoiceItemTableColumn = {
    itemId: "",
    itemCode: "",
    itemName: "",
    itemCategory: "",
    quantity: "",
    unitPrice: 0,
    amount: 0
  } as any;

  currentBranchInventory: BranchInventory = {
    currentStock: "0"
  } as any;

  error;

  @Output() itemsChanged = new EventEmitter();
  constructor(
    private spinner: SpinnerVisibilityService,
    private salesInvoiceService: SalesInvoiceService,
    private inventoryMasterlistService: InventoryMasterlistService,
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

  get accTotalAmount() {
    const total = this.dataSource.data.length > 0 ? this.dataSource.data.map(x=>Number(x.amount && x.amount !== '' ? x.amount : "0")).reduce((curr, prev) => {
      return Number(curr) + Number(prev);
    }) : 0;
    return total;
  }

  ngAfterViewInit() {
    this.itemId.valueChanges
    .subscribe(async value => {
      if(value && value !== '') {
        this.itemId.setErrors(null);
        this.itemId.markAsDirty();
      }
      if(this.dataSource.data.some(x=>x.itemId === this.itemId.value) && this.currentSelected?.itemId !== this.itemId.value) {
        this.snackBar.open("Item already exist in table!", 'close', {
          panelClass: ['style-error'],
        });
        this.itemId.setErrors({ exist: true});
        this.itemId.markAsDirty();
      } else if(this.branchCode && this.currentSelected?.itemCode) {
        try {
          this.spinner.show();
          const res = await this.inventoryMasterlistService.getByItemCode(this.branchCode, this.currentSelected.itemCode).toPromise();
          this.spinner.hide();
          if(res.success) {
            if(this.isNewItem && (!this.currentSelected.unitPrice || this.currentSelected.unitPrice === '' || Number(this.currentSelected.unitPrice) <= 0)) {
              this.currentSelected.unitPrice = res.data.item.price;
            }
            this.currentBranchInventory = res.data as BranchInventory;

            let available = 0;
            if(!this.isNew && this.currentSelected?.quantity && !isNaN(Number(this.currentSelected?.quantity))) {
              const currentQuantity = Number(this.currentSelected?.quantity)
              available = currentQuantity + Number(this.currentBranchInventory.quantity);
            }
            else {
              available = Number(this.currentBranchInventory.quantity);
            }
            this.currentBranchInventory.currentStock = available.toString();
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
      this.currentSelected.quantity = value && value !== '' && !isNaN(Number(value)) ? value : "0";
      const amount = Number(this.currentSelected.quantity) * Number(this.currentSelected.unitPrice);
      this.currentSelected.amount = amount.toString();
      if(value && value !== '') {
        this.quantity.markAsDirty();
        this.quantity.markAllAsTouched();
      }
      if(!this.isProcessing && (value === '' || isNaN(Number(value)) || Number(value) <= 0)) {
        this.snackBar.open("Quantity must not be less than 1!", 'close', {
          panelClass: ['style-error'],
        });
        this.quantity.setErrors({ min: true});
      } else if(Number(this.quantity.value) > Number(this.currentBranchInventory.currentStock) && this.quantity.dirty && this.quantity.touched) {
        this.snackBar.open("Quantity exceeds available stocks!", 'close', {
          panelClass: ['style-error'],
        });
        this.quantity.setErrors({ exceeds: true});
      } else {
        this.quantity.setErrors(null);
      }
      this.quantity.markAsDirty();
    });
  }

  init(data: SalesInvoiceItemTableColumn[]) {
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
      salesInvoiceRateCode: "",
      unitPrice: 0,
      amount: 0
    } as any;
  }

  async onShowNewItem() {
    this.isProcessing = true;
    this.resetCurrentSelected();
    this.itemId.reset();
    this.quantity.reset();
    this.currentSelected.unitPrice = "0";
    this.isNewItem = true;
    const dialogRef = this.dialog.open(this.salesInvoiceItemFormDialogTemp, {
      disableClose: true,
      panelClass: 'sales-invoice-items'
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

  async editSalesInvoiceItem(data: SalesInvoiceItemTableColumn) {

    this.spinner.show();
    this.currentSelected = {
      itemId: data.itemId,
      itemCode: data.itemCode,
      itemName: data.itemName,
      itemCategory: data.itemCategory,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      amount: data.amount,
    } as any;
    this.itemId.setValue(this.currentSelected.itemId);
    this.quantity.setValue(this.currentSelected.quantity);
    this.isNewItem = false;
    this.spinner.hide();
    this.isProcessing = false;
    const dialogRef = this.dialog.open(this.salesInvoiceItemFormDialogTemp, {
      disableClose: true,
      panelClass: 'sales-invoice-items'
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

  deleteSalesInvoiceItem(selected: SalesInvoiceItemTableColumn) {
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
            const amount = Number(this.currentSelected.quantity) * Number(this.currentSelected.unitPrice);
            this.currentSelected.amount = amount.toString();
            if(items.some(x=>x.itemId === this.currentSelected.itemId)) {
              items.find(x=>x.itemId === this.itemId.value).quantity = this.currentSelected.quantity;
              items.find(x=>x.itemId === this.itemId.value).unitPrice = this.currentSelected.unitPrice;
              items.find(x=>x.itemId === this.itemId.value).amount = this.currentSelected.amount;
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

  computeAmount() {
    this.currentSelected.unitPrice = this.currentSelected.unitPrice.replace("₱", "").replace(",", "");
    this.currentSelected.unitPrice = this.currentSelected.unitPrice.includes(".") && this.currentSelected.unitPrice.split(".").length <=2 ? this.currentSelected.unitPrice.split(".")[0] :
    this.currentSelected.unitPrice && this.currentSelected.unitPrice.split(".").length > 2 ? "0" : this.currentSelected.unitPrice;

    if(this.currentSelected.unitPrice && isNaN(Number(this.currentSelected.unitPrice))) {
      this.currentSelected.unitPrice = "0";
      return;
    }
    const amount = Number(this.currentSelected.quantity && this.currentSelected.quantity !== '' ? this.currentSelected.quantity : "0") *
    Number(this.currentSelected.unitPrice && this.currentSelected.unitPrice !== '' ? this.currentSelected.unitPrice : "0");
    this.currentSelected.amount = amount.toString();
  }

  getError(key: string) {
    return this.f && this.f[key] ? this.f[key].errors : null;
  }

  toNumber(value: any = "0") {
    return isNaN(Number(value ? value.toString() : "0")) ? 0 : Number(value.toString());
  }
}
