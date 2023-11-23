import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { InventoryRequestRate } from 'src/app/model/inventory-request-rate';
import { InventoryRequestRateService } from 'src/app/services/inventory-request-rate.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { InventoryRequestRateTableColumn } from 'src/app/shared/utility/table';
import { FormControl } from '@angular/forms';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/model/item';
import { Location } from '@angular/common';
import { SelectItemDialogComponent } from 'src/app/shared/select-item-dialog/select-item-dialog.component';

@Component({
  selector: 'app-inventory-request-rate',
  templateUrl: './inventory-request-rate.component.html',
  styleUrls: ['./inventory-request-rate.component.scss'],
  host: {
    class: "page-component"
  }
})
export class InventoryRequestRateComponent {
  currentUserId:string;
  error:string;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  order: any = { inventoryRequestRateCode: "DESC" };

  filter: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[] = [];

  selectedItem: Item;
  // pageInventoryRequestRate: InventoryRequestRate = {
  //   view: true,
  //   modify: false,
  // };

  @ViewChild('inventoryRequestRateFormDialog') inventoryRequestRateFormDialog: TemplateRef<any>;
  @ViewChild('inventoryRequestRateSelectDialog') inventoryRequestRateSelectDialog: TemplateRef<any>;
  inventoryRequestRateSelectDialogRef: MatDialogRef<any>;

  constructor(
    private spinner: SpinnerVisibilityService,
    private inventoryRequestRateService: InventoryRequestRateService,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _location: Location,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router) {
      this.dataSource = new MatTableDataSource([]);
      const itemCode = this.route.snapshot.paramMap.get('itemCode');
      if(itemCode) {
        this.initItem(itemCode);
      }
      if(this.route.snapshot.data) {
        // this.pageInventoryRequestRate = {
        //   ...this.pageInventoryRequestRate,
        //   ...this.route.snapshot.data["inventoryRequestRate"]
        // };
        if(this.route.snapshot.data["true"] && (!itemCode || itemCode === "" || itemCode.includes("null"))) {
          this.router.navigate(["/inventory-request-rate/"])
        }
      }
    }

  ngOnInit(): void {
    const profile = this.storageService.getLoginProfile();
    // this.currentUserId = profile && profile.userId;
  }

  ngAfterViewInit() {
    if(this.selectedItem) {
      this.getInventoryRequestRatePaginated();
    }

  }

  initItem(itemCode) {
    try{
      this.isLoading = true;
      this.spinner.show();
      this.itemService.getByCode(itemCode)
      .subscribe(async res => {
        if(res.success){
          this.selectedItem = res.data;
          this.isLoading = false;
          this.spinner.hide();
          this.getInventoryRequestRatePaginated();
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


  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]) {
    this.filter = event;
    this.getInventoryRequestRatePaginated();
  }

  async pageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getInventoryRequestRatePaginated();
  }

  async sortChange(event: { active: string, direction: string }) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.inventoryRequestRate.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction.toUpperCase());
    this.getInventoryRequestRatePaginated()
  }

  async getInventoryRequestRatePaginated(){
    try{
      const index = this.filter.findIndex(x=>x.name === "itemCode");
      if(index >= 0) {
        this.filter[index].filter = this.selectedItem?.itemCode;
      } else {
        this.filter.push({
          apiNotation: "item.itemCode",
          filter: this.selectedItem?.itemCode,
          name: "itemCode",
          type: "precise"
        })
      }
      this.isLoading = true;
      this.spinner.show();
      this.inventoryRequestRateService.getByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex, pageSize: this.pageSize
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              inventoryRequestRateId: d.inventoryRequestRateId,
              inventoryRequestRateCode: d.inventoryRequestRateCode,
              rate: d.rate,
              rateName: d.rateName,
              minQuantity: d.minQuantity,
              maxQuantity: d.maxQuantity,
              url: `/inventory-request-rate/${d.inventoryRequestRateCode}`,
            } as InventoryRequestRateTableColumn
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
    this.dialog.open(this.inventoryRequestRateFormDialog)
  }

  showSelectItemDialog() {

    const dialogRef = this.dialog.open(SelectItemDialogComponent, {
        disableClose: true,
        panelClass: "select-item-dialog"
    });
    dialogRef.componentInstance.selected = {
      itemId: this.selectedItem?.itemId,
      itemCode: this.selectedItem?.itemCode,
      itemName: this.selectedItem?.itemName,
      itemCategory: this.selectedItem?.itemCategory.name,
      selected: true
    }
    dialogRef.afterClosed().subscribe((res:Item)=> {
      console.log(res);
      if(res) {
        this.selectedItem = res;
        this._location.go("/inventory-request-rate/find/" + res?.itemCode);
        this.getInventoryRequestRatePaginated();
      }
    })
  }

  closeNewInventoryRequestRateDialog() {
    this.dialog.closeAll();
  }

  saveNewInventoryRequestRate(formData) {
    if(!this.selectedItem?.itemId || this.selectedItem?.itemId === "") {
      this.snackBar.open('No item selected!', 'close', {
        panelClass: ['style-error'],
      });
    }
    formData = {
      ...formData,
      itemId: this.selectedItem.itemId
    };
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
        let res = await this.inventoryRequestRateService.create(formData).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.dialog.closeAll();
          this.router.navigate(['/inventory-request-rate/' + res.data.inventoryRequestRateCode]);
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
