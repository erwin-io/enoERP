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
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { CustomSocket } from 'src/app/sockets/custom-socket.sockets';

@Component({
  selector: 'app-inventory-request',
  templateUrl: './inventory-request.component.html',
  styleUrls: ['./inventory-request.component.scss'],
  host: {
    class: "page-component"
  }
})
export class InventoryRequestComponent {
  tabIndex = 0;
  currentUserProfile:Users;
  error:string;
  dataSource = {
    pending: new MatTableDataSource<any>([]),
    processing: new MatTableDataSource<any>([]),
    'in-transit': new MatTableDataSource<any>([]),
  }
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    pending: 0,
    processing: 0,
    'in-transit': 0,
  };
  pageSize = {
    pending: 10,
    processing: 10,
    'in-transit': 10,
  };
  total = {
    pending: 0,
    processing: 0,
    'in-transit': 0,
  };
  order = {
    pending: { inventoryRequestId: "ASC" },
    processing: { inventoryRequestId: "DESC" },
    'in-transit': { inventoryRequestId: "DESC" },
  };

  filter = {
    pending: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    processing: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    'in-transit': [] as {
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

  @ViewChild('inventoryRequestFormDialog') inventoryRequestFormDialogTemp: TemplateRef<any>;
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
    public router: Router,
    private socket: CustomSocket) {
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
    this.socket.removeListener('inventoryRequestChanges');
    this.socket.fromEvent('reSync').subscribe(async (res: any) => {
      const { type, data } = res;
      if(type && type === "INVENTORY_REQUEST") {
        this.getInventoryRequestPaginated("pending", false);
        this.getInventoryRequestPaginated("processing", false);
        this.getInventoryRequestPaginated("in-transit", false);
      }
    });
  }

  ngAfterViewInit() {
    this.getInventoryRequestPaginated("pending");
    this.getInventoryRequestPaginated("processing");
    this.getInventoryRequestPaginated("in-transit");

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

  async getInventoryRequestPaginated(table: "pending" | "processing" | "in-transit",  showProgress = true){
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
      if(showProgress === true) {
        this.spinner.show();
      }
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
              url: `/inventory-request/${d.inventoryRequestCode}/details`,
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
        this._location.go("/inventory-request/processing");
      }
      this.titleService.setTitle(`Processing | ${this.appConfig.config.appName}`);
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/inventory-request/in-transit");
      }
      this.titleService.setTitle(`In-Transit | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/inventory-request/pending");
      }
      this.titleService.setTitle(`Pending | ${this.appConfig.config.appName}`);
    }
  }
}
