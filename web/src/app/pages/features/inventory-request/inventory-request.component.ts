import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { InventoryRequestTableColumn } from 'src/app/shared/utility/table';
import { Users } from 'src/app/model/users';

@Component({
  selector: 'app-inventory-request',
  templateUrl: './inventory-request.component.html',
  styleUrls: ['./inventory-request.component.scss'],
  host: {
    class: "page-component"
  }
})
export class InventoryRequestComponent {
  currentUserProfile:Users;
  error:string;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  order: any = { inventoryRequestId: "DESC" };

  filter: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[] = [];

  // pageInventoryRequest: InventoryRequest = {
  //   view: true,
  //   modify: false,
  // };

  @ViewChild('inventoryRequestFormDialog') inventoryRequestFormDialogTemp: TemplateRef<any>;
  constructor(
    private spinner: SpinnerVisibilityService,
    private inventoryRequestService: InventoryRequestService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router) {
      this.currentUserProfile = this.storageService.getLoginProfile();
      this.dataSource = new MatTableDataSource([]);
      if(this.route.snapshot.data) {
        // this.pageInventoryRequest = {
        //   ...this.pageInventoryRequest,
        //   ...this.route.snapshot.data["inventoryRequest"]
        // };
      }
    }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getInventoryRequestPaginated();

  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]) {
    this.filter = event;
    this.getInventoryRequestPaginated();
  }

  async pageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getInventoryRequestPaginated();
  }

  async sortChange(event: { active: string, direction: string }) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.inventoryRequest.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction.toUpperCase());
    this.getInventoryRequestPaginated()
  }

  async getInventoryRequestPaginated(){
    try{
      const key = "branch.branchCode"
      const filter = {
        "apiNotation": key,
        "filter": this.currentUserProfile?.branch?.branchCode,
        "name": "branchCode",
        "type": "text"
      };
      const findIndex = this.filter.findIndex(x=>x.apiNotation === key);
      if(findIndex >= 0) {
        this.filter[findIndex] = filter;
      } else {
        this.filter.push(filter);
      }

      this.isLoading = true;
      this.spinner.show();
      await this.inventoryRequestService.getByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex, pageSize: this.pageSize
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              inventoryRequestId: d.inventoryRequestId,
              inventoryRequestCode: d.inventoryRequestCode,
              dateRequested: d.dateRequested.toString(),
              requestStatus: d.requestStatus,
              branch: d.branch?.name,
              requestedByUser: d.requestedByUser?.fullName,
              url: `/inventory-request/${d.inventoryRequestCode}`,
            } as InventoryRequestTableColumn
          });
          this.total = res.data.total;
          this.dataSource = new MatTableDataSource(data);
          this.isLoading = false;
          this.spinner.hide();
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading = false;
          this.spinner.hide();
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading = false;
        this.spinner.hide();
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isLoading = false;
      this.spinner.hide();
    }

  }

  showAddDialog() {
    this.dialog.open(this.inventoryRequestFormDialogTemp)
  }

  closeNewInventoryRequestDialog() {
    this.dialog.closeAll();
  }

  saveNewInventoryRequest(formData) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Save item category?';
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
        let res = await this.inventoryRequestService.create(formData).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.dialog.closeAll();
          this.router.navigate(['/inventory-request/' + res.data.inventoryRequestId]);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
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
