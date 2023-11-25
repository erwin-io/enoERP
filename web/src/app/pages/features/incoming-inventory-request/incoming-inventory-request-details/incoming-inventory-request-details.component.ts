import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InventoryRequest } from 'src/app/model/inventory-request';
import { AppConfigService } from 'src/app/services/app-config.service';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { InventoryRequestFormComponent } from '../../inventory-request/inventory-request-form/inventory-request-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryRequestItemComponent } from '../../inventory-request/inventory-request-items/inventory-request-items.component';
import { InventoryRequestItemTableColumn } from 'src/app/shared/utility/table';
import { Users } from 'src/app/model/users';
export class UpdateStatusModel {
  notes: string;
  status:  "PENDING"
| "REJECTED"
| "PROCESSING"
| "IN-TRANSIT"
| "COMPLETED"
| "CANCELLED"
| "PARTIALLY-FULFILLED" };
@Component({
  selector: 'app-incoming-inventory-request-details',
  templateUrl: './incoming-inventory-request-details.component.html',
  styleUrls: ['./incoming-inventory-request-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class IncomingInventoryRequestDetailsComponent {
  currentUserProfile:Users;
  inventoryRequestCode;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;

  @ViewChild('inventoryRequestForm', { static: true}) inventoryRequestForm: InventoryRequestFormComponent;
  @ViewChild('inventoryRequestItems', { static: true}) inventoryRequestItemComponent: InventoryRequestItemComponent;
  @ViewChild('updateStatusDialog') updateStatusDialog: TemplateRef<any>;

  updateStatusData: UpdateStatusModel = { status: null, notes: null };

  inventoryRequest: InventoryRequest
  constructor(
    private inventoryRequestService: InventoryRequestService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.currentUserProfile = this.storageService.getLoginProfile();
    this.inventoryRequestCode = this.route.snapshot.paramMap.get('inventoryRequestCode');
    if (this.route.snapshot.data) {
      // this.pageIncomingInventoryRequest = {
      //   ...this.pageIncomingInventoryRequest,
      //   ...this.route.snapshot.data['inventoryRequest'],
      // };
    }
  }

  get pageRights() {
    let rights = {};
    // for(var right of this.pageIncomingInventoryRequest.rights) {
    //   rights[right] = this.pageIncomingInventoryRequest.modify;
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
      this.inventoryRequestService.getByCode(this.inventoryRequestCode).subscribe(res=> {
        if (res.success) {
          this.inventoryRequest = res.data;
          const items = this.inventoryRequest.inventoryRequestItems.map(x=> {
            return {
              quantity: x.quantity,
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
          this.inventoryRequestForm.form.disable();
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/incoming-inventory-request/']);
        }
      })
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/incoming-inventory-request/']);
      this.isLoading = false;
    }
  }

  async itemsChanged(event) {
    console.log(event);
    this.inventoryRequestForm.form.controls["inventoryRequestItems"].setValue(event);
    this.inventoryRequestForm.form.controls["inventoryRequestItems"].markAsDirty();
  }

  showAction(status: "PENDING"
  | "REJECTED"
  | "PROCESSING"
  | "IN-TRANSIT"
  | "COMPLETED"
  | "CANCELLED"
  | "PARTIALLY-FULFILLED") {
    let show = false;
    if(this.inventoryRequest) {
      if(status === "PROCESSING" && this.inventoryRequest.requestStatus === "PENDING") {
        show = true;
      }
      if(status === "REJECTED" && this.inventoryRequest.requestStatus === "PENDING") {
        show = true;
      }
      if(status === "IN-TRANSIT" && this.inventoryRequest.requestStatus === "PROCESSING") {
        show = true;
      }
      if(status === "COMPLETED" && this.inventoryRequest.requestStatus === "IN-TRANSIT") {
        show = true;
      }
      if(status === "CANCELLED" && this.inventoryRequest.requestStatus === "PENDING") {
        show = true;
      }
    }
    return show;
  }

  showUpdateStatusDialog(status: "PENDING"
  | "REJECTED"
  | "PROCESSING"
  | "IN-TRANSIT"
  | "COMPLETED"
  | "CANCELLED"
  | "PARTIALLY-FULFILLED") {
    this.updateStatusData = {
      status
    } as any;
    const dialogRef = this.dialog.open(this.updateStatusDialog, {
      maxWidth: "300px",
      disableClose: true,
    });
  }

  processStatus(status: "PENDING"
  | "REJECTED"
  | "PROCESSING"
  | "IN-TRANSIT"
  | "COMPLETED"
  | "CANCELLED"
  | "PARTIALLY-FULFILLED") {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    if(status === "PROCESSING") {
      dialogData.message = 'Process request?';
    } else if(status === "IN-TRANSIT") {
      dialogData.message = 'Mark as in-transit?';
    } else {
      return;
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
        let res = await this.inventoryRequestService.processStatus(this.inventoryRequestCode, { status }).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/incoming-inventory-request/' + this.inventoryRequestCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
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

  closeRequest(params) {
    if(!params?.notes || params?.notes === '') {
      this.snackBar.open("Notes is required!", 'close', {
        panelClass: ['style-error'],
      });
      return;
    }
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    if(params.status === "REJECTED") {
      dialogData.message = 'Reject request?';
    } else if(params.status === "CANCELLED") {
      dialogData.message = 'Cancel request?';
    } else {
      dialogData.message = 'Mark as completed?';
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
        let res = await this.inventoryRequestService.closeRequest(this.inventoryRequestCode, params).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/incoming-inventory-request/' + this.inventoryRequestCode + '/details']);
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
