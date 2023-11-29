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
import { AdjustmentConfirmationFormComponent } from '../adjustment-confirmation-form/adjustment-confirmation-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { AdjustmentConfirmationItemComponent } from '../adjustment-confirmation-items/adjustment-confirmation-items.component';
import { InventoryAdjustmentReportItemTableColumn } from 'src/app/shared/utility/table';
import { Users } from 'src/app/model/users';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { InventoryRequest } from 'src/app/model/inventory-request';
export class UpdateStatusModel {
  status?: "REVIEWED"
  | "REJECTED"
  | "CLOSED";
  notes?: string;
}
@Component({
  selector: 'app-adjustment-confirmation-details',
  templateUrl: './adjustment-confirmation-details.component.html',
  styleUrls: ['./adjustment-confirmation-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class AdjustmentConfirmationDetailsComponent {
  currentUserProfile:Users;
  inventoryAdjustmentReportCode;
  inventoryRequestCode;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('adjustmentConfirmationForm', { static: true}) adjustmentConfirmationForm: AdjustmentConfirmationFormComponent;
  @ViewChild('adjustmentConfirmationItems', { static: true}) adjustmentConfirmationItemComponent: AdjustmentConfirmationItemComponent;

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
    this.inventoryAdjustmentReportCode = this.route.snapshot.paramMap.get('inventoryAdjustmentReportCode');
    if (this.route.snapshot.data) {
      // this.pageAccess = {
      //   ...this.pageAccess,
      //   ...this.route.snapshot.data['pageAccess'],
      // };
    }
  }

  get pageRights() {
    let rights = {};
    // for(var right of this.pageAccess.rights) {
    //   rights[right] = this.pageAccess.modify;
    // }
    return rights;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initDetails();
  }

  initDetails() {
    this.isLoading = true;
    try {
      this.inventoryAdjustmentReportService.getByCode(this.inventoryAdjustmentReportCode).subscribe(res=> {
        if (res.success) {
          this.inventoryAdjustmentReport = res.data;
          this.inventoryRequest = this.inventoryAdjustmentReport.inventoryRequest;
          this.inventoryRequestCode = this.inventoryRequest.inventoryRequestCode;
          const adjustedRequestItems = this.inventoryRequest.inventoryRequestItems;
          this.reportTypeCtrl.setValue(this.inventoryAdjustmentReport.reportType);
          const items = this.inventoryAdjustmentReport.inventoryAdjustmentReportItems.map(x=> {
            return {
              quantityReceived: (Number(adjustedRequestItems.find(r=>r.item.itemId = x.item.itemId).quantityReceived) + Number(x.returnedQuantity)).toString(),
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
          this.adjustmentConfirmationForm.setFormValue(this.inventoryAdjustmentReport, items);
          this.adjustmentConfirmationItemComponent.init(items);
          this.adjustmentConfirmationForm.form.disable();
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/adjustment-confirmation/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/adjustment-confirmation/']);
      this.isLoading = false;
    }
  }

  async itemsChanged(event) {
    this.adjustmentConfirmationForm.form.controls["adjustmentConfirmationItems"].setValue(event);
    this.adjustmentConfirmationForm.form.controls["adjustmentConfirmationItems"].markAsDirty();
    console.log(this.adjustmentConfirmationForm.adjustmentConfirmationItemsData);
  }

  showAction(status: "REVIEWED"
  | "REJECTED"
  | "CLOSED") {
    let show = false;
    if(this.inventoryAdjustmentReport) {
      if(status === "REVIEWED" && (this.inventoryAdjustmentReport.reportStatus === "PENDING" ||
      this.inventoryAdjustmentReport.reportStatus === "REVIEWED")) {
        show = true;
      }
      if(status === "REJECTED" && this.inventoryAdjustmentReport.reportStatus === "PENDING") {
        show = true;
      }
      if(status === "CLOSED" && this.inventoryAdjustmentReport.reportStatus === "COMPLETED") {
        show = true;
      }
    }
    return show;
  }

  showUpdateStatusDialog(status: "REVIEWED"
  | "REJECTED"
  | "CLOSED") {
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

  updateStatus(params: UpdateStatusModel) {
    if(params?.status !== "REVIEWED" && (!params?.notes || params?.notes === "")) {
      this.snackBar.open("Notes is required!", 'close', {
        panelClass: ['style-error'],
      });
      return;
    }
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = `Are you sure you want to mark resport as ${params.status.toLowerCase()}?`;
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
        if(params.status === "REVIEWED") {
          res = await this.inventoryAdjustmentReportService.processStatus(this.inventoryAdjustmentReportCode, {
            inventoryAdjustmentReportItems: this.adjustmentConfirmationForm.adjustmentConfirmationItemsData
          }).toPromise();
        } else {
          res = await this.inventoryAdjustmentReportService.closeReport(this.inventoryAdjustmentReportCode, params).toPromise();
        }
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/adjustment-confirmation/' + this.inventoryAdjustmentReportCode + '/details']);
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
}
