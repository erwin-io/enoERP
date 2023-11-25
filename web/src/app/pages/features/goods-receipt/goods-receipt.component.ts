import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { GoodsReceiptService } from 'src/app/services/goods-receipt.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { GoodsReceiptTableColumn } from 'src/app/shared/utility/table';
import { Users } from 'src/app/model/users';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.scss'],
  host: {
    class: "page-component"
  }
})
export class GoodsReceiptComponent {
  tabIndex = 0;
  currentUserProfile:Users;
  error:string;
  dataSource = {
    pending: new MatTableDataSource<any>([]),
    completed: new MatTableDataSource<any>([]),
    rejected: new MatTableDataSource<any>([]),
    cancelled: new MatTableDataSource<any>([]),
  }
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    pending: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0,
  };
  pageSize = {
    pending: 10,
    completed: 10,
    rejected: 10,
    cancelled: 10,
  };
  total = {
    pending: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0,
  };
  order = {
    pending: { goodsReceiptId: "ASC" },
    completed: { goodsReceiptId: "DESC" },
    rejected: { goodsReceiptId: "DESC" },
    cancelled: { goodsReceiptId: "DESC" },
  };

  filter = {
    pending: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
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
  // pageGoodsReceipt: GoodsReceipt = {
  //   view: true,
  //   modify: false,
  // };

  @ViewChild('goodsReceiptFormDialog') goodsReceiptFormDialogTemp: TemplateRef<any>;
  constructor(
    private spinner: SpinnerVisibilityService,
    private goodsReceiptService: GoodsReceiptService,
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
        // this.pageGoodsReceipt = {
        //   ...this.pageGoodsReceipt,
        //   ...this.route.snapshot.data["goodsReceipt"]
        // };
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
    }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getGoodsReceiptPaginated("pending");
    this.getGoodsReceiptPaginated("completed");
    this.getGoodsReceiptPaginated("rejected");
    this.getGoodsReceiptPaginated("cancelled");

  }
  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = event;
    this.getGoodsReceiptPaginated(table as any);
  }

  async pageChange(event: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = event.pageIndex;
    this.pageSize[table] = event.pageSize;
    await this.getGoodsReceiptPaginated(table as any);
  }

  async sortChange(event: { active: string, direction: string }, table: string) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.goodsReceipt.find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getGoodsReceiptPaginated(table as any)
  }

  async getGoodsReceiptPaginated(table: "pending" | "completed" | "rejected" | "cancelled"){
    try{
      const findIndex = this.filter[table].findIndex(x=>x.apiNotation === "status");
      if(findIndex >= 0) {
        this.filter[table][findIndex] = {
          "apiNotation": "status",
          "filter": table.toUpperCase(),
          "name": "status",
          "type": "text"
        };
      } else {
        this.filter[table].push({
          "apiNotation": "status",
          "filter": table.toUpperCase(),
          "name": "status",
          "type": "text"
        });
      }

      this.isLoading = true;
      this.spinner.show();
      await this.goodsReceiptService.getByAdvanceSearch({
        order: this.order[table],
        columnDef: this.filter[table],
        pageIndex: this.pageIndex[table],
        pageSize: this.pageSize[table]
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              goodsReceiptId: d.goodsReceiptId,
              goodsReceiptCode: d.goodsReceiptCode,
              dateCreated: d.dateCreated.toString(),
              status: d.status,
              warehouse: d.warehouse.name,
              supplier: d.supplier.name,
              createdByUser: d.createdByUser?.fullName,
              url: `/goods-receipt/${d.goodsReceiptCode}/details`,
            } as GoodsReceiptTableColumn
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

  showAddDialog() {
    this.dialog.open(this.goodsReceiptFormDialogTemp)
  }

  closeNewGoodsReceiptDialog() {
    this.dialog.closeAll();
  }

  saveNewGoodsReceipt(formData) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Save goods receipt?';
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
        let res = await this.goodsReceiptService.create(formData).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.dialog.closeAll();
          this.router.navigate(['/goods-receipt/' + res.data.goodsReceiptId]);
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

  onSelectedTabChange({ index }, redirect = true) {
    if(index === 1) {
      if(redirect) {
        this._location.go("/goods-receipt/completed");
      }
      this.titleService.setTitle(`Completed | ${this.appConfig.config.appName}`);
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/goods-receipt/rejected");
      }
      this.titleService.setTitle(`Rejected | ${this.appConfig.config.appName}`);
    } else if(index === 3) {
      if(redirect) {
        this._location.go("/goods-receipt/cancelled");
      }
      this.titleService.setTitle(`Cancelled | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/goods-receipt/pending");
      }
      this.titleService.setTitle(`Pending | ${this.appConfig.config.appName}`);
    }
  }
}
