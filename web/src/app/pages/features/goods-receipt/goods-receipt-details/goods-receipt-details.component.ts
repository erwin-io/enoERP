import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { GoodsReceipt } from 'src/app/model/goods-receipt';
import { AppConfigService } from 'src/app/services/app-config.service';
import { GoodsReceiptService } from 'src/app/services/goods-receipt.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { GoodsReceiptFormComponent } from '../goods-receipt-form/goods-receipt-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { GoodsReceiptItemComponent } from '../goods-receipt-items/goods-receipt-items.component';
import { GoodsReceiptItemTableColumn } from 'src/app/shared/utility/table';
import { Users } from 'src/app/model/users';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { Access, AccessPages } from 'src/app/model/access';
export class UpdateStatusModel {
  status: "REJECTED"
  | "COMPLETED"
  | "CANCELLED";
  notes: string;
}
@Component({
  selector: 'app-goods-receipt-details',
  templateUrl: './goods-receipt-details.component.html',
  styleUrls: ['./goods-receipt-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class GoodsReceiptDetailsComponent {
  currentUserProfile:Users;
  goodsReceiptCode;
  isNew = false;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('goodsReceiptForm', { static: true}) goodsReceiptForm: GoodsReceiptFormComponent;
  @ViewChild('goodsReceiptItems', { static: true}) goodsReceiptItemComponent: GoodsReceiptItemComponent;

  canAddEdit = false;

  goodsReceipt: GoodsReceipt;

  warehouseCode = new FormControl();
  isOptionsWarehouseLoading = false;
  optionWarehouse: {code: string; name: string}[] = [];
  warehouseSearchCtrl = new FormControl();
  @ViewChild('warehouseSearchInput', { static: true}) warehouseSearchInput: ElementRef<HTMLInputElement>;
  updateStatusData: UpdateStatusModel = { } as any

  pageAccess: AccessPages = {
    view: true,
    modify: false,
  } as any;

  @ViewChild('cancelDialog') cancelDialog: TemplateRef<any>;
  constructor(
    private goodsReceiptService: GoodsReceiptService,
    private warehouseService: WarehouseService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.currentUserProfile = this.storageService.getLoginProfile();
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.goodsReceiptCode = this.route.snapshot.paramMap.get('goodsReceiptCode');
    this.isReadOnly = !edit && !isNew;
    if (this.route.snapshot.data) {
      this.pageAccess = {
        ...this.pageAccess,
        ...this.route.snapshot.data['access'],
      };
    }
  }

  get pageRights() {
    let rights = {};
    for(var right of this.pageAccess.rights) {
      rights[right] = this.pageAccess.modify;
    }
    return rights;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initWarehouseOptions();
    if(!this.isNew) {
      this.initDetails();
    } else {
      this.canAddEdit = true;
    }

    this.warehouseSearchCtrl.valueChanges
    .pipe(
        debounceTime(2000),
        distinctUntilChanged()
    )
    .subscribe(async value => {
        await this.initWarehouseOptions();
    });
    this.warehouseCode.valueChanges
    .subscribe(async value => {
    });
  }

  async initWarehouseOptions() {
    this.isOptionsWarehouseLoading = true;
    this.warehouseService.getByAdvanceSearch({
      order: {},
      columnDef: [{
        apiNotation: "name",
        filter: this.warehouseSearchInput.nativeElement.value
      }],
      pageIndex: 0,
      pageSize: 10
    }).subscribe(res=> {
      this.optionWarehouse = res.data.results.map(a=> { return { name: a.name, code: a.warehouseCode }});
      this.isOptionsWarehouseLoading = false;
    })
  }

  displayWarehouseName(value?: number) {
    return value ? this.optionWarehouse.find(_ => _.code === value?.toString())?.name : undefined;
  }

  initDetails() {
    this.isLoading = true;
    try {
      this.goodsReceiptService.getByCode(this.goodsReceiptCode).subscribe(res=> {
        if (res.success) {
          this.goodsReceipt = res.data;
          this.canAddEdit = !((!this.isReadOnly || !this.isNew) && this.goodsReceipt.status !== "PENDING");
          this.warehouseCode.setValue(this.goodsReceipt.warehouse.warehouseCode);
          this.warehouseSearchCtrl.setValue(this.goodsReceipt.warehouse.warehouseCode);
          const items = this.goodsReceipt.goodsReceiptItems.map(x=> {
            return {
              quantity: x.quantity,
              itemId: x.item.itemId,
              itemCode: x.item.itemCode,
              itemName: x.item.itemDescription,
              itemDescription: x.item.itemId,
              itemCategory: x.item.itemCategory.name,
            } as GoodsReceiptItemTableColumn
          })
          this.goodsReceiptForm.setFormValue(this.goodsReceipt, items);
          this.goodsReceiptItemComponent.init(items);

          if (this.isReadOnly) {
            this.goodsReceiptForm.form.disable();
          }
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/goods-receipt/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/goods-receipt/']);
      this.isLoading = false;
    }
  }

  async itemsChanged(event) {
    console.log(event);
    this.goodsReceiptForm.form.controls["goodsReceiptItems"].setValue(event);
    this.goodsReceiptForm.form.controls["goodsReceiptItems"].markAsDirty();
  }

  showUpdateStatusDialog(status: "COMPLETED" | "REJECTED" | "CANCELLED") {
    this.updateStatusData = {
      status: status
    } as any;
    const dialogRef = this.dialog.open(this.cancelDialog, {
      maxWidth: "300px",
      disableClose: true,
    });
  }

  updateStatus(params: UpdateStatusModel) {
    if(!params?.notes || params?.notes === "") {
      this.snackBar.open("Notes is required!", 'close', {
        panelClass: ['style-error'],
      });
      return;
    }
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    if(params?.status === "CANCELLED") {
      dialogData.message = 'Are you sure you want to cancel goods receipt?';
    } else if(params?.status === "REJECTED") {
      dialogData.message = 'Are you sure you want to reject goods receipt?';
    } else if(params?.status === "COMPLETED") {
      dialogData.message = 'Are you sure you want to complete goods receipt?';
    }
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
      this.isProcessing = true;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      try {
        let res = await this.goodsReceiptService.updateStatus(this.goodsReceiptCode, params).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/goods-receipt/' + this.goodsReceiptCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.initDetails();
          dialogRef.close();
          this.dialog.closeAll();
        } else {
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.error = Array.isArray(res.message)
            ? res.message[0]
            : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          dialogRef.close();
        }
      } catch (e) {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }

  onSubmit(formData) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Update goods receipt?';
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
      this.isProcessing = true;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      try {
        let res;
        if(this.isNew) {
          formData = {
            ...formData,
            createdByUserId: this.currentUserProfile.userId,
            warehouseCode: this.warehouseCode.value
          }
          res = await this.goodsReceiptService.create(formData).toPromise();
        } else {
          res = await this.goodsReceiptService.update(this.goodsReceiptCode, formData).toPromise();
        }
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/goods-receipt/' + res.data.goodsReceiptCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.goodsReceiptCode = res.data.goodsReceiptCode;
          this.goodsReceipt = res.data;
          this.isReadOnly = true;
          this.isNew = false;
          this.canAddEdit = true;
          this.initDetails();
          dialogRef.close();
        } else {
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.error = Array.isArray(res.message)
            ? res.message[0]
            : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          dialogRef.close();
        }
      } catch (e) {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }
}
