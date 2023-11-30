import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { SalesInvoice } from 'src/app/model/sales-invoice';
import { AppConfigService } from 'src/app/services/app-config.service';
import { SalesInvoiceService } from 'src/app/services/sales-invoice.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { SalesInvoiceFormComponent } from '../sales-invoice-form/sales-invoice-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { SalesInvoiceItemComponent } from '../sales-invoice-items/sales-invoice-items.component';
import { SalesInvoiceItemTableColumn } from 'src/app/shared/utility/table';
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
  selector: 'app-sales-invoice-details',
  templateUrl: './sales-invoice-details.component.html',
  styleUrls: ['./sales-invoice-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class SalesInvoiceDetailsComponent {
  currentUserProfile:Users;
  salesInvoiceCode;
  isNew = false;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('salesInvoiceForm', { static: true}) salesInvoiceForm: SalesInvoiceFormComponent;
  @ViewChild('salesInvoiceItems', { static: true}) salesInvoiceItemComponent: SalesInvoiceItemComponent;

  canAddEdit = false;
  salesInvoice: SalesInvoice;
  updateStatusData: UpdateStatusModel = { } as any

  pageAccess: AccessPages = {
    view: true,
    modify: false,
  } as any;

  constructor(
    private salesInvoiceService: SalesInvoiceService,
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
    this.salesInvoiceCode = this.route.snapshot.paramMap.get('salesInvoiceCode');
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

  async ngAfterViewInit() {
    await Promise.all([
    ])
    if(!this.isNew) {
      this.initDetails();
    } else {
      this.canAddEdit = true;
    }
  }

  initDetails() {
    this.isLoading = true;
    try {
      this.salesInvoiceService.getByCode(this.salesInvoiceCode).subscribe(res=> {
        if (res.success) {
          this.salesInvoice = res.data;
          this.canAddEdit = !((!this.isReadOnly || !this.isNew) && !this.salesInvoice.isVoid);
          const items = this.salesInvoice.salesInvoiceItems.map(x=> {
            return {
              quantity: x.quantity,
              itemId: x.item.itemId,
              itemCode: x.item.itemCode,
              itemName: x.item.itemDescription,
              itemDescription: x.item.itemId,
              itemCategory: x.item.itemCategory.name,
              amount: x.amount,
              unitPrice: x.unitPrice,
            } as SalesInvoiceItemTableColumn
          })
          this.salesInvoiceForm.setFormValue(this.salesInvoice, items);
          this.salesInvoiceItemComponent.init(items);

          if (this.isReadOnly) {
            this.salesInvoiceForm.form.disable();
          }
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/sales-invoice/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/sales-invoice/']);
      this.isLoading = false;
    }
  }

  async itemsChanged(event) {
    console.log(event);
    this.salesInvoiceForm.form.controls["salesInvoiceItems"].setValue(event);
    this.salesInvoiceForm.form.controls["salesInvoiceItems"].markAsDirty();
  }

  voidSalesInvoice() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Are you sure you want to void sales invoice?';
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
        let res = await this.salesInvoiceService.void(this.salesInvoiceCode).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/sales-invoice/' + this.salesInvoiceCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          await this.ngAfterViewInit();
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
    dialogData.message = 'Save sales invoice?';
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
        formData = {
          ...formData,
          createdByUserId: this.currentUserProfile.userId,
          branchId: this.currentUserProfile.branch.branchId,
        }
        let res = await this.salesInvoiceService.create(formData).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/sales-invoice/' + res.data.salesInvoiceCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.salesInvoiceCode = res.data.salesInvoiceCode;
          this.salesInvoice = res.data;
          this.isReadOnly = true;
          this.isNew = false;
          this.canAddEdit = true;
          await this.ngAfterViewInit();
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
