import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Users } from 'src/app/model/users';
import { AppConfigService } from 'src/app/services/app-config.service';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { InventoryRequestTableColumn } from 'src/app/shared/utility/table';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { Location } from '@angular/common';

@Component({
  selector: 'app-inventory-request-closed',
  templateUrl: './inventory-request-closed.component.html',
  styleUrls: ['./inventory-request-closed.component.scss'],
  host: {
    class: "page-component"
  }
})
export class InventoryRequestClosedComponent {
  tabIndex = 0;
  currentUserProfile: Users;
  error:string;
  dataSource = {
    completed: new MatTableDataSource<any>([]),
    rejected: new MatTableDataSource<any>([]),
    cancelled: new MatTableDataSource<any>([]),
  }
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    completed: 0,
    rejected: 0,
    cancelled: 0,
  };
  pageSize = {
    completed: 10,
    rejected: 10,
    cancelled: 10,
  };
  total = {
    completed: 0,
    rejected: 0,
    cancelled: 0,
  };
  order = {
    completed: { inventoryRequestId: "DESC" },
    rejected: { inventoryRequestId: "DESC" },
    cancelled: { inventoryRequestId: "DESC" },
  };

  filter = {
    completed: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    rejected: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    cancelled: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[]
  };
  // pageInventoryRequest: InventoryRequest = {
  //   view: true,
  //   modify: false,
  // };

  constructor(
    private spinner: SpinnerVisibilityService,
    private inventoryRequestService: InventoryRequestService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private titleService: Title,
    private _location: Location,
    public router: Router) {
      this.currentUserProfile = this.storageService.getLoginProfile();
      this.tabIndex = this.route.snapshot.data["tab"];
      if(this.route.snapshot.data) {
        // this.pageInventoryRequest = {
        //   ...this.pageInventoryRequest,
        //   ...this.route.snapshot.data["inventoryRequest"]
        // };
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
    }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getInventoryRequestPaginated("completed");
    this.getInventoryRequestPaginated("rejected");
    this.getInventoryRequestPaginated("cancelled");

  }
  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = event;
    this.getInventoryRequestPaginated(table as any);
  }

  async pageChange(event: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = event.pageIndex;
    this.pageSize[table] = event.pageSize;
    await this.getInventoryRequestPaginated(table as any);
  }

  async sortChange(event: { active: string, direction: string }, table: string) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.inventoryRequest.find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getInventoryRequestPaginated(table as any)
  }

  async getInventoryRequestPaginated(table: "completed" | "rejected" | "cancelled"){
    try{
      let findIndex = this.filter[table].findIndex(x=>x.apiNotation === "branch.branchCode");
      if(findIndex >= 0) {
        this.filter[table][findIndex] = {
          "apiNotation": "branch.branchCode",
          "filter": this.currentUserProfile?.branch?.branchCode,
          "name": "branchCode",
          "type": "text"
        };
      } else {
        this.filter[table].push({
          "apiNotation": "branch.branchCode",
          "filter": this.currentUserProfile?.branch?.branchCode,
          "name": "branchCode",
          "type": "text"
        });
      }
      findIndex = this.filter[table].findIndex(x=>x.apiNotation === "requestStatus");
      if(findIndex >= 0) {
        this.filter[table][findIndex] = {
          "apiNotation": "requestStatus",
          "filter": table.toUpperCase(),
          "name": "requestStatus",
          "type": "text"
        };
      } else {
        this.filter[table].push({
          "apiNotation": "requestStatus",
          "filter": table.toUpperCase(),
          "name": "requestStatus",
          "type": "text"
        });
      }

      this.isLoading = true;
      this.spinner.show();
      await this.inventoryRequestService.getByAdvanceSearch({
        order: this.order[table],
        columnDef: this.filter[table],
        pageIndex: this.pageIndex[table],
        pageSize: this.pageSize[table]
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              inventoryRequestId: d.inventoryRequestId,
              inventoryRequestCode: d.inventoryRequestCode,
              dateRequested: d.dateRequested.toString(),
              requestStatus: d.requestStatus,
              fromWarehouse: d.fromWarehouse.name,
              branch: d.branch?.name,
              requestedByUser: d.requestedByUser?.fullName,
              url: `/inventory-request/closed-request/${d.inventoryRequestCode}/details`,
            } as InventoryRequestTableColumn
          });
          this.total[table] = res.data.total;
          this.dataSource[table] = new MatTableDataSource(data);
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

  onSelectedTabChange({ index }, redirect = true) {
    if(index === 1) {
      if(redirect) {
        this._location.go("/inventory-request/closed-request/rejected");
      }
      this.titleService.setTitle(`Rejected | ${this.appConfig.config.appName}`);
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/inventory-request/closed-request/cancelled");
      }
      this.titleService.setTitle(`Cancelled | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/inventory-request/closed-request/completed");
      }
      this.titleService.setTitle(`Completed | ${this.appConfig.config.appName}`);
    }
  }
}
