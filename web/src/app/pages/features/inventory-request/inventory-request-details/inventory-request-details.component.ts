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
import { InventoryRequestFormComponent } from '../inventory-request-form/inventory-request-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryRequestItemComponent } from '../inventory-request-items/inventory-request-items.component';
import { InventoryRequestItemTableColumn } from 'src/app/shared/utility/table';
import { Users } from 'src/app/model/users';

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
  isLoading = false;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('inventoryRequestForm', { static: true}) inventoryRequestForm: InventoryRequestFormComponent;
  @ViewChild('inventoryRequestItems', { static: true}) inventoryRequestItemComponent: InventoryRequestItemComponent;

  canAddEdit = false;

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
  }

  ngAfterViewInit() {
    if(!this.isNew) {
      this.initDetails();
    } else {
      this.canAddEdit = true;
    }
  }

  async initDetails() {
    this.isLoading = true;
    try {
      const res = await this.inventoryRequestService.getByCode(this.inventoryRequestCode).toPromise();
      if (res.success) {
        this.inventoryRequest = res.data;
        if((!this.isReadOnly || !this.isNew) && this.inventoryRequest.requestStatus !== "PENDING") {
          this.router.navigate(['/inventory-request/' + res.data.inventoryRequestCode]);
          this.snackBar.open("Not allowed to edit, request was already - " + this.inventoryRequest.requestStatus.toLowerCase(), 'close', {
            panelClass: ['style-error'],
          });
        } else {
          this.canAddEdit = true;
        }
        this.inventoryRequestForm.setFormValue(this.inventoryRequest);
        const items = this.inventoryRequest.inventoryRequestItems.map(x=> {
          return {
            quantity: x.quantity,
            itemId: x.item.itemId,
            itemCode: x.item.itemCode,
            itemName: x.item.itemDescription,
            itemDescription: x.item.itemId,
            itemCategory: x.item.itemCategory.name,
          } as InventoryRequestItemTableColumn
        })
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

  updateStatus(status: "PENDING"
  | "REJECTED"
  | "PROCESSING"
  | "IN-TRANSIT"
  | "COMPLETED"
  | "CANCELLED"
  | "PARTIALLY-FULFILLED") {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Delete inventoryRequest?';
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
        let res = await this.inventoryRequestService.updateStatus(this.inventoryRequestCode, { status }).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/inventory-request/']);
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

  onSubmit(formData) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Update Item category?';
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
            branchId: this.currentUserProfile.branch.branchId
          }
          res = await this.inventoryRequestService.create(formData).toPromise();
        } else {
          res = await this.inventoryRequestService.update(this.inventoryRequestCode, formData).toPromise();
        }
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/inventory-request/' + res.data.inventoryRequestCode]);
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
