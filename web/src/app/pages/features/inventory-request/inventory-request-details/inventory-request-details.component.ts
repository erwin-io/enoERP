import { Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { InventoryRequest } from 'src/app/model/inventory-request';
import { AppConfigService } from 'src/app/services/app-config.service';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { InventoryRequestFormComponent } from '../inventory-request-form/inventory-request-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryRequestItemComponent } from '../inventory-request-items/inventory-request-items.component';
import { InventoryRequestItemTableColumn } from 'src/app/shared/utility/table';
import { Users } from 'src/app/model/users';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { CustomSocket } from 'src/app/sockets/custom-socket.sockets';
export class UpdateStatusModel {
  status: "CANCELLED";
  notes: string;
}
@Component({
  selector: 'app-inventory-request-details',
  templateUrl: './inventory-request-details.component.html',
  styleUrls: ['./inventory-request-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class InventoryRequestDetailsComponent {
  currentUserProfile:Users;
  inventoryRequestCode;
  isNew = false;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('inventoryRequestForm', { static: true}) inventoryRequestForm: InventoryRequestFormComponent;
  @ViewChild('inventoryRequestItems', { static: true}) inventoryRequestItemComponent: InventoryRequestItemComponent;

  canAddEdit = false;

  inventoryRequest: InventoryRequest;

  warehouseCode = new FormControl();
  isOptionsWarehouseLoading = false;
  optionWarehouse: {code: string; name: string}[] = [];
  warehouseSearchCtrl = new FormControl();
  @ViewChild('warehouseSearchInput', { static: true}) warehouseSearchInput: ElementRef<HTMLInputElement>;
  updateStatusData: UpdateStatusModel = { } as any

  @ViewChild('updateStatusDialog') updateStatusDialog: TemplateRef<any>;
  constructor(
    private inventoryRequestService: InventoryRequestService,
    private warehouseService: WarehouseService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private socket: CustomSocket
  ) {
    this.currentUserProfile = this.storageService.getLoginProfile();
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.inventoryRequestCode = this.route.snapshot.paramMap.get('inventoryRequestCode');
    this.isReadOnly = !edit && !isNew;
    if (this.route.snapshot.data) {
      // this.pageInventoryRequest = {
      //   ...this.pageInventoryRequest,
      //   ...this.route.snapshot.data['inventoryRequest'],
      // };
    }
  }

  get pageRights() {
    let rights = {};
    // for(var right of this.pageInventoryRequest.rights) {
    //   rights[right] = this.pageInventoryRequest.modify;
    // }
    return rights;
  }

  ngOnInit(): void {
    this.socket.fromEvent('inventoryRequestChanges').subscribe(async res => {
      this.snackBar.open("Someone has updated this document.", "",{
        announcementMessage: "Someone has updated this document.",
        verticalPosition: "top"
      });
      if(this.isReadOnly) {
        this.initDetails();
      }
    });
  }

  ngAfterViewInit() {
    this.initWarehouseOptions();
    if(!this.isNew) {
      this.initDetails();
    } else {
      this.canAddEdit = true;
      this.isLoading = false;
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
      this.inventoryRequestService.getByCode(this.inventoryRequestCode).subscribe(res=> {
        if (res.success) {
          this.inventoryRequest = res.data;
          this.canAddEdit = !((!this.isReadOnly || !this.isNew) && this.inventoryRequest.requestStatus !== "PENDING");
          this.warehouseCode.setValue(this.inventoryRequest.fromWarehouse.warehouseCode);
          this.warehouseSearchCtrl.setValue(this.inventoryRequest.fromWarehouse.warehouseCode);
          const items = this.inventoryRequest.inventoryRequestItems.map(x=> {
            return {
              quantity: x.quantity,
              quantityReceived: x.quantityReceived,
              itemId: x.item.itemId,
              itemCode: x.item.itemCode,
              itemName: x.item.itemDescription,
              itemDescription: x.item.itemId,
              itemCategory: x.item.itemCategory.name,
              totalAmount: x.totalAmount,
              inventoryRequestRateCode: x.inventoryRequestRate.inventoryRequestRateCode
            } as InventoryRequestItemTableColumn
          })
          this.inventoryRequestForm.setFormValue(this.inventoryRequest, items);
          this.inventoryRequestItemComponent.init(items);

          if (this.isReadOnly) {
            this.inventoryRequestForm.form.disable();
          }
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/inventory-request/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/inventory-request/']);
      this.isLoading = false;
    }
  }

  async itemsChanged(event) {
    console.log(event);
    this.inventoryRequestForm.form.controls["inventoryRequestItems"].setValue(event);
    this.inventoryRequestForm.form.controls["inventoryRequestItems"].markAsDirty();
  }

  showUpdateStatusDialog(status: "CANCELLED" | "COMPLETED") {
    this.updateStatusData = {
      status
    } as any;
    const dialogRef = this.dialog.open(this.updateStatusDialog, {
      maxWidth: "300px",
      disableClose: true,
    });
  }

  cancelRequest(params: UpdateStatusModel) {
    if(!params?.notes || params?.notes === "") {
      this.snackBar.open("Notes is required!", 'close', {
        panelClass: ['style-error'],
      });
      return;
    }
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Are you sure you want to cancel the request?';
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
        params = {
          ...params,
          updatedByUserId: this.currentUserProfile.userId,
        } as any;
        let res = await this.inventoryRequestService.closeRequest(this.inventoryRequestCode, params).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/inventory-request/' + this.inventoryRequestCode + '/details']);
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
    dialogData.message = 'Update inventory request?';
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
            requestedByUserId: this.currentUserProfile.userId,
            branchId: this.currentUserProfile.branch.branchId,
            fromWarehouseCode: this.warehouseCode.value
          }
          res = await this.inventoryRequestService.create(formData).toPromise();
        } else {
          formData = {
            ...formData,
            updatedByUserId: this.currentUserProfile.userId,
          }
          res = await this.inventoryRequestService.update(this.inventoryRequestCode, formData).toPromise();
        }
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/inventory-request/' + res.data.inventoryRequestCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.inventoryRequestCode = res.data.inventoryRequestCode;
          this.inventoryRequest = res.data;
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
