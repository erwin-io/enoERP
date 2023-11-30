import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { SalesInvoiceService } from 'src/app/services/sales-invoice.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { SalesInvoiceTableColumn } from 'src/app/shared/utility/table';
import { Users } from 'src/app/model/users';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.scss'],
  host: {
    class: "page-component"
  }
})
export class SalesInvoiceComponent {
  currentUserProfile:Users;
  error:string;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  order = { salesInvoiceId: "DESC" };
  showVoid = false;

  filter = [] as {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[];
  // pageAccess: SalesInvoice = {
  //   view: true,
  //   modify: false,
  // };

  @ViewChild('salesInvoiceFormDialog') salesInvoiceFormDialogTemp: TemplateRef<any>;
  constructor(
    private spinner: SpinnerVisibilityService,
    private salesInvoiceService: SalesInvoiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private titleService: Title,
    private _location: Location,
    public router: Router) {
      const { showVoid } = this.route.snapshot.data;
      this.showVoid = showVoid;
      this.currentUserProfile = this.storageService.getLoginProfile();
      if(this.route.snapshot.data) {
        // this.pageAccess = {
        //   ...this.pageSalesInvoice,
        //   ...this.route.snapshot.data["salesInvoice"]
        // };
      }
    }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getSalesInvoicePaginated();

  }
  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]) {
    this.filter = event;
    this.getSalesInvoicePaginated();
  }

  async pageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getSalesInvoicePaginated();
  }

  async sortChange(event: { active: string, direction: string }) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.salesInvoice.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getSalesInvoicePaginated()
  }

  async getSalesInvoicePaginated(){
    try{
      let findIndex = this.filter.findIndex(x=>x.apiNotation === "branch.branchCode");
      if(findIndex >= 0) {
        this.filter[findIndex] = {
          "apiNotation": "branch.branchCode",
          "filter": this.currentUserProfile?.branch?.branchCode,
          "name": "branchCode",
          "type": "text"
        };
      } else {
        this.filter.push({
          "apiNotation": "branch.branchCode",
          "filter": this.currentUserProfile?.branch?.branchCode,
          "name": "branchCode",
          "type": "text"
        });
      }
      findIndex = this.filter.findIndex(x=>x.apiNotation === "isVoid");
      if(findIndex >= 0) {
        this.filter[findIndex] = {
          "apiNotation": "isVoid",
          "filter": this.showVoid ? "yes" : "no",
          "name": "isVoid",
          "type": "option-yes-no"
        };
      } else {
        this.filter.push({
          "apiNotation": "isVoid",
          "filter": this.showVoid ? "yes" : "no",
          "name": "isVoid",
          "type": "option-yes-no"
        });
      }

      this.isLoading = true;
      this.spinner.show();
      await this.salesInvoiceService.getByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              salesInvoiceId: d.salesInvoiceId,
              salesInvoiceCode: d.salesInvoiceCode,
              salesDate: d.salesDate.toString(),
              branch: d.branch.name,
              createdByUser: d.createdByUser?.fullName,
              totalAmount: d.totalAmount,
              url: `/sales-invoice/${d.salesInvoiceCode}/details`,
            } as SalesInvoiceTableColumn
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
}
