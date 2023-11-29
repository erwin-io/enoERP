import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { InventoryAdjustmentReport } from 'src/app/model/inventory-adjustment-report';
import { AppConfigService } from 'src/app/services/app-config.service';
import { InventoryAdjustmentReportService } from 'src/app/services/inventory-adjustment-report.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { InventoryAdjustmentReportFormComponent } from '../inventory-adjustment-report-form/inventory-adjustment-report-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryAdjustmentReportItemComponent } from '../inventory-adjustment-report-items/inventory-adjustment-report-items.component';
import { InventoryAdjustmentReportItemTableColumn } from 'src/app/shared/utility/table';
import { Users } from 'src/app/model/users';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { InventoryRequest } from 'src/app/model/inventory-request';
import { InventoryAdjustmentReportRequestSelectComponent } from './inventory-adjustment-report-request-select/inventory-adjustment-report-request-select.component';
export class UpdateStatusModel {
  status: "CANCELLED";
  notes: string;
}
@Component({
  selector: 'app-inventory-adjustment-report-details',
  templateUrl: './inventory-adjustment-report-details.component.html',
  styleUrls: ['./inventory-adjustment-report-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class InventoryAdjustmentReportDetailsComponent {
  currentUserProfile:Users;
  inventoryAdjustmentReportCode;
  inventoryRequestCode;
  isNew = false;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('inventoryAdjustmentReportForm', { static: true}) inventoryAdjustmentReportForm: InventoryAdjustmentReportFormComponent;
  @ViewChild('inventoryAdjustmentReportItems', { static: true}) inventoryAdjustmentReportItemComponent: InventoryAdjustmentReportItemComponent;

  canAddEdit = false;

  inventoryAdjustmentReport: InventoryAdjustmentReport;
  inventoryRequest: InventoryRequest;

  updateStatusData: UpdateStatusModel = { } as any

  reportTypeCtrl = new FormControl('', [Validators.required]);

  @ViewChild('updateStatusDialog') updateStatusDialog: TemplateRef<any>;
  constructor(
    private inventoryAdjustmentReportService: InventoryAdjustmentReportService,
    private inventoryRequestService: InventoryRequestService,
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
    if(this.isNew) {
      this.inventoryRequestCode = this.route.snapshot.paramMap.get('inventoryRequestCode');
    } else {
      this.inventoryAdjustmentReportCode = this.route.snapshot.paramMap.get('inventoryAdjustmentReportCode');
    }
    this.isReadOnly = !edit && !isNew;
    if (this.route.snapshot.data) {
      // this.pageInventoryAdjustmentReport = {
      //   ...this.pageInventoryAdjustmentReport,
      //   ...this.route.snapshot.data['inventoryAdjustmentReport'],
      // };
    }
  }

  get pageRights() {
    let rights = {};
    // for(var right of this.pageInventoryAdjustmentReport.rights) {
    //   rights[right] = this.pageInventoryAdjustmentReport.modify;
    // }
    return rights;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if(!this.isNew) {
      this.initDetails();
    } else if(this.isNew && this.inventoryRequestCode) {
      this.canAddEdit = true;
      this.newAdjustmentReportFromRequest(this.inventoryRequestCode);
    } else {
      this.canAddEdit = true;
      this.isLoading = false;
    }

  }

  initDetails() {
    this.isLoading = true;
    try {
      this.inventoryAdjustmentReportService.getByCode(this.inventoryAdjustmentReportCode).subscribe(res=> {
        if (res.success) {
          this.inventoryAdjustmentReport = res.data;
          this.canAddEdit = !((!this.isReadOnly || !this.isNew) && !["PENDING", "REVIEWED"].some(x=>x === this.inventoryAdjustmentReport.reportStatus));
          this.inventoryRequest = this.inventoryAdjustmentReport.inventoryRequest;
          this.inventoryRequestCode = this.inventoryRequest.inventoryRequestCode;
          const adjustedRequestItems = this.inventoryRequest.inventoryRequestItems;
          this.reportTypeCtrl.setValue(this.inventoryAdjustmentReport.reportType);
          const items = this.inventoryAdjustmentReport.inventoryAdjustmentReportItems.map(x=> {
            return {
              quantityReceived: this.isNew ? adjustedRequestItems.find(r=>r.item.itemId = x.item.itemId).quantityReceived : Number(adjustedRequestItems.find(r=>r.item.itemId = x.item.itemId).quantityReceived) + Number(x.returnedQuantity),
              returnedQuantity: x.returnedQuantity,
              totalRefund: Number(x.totalRefund),
              proposedUnitReturnRate: Number(x.proposedUnitReturnRate),
              itemId: x.item.itemId,
              itemCode: x.item.itemCode,
              itemName: x.item.itemDescription,
              itemDescription: x.item.itemId,
              itemCategory: x.item.itemCategory.name,
            } as InventoryAdjustmentReportItemTableColumn
          })
          this.inventoryAdjustmentReportForm.setFormValue(this.inventoryAdjustmentReport, items);
          this.inventoryAdjustmentReportItemComponent.init(items);

          if (this.isReadOnly) {
            this.inventoryAdjustmentReportForm.form.disable();
          }
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/inventory-adjustment-report/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/inventory-adjustment-report/']);
      this.isLoading = false;
    }
  }


  newAdjustmentReportFromRequest(inventoryRequestCode: string) {
    this.isLoading = true;
    try {
      this.inventoryRequestService.getByCode(inventoryRequestCode).subscribe(res=> {
        if (res.success) {
          this.inventoryRequest = res.data;
          const items = this.inventoryRequest.inventoryRequestItems.map(x=> {
            return {
              quantityReceived: x.quantityReceived,
              returnedQuantity: "0",
              totalRefund: 0,
              proposedUnitReturnRate: 0,
              itemId: x.item.itemId,
              itemCode: x.item.itemCode,
              itemName: x.item.itemDescription,
              itemDescription: x.item.itemId,
              itemCategory: x.item.itemCategory.name,
              isInvalidReturnedQuantity: true,
            } as InventoryAdjustmentReportItemTableColumn
          })
          this.inventoryAdjustmentReportForm.setFormValue(this.inventoryAdjustmentReport, items);
          this.inventoryAdjustmentReportItemComponent.init(items);

          if (this.isReadOnly) {
            this.inventoryAdjustmentReportForm.form.disable();
          }
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/inventory-adjustment-report/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/inventory-adjustment-report/']);
      this.isLoading = false;
    }
  }

  async itemsChanged(event) {
    console.log(event);
    this.inventoryAdjustmentReportForm.form.controls["inventoryAdjustmentReportItems"].setValue(event);
    this.inventoryAdjustmentReportForm.form.controls["inventoryAdjustmentReportItems"].markAsDirty();
  }

  showSelectRequestDialog() {
    const dialogRef = this.dialog.open(InventoryAdjustmentReportRequestSelectComponent, {
      panelClass: 'select-request-dialog',
    });
    dialogRef.afterClosed().subscribe((res:{
      inventoryRequestCode?: string;
    })=> {
      console.log(res);
      if(res) {
        this.inventoryRequestCode = res.inventoryRequestCode;
        this.isNew = true;
        this.ngAfterViewInit();
      }
    });
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

  openInventoryRequestNewTab() {
    window.open(`/inventory-request/${this.inventoryRequest.inventoryRequestCode}/details`, '_blank');
  }

  cancelReport(params: UpdateStatusModel) {
    if(!params?.notes || params?.notes === "") {
      this.snackBar.open("Notes is required!", 'close', {
        panelClass: ['style-error'],
      });
      return;
    }
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Are you sure you want to cancel the report?';
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
        let res = await this.inventoryAdjustmentReportService.closeReport(this.inventoryAdjustmentReportCode, params).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/inventory-adjustment-report/' + this.inventoryAdjustmentReportCode + '/details']);
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
    dialogData.message = 'Update adjustment report?';
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
        formData = {
          ...formData,
          reportedByUserId: this.currentUserProfile.userId,
          reportType: this.reportTypeCtrl.value
        }
        if(this.isNew) {
          formData = {
            ...formData,
            inventoryRequestCode: this.inventoryRequest.inventoryRequestCode,
          }
          res = await this.inventoryAdjustmentReportService.create(formData).toPromise();
        } else {
          res = await this.inventoryAdjustmentReportService.update(this.inventoryAdjustmentReportCode, formData).toPromise();
        }
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/inventory-adjustment-report/' + res.data.inventoryAdjustmentReportCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.inventoryAdjustmentReportCode = res.data.inventoryAdjustmentReportCode;
          this.inventoryAdjustmentReport = res.data;
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
