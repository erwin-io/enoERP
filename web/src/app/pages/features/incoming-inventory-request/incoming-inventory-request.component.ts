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
import { IncomingInventoryRequestTableColumn } from 'src/app/shared/utility/table';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-incoming-inventory-request',
  templateUrl: './incoming-inventory-request.component.html',
  styleUrls: ['./incoming-inventory-request.component.scss'],
  host: {
    class: "page-component"
  }
})
export class IncomingInventoryRequestComponent {
  tabIndex = 0;
  currentUserId:string;
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

  // pageIncomingInventoryRequest: IncomingInventoryRequest = {
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
      this.tabIndex = this.route.snapshot.data["tab"];
      if(this.route.snapshot.data) {
        // this.pageIncomingInventoryRequest = {
        //   ...this.pageIncomingInventoryRequest,
        //   ...this.route.snapshot.data["incomingInventoryRequest"]
        // };
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
    }

  ngOnInit(): void {
    const profile = this.storageService.getLoginProfile();
    // this.currentUserId = profile && profile.userId;
  }

  ngAfterViewInit() {
    this.getIncomingInventoryRequestPaginated("pending");
    this.getIncomingInventoryRequestPaginated("processing");
    this.getIncomingInventoryRequestPaginated("in-transit");

  }
  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = event;
    this.getIncomingInventoryRequestPaginated(table as any);
  }

  async pageChange(event: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = event.pageIndex;
    this.pageSize[table] = event.pageSize;
    await this.getIncomingInventoryRequestPaginated(table as any);
  }

  async sortChange(event: { active: string, direction: string }, table: string) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.inventoryRequest.find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getIncomingInventoryRequestPaginated(table as any)
  }

  getIncomingInventoryRequestPaginated(table: "pending" | "processing" | "in-transit"){
    try{
      const findIndex = this.filter[table].findIndex(x=>x.apiNotation === "requestStatus");
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
      this.inventoryRequestService.getByAdvanceSearch({
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
              branch: d.branch.name,
              requestedByUser: d.requestedByUser.fullName,
              url: `/incoming-inventory-request/${d.inventoryRequestCode}/details`,
            } as IncomingInventoryRequestTableColumn
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
        this._location.go("/incoming-inventory-request/processing");
      }
      this.titleService.setTitle(`Processing | ${this.appConfig.config.appName}`);
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/incoming-inventory-request/in-transit");
      }
      this.titleService.setTitle(`In-Transit | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/incoming-inventory-request/pending");
      }
      this.titleService.setTitle(`Pending | ${this.appConfig.config.appName}`);
    }
  }
}
