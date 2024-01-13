import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { GoodsIssue } from 'src/app/model/goods-issue';
import { AppConfigService } from 'src/app/services/app-config.service';
import { GoodsIssueService } from 'src/app/services/goods-issue.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { GoodsIssueFormComponent } from '../goods-issue-form/goods-issue-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { GoodsIssueItemComponent } from '../goods-issue-items/goods-issue-items.component';
import { GoodsIssueItemTableColumn } from 'src/app/shared/utility/table';
import { Users } from 'src/app/model/users';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { Access, AccessPages } from 'src/app/model/access';
import { PusherService } from 'src/app/services/pusher.service';
export class UpdateStatusModel {
  status: "REJECTED"
  | "COMPLETED"
  | "CANCELLED";
  notes: string;
}
@Component({
  selector: 'app-goods-issue-details',
  templateUrl: './goods-issue-details.component.html',
  styleUrls: ['./goods-issue-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class GoodsIssueDetailsComponent {
  currentUserProfile:Users;
  goodsIssueCode;
  isNew = false;
  isReadOnly = true;
  error;
  isLoading = true;

  issueTypeCtrl = new FormControl("", [Validators.required])

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('goodsIssueForm', { static: true}) goodsIssueForm: GoodsIssueFormComponent;
  @ViewChild('goodsIssueItems', { static: true}) goodsIssueItemComponent: GoodsIssueItemComponent;

  canAddEdit = false;

  goodsIssue: GoodsIssue;

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
    private goodsIssueService: GoodsIssueService,
    private warehouseService: WarehouseService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private pusherService: PusherService
  ) {
    this.currentUserProfile = this.storageService.getLoginProfile();
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.goodsIssueCode = this.route.snapshot.paramMap.get('goodsIssueCode');
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
    const channel = this.pusherService.init(this.currentUserProfile.userId);
    channel.bind('goodsIssueChanges', (res: any) => {
      this.snackBar.open("Someone has updated this document.", "",{
        announcementMessage: "Someone has updated this document.",
        verticalPosition: "top"
      });
      if(this.isReadOnly) {
        this.initDetails();
      }
    });
  }

  async ngAfterViewInit() {
    await Promise.all([
      this.initWarehouseOptions(),
    ])
    if(!this.isNew) {
      this.initDetails();
    } else {
      this.isLoading = false;
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
    const res = await this.warehouseService.getByAdvanceSearch({
      order: {},
      columnDef: [{
        apiNotation: "name",
        filter: this.warehouseSearchInput?.nativeElement?.value ? this.warehouseSearchInput?.nativeElement?.value : ""
      }],
      pageIndex: 0,
      pageSize: 10
    }).toPromise();
    this.optionWarehouse = res.data.results.map(a=> { return { name: a.name, code: a.warehouseCode }});
    this.isOptionsWarehouseLoading = false;
  }

  displayWarehouseName(value?: number) {
    return value ? this.optionWarehouse.find(_ => _.code === value?.toString())?.name : undefined;
  }

  initDetails() {
    this.isLoading = true;
    try {
      this.goodsIssueService.getByCode(this.goodsIssueCode).subscribe(res=> {
        if (res.success) {
          this.goodsIssue = res.data;
          this.canAddEdit = !((!this.isReadOnly || !this.isNew) && this.goodsIssue.status !== "PENDING");
          this.warehouseCode.setValue(this.goodsIssue.warehouse.warehouseCode);
          this.warehouseSearchCtrl.setValue(this.goodsIssue.warehouse.warehouseCode);
          this.issueTypeCtrl.setValue(this.goodsIssue.issueType);
          const items = this.goodsIssue.goodsIssueItems.map(x=> {
            return {
              quantity: x.quantity,
              itemId: x.item.itemId,
              itemCode: x.item.itemCode,
              itemName: x.item.itemDescription,
              itemDescription: x.item.itemId,
              itemCategory: x.item.itemCategory.name,
            } as GoodsIssueItemTableColumn
          })
          this.goodsIssueForm.setFormValue(this.goodsIssue, items);
          this.goodsIssueItemComponent.init(items);

          if (this.isReadOnly) {
            this.goodsIssueForm.form.disable();
          }
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/goods-issue/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/goods-issue/']);
      this.isLoading = false;
    }
  }

  async itemsChanged(event) {
    console.log(event);
    this.goodsIssueForm.form.controls["goodsIssueItems"].setValue(event);
    this.goodsIssueForm.form.controls["goodsIssueItems"].markAsDirty();
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
      dialogData.message = 'Are you sure you want to cancel goods issue?';
    } else if(params?.status === "REJECTED") {
      dialogData.message = 'Are you sure you want to reject goods issue?';
    } else if(params?.status === "COMPLETED") {
      dialogData.message = 'Are you sure you want to complete goods issue?';
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
        params = {
          ...params,
          updatedByUserId: this.currentUserProfile.userId,
        } as any;
        let res = await this.goodsIssueService.updateStatus(this.goodsIssueCode, params).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/goods-issue/' + this.goodsIssueCode + '/details']);
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
    dialogData.message = 'Update goods issue?';
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
          issueType: this.issueTypeCtrl.value,
        }
        if(this.isNew) {
          formData = {
            ...formData,
            createdByUserId: this.currentUserProfile.userId,
            warehouseCode: this.warehouseCode.value,
          }
          res = await this.goodsIssueService.create(formData).toPromise();
        } else {
          formData = {
            ...formData,
            updatedByUserId: this.currentUserProfile.userId,
          }
          res = await this.goodsIssueService.update(this.goodsIssueCode, formData).toPromise();
        }
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/goods-issue/' + res.data.goodsIssueCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.goodsIssueCode = res.data.goodsIssueCode;
          this.goodsIssue = res.data;
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
