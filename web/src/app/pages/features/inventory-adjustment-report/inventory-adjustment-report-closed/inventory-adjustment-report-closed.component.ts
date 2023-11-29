import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Users } from 'src/app/model/users';
import { AppConfigService } from 'src/app/services/app-config.service';
import { InventoryAdjustmentReportService } from 'src/app/services/inventory-adjustment-report.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { InventoryAdjustmentReportTableColumn } from 'src/app/shared/utility/table';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { Location } from '@angular/common';

@Component({
  selector: 'app-inventory-adjustment-report-closed',
  templateUrl: './inventory-adjustment-report-closed.component.html',
  styleUrls: ['./inventory-adjustment-report-closed.component.scss'],
  host: {
    class: "page-component"
  }
})
export class InventoryAdjustmentReportClosedComponent {
  tabIndex = 0;
  currentUserProfile: Users;
  error:string;
  dataSource = {
    closed: new MatTableDataSource<any>([]),
    rejected: new MatTableDataSource<any>([]),
    cancelled: new MatTableDataSource<any>([]),
  }
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    closed: 0,
    rejected: 0,
    cancelled: 0,
  };
  pageSize = {
    closed: 10,
    rejected: 10,
    cancelled: 10,
  };
  total = {
    closed: 0,
    rejected: 0,
    cancelled: 0,
  };
  order = {
    closed: { inventoryAdjustmentReportId: "DESC" },
    rejected: { inventoryAdjustmentReportId: "DESC" },
    cancelled: { inventoryAdjustmentReportId: "DESC" },
  };

  filter = {
    closed: [] as {
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
  // pageInventoryAdjustmentReport: InventoryAdjustmentReport = {
  //   view: true,
  //   modify: false,
  // };

  constructor(
    private spinner: SpinnerVisibilityService,
    private inventoryAdjustmentReportService: InventoryAdjustmentReportService,
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
        // this.pageInventoryAdjustmentReport = {
        //   ...this.pageInventoryAdjustmentReport,
        //   ...this.route.snapshot.data["inventoryAdjustmentReport"]
        // };
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
    }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getInventoryAdjustmentReportPaginated("closed");
    this.getInventoryAdjustmentReportPaginated("rejected");
    this.getInventoryAdjustmentReportPaginated("cancelled");

  }
  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = event;
    this.getInventoryAdjustmentReportPaginated(table as any);
  }

  async pageChange(event: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = event.pageIndex;
    this.pageSize[table] = event.pageSize;
    await this.getInventoryAdjustmentReportPaginated(table as any);
  }

  async sortChange(event: { active: string, direction: string }, table: string) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.inventoryAdjustmentReport.find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getInventoryAdjustmentReportPaginated(table as any)
  }

  async getInventoryAdjustmentReportPaginated(table: "closed" | "rejected" | "cancelled"){
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
      findIndex = this.filter[table].findIndex(x=>x.apiNotation === "reportStatus");
      if(findIndex >= 0) {
        this.filter[table][findIndex] = {
          "apiNotation": "reportStatus",
          "filter": table.toUpperCase(),
          "name": "reportStatus",
          "type": "text"
        };
      } else {
        this.filter[table].push({
          "apiNotation": "reportStatus",
          "filter": table.toUpperCase(),
          "name": "reportStatus",
          "type": "text"
        });
      }

      this.isLoading = true;
      this.spinner.show();
      await this.inventoryAdjustmentReportService.getByAdvanceSearch({
        order: this.order[table],
        columnDef: this.filter[table],
        pageIndex: this.pageIndex[table],
        pageSize: this.pageSize[table]
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              inventoryAdjustmentReportId: d.inventoryAdjustmentReportId,
              inventoryAdjustmentReportCode: d.inventoryAdjustmentReportCode,
              dateReported: d.dateReported.toString(),
              reportType: d.reportType,
              reportedByUser: d.reportedByUser?.fullName,
              url: `/inventory-adjustment-report/closed-report/${d.inventoryAdjustmentReportCode}/details`,
            } as InventoryAdjustmentReportTableColumn
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
        this._location.go("/inventory-adjustment-report/closed-report/rejected");
      }
      this.titleService.setTitle(`Rejected | ${this.appConfig.config.appName}`);
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/inventory-adjustment-report/closed-report/cancelled");
      }
      this.titleService.setTitle(`Cancelled | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/inventory-adjustment-report/closed-report/closed");
      }
      this.titleService.setTitle(`Closed | ${this.appConfig.config.appName}`);
    }
  }
}
