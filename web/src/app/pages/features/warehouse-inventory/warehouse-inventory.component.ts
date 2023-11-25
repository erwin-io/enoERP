import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { WarehouseInventoryService } from 'src/app/services/warehouse-inventory.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { WarehouseInventoryTableColumn } from 'src/app/shared/utility/table';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Users } from 'src/app/model/users';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-warehouse-inventory',
  templateUrl: './warehouse-inventory.component.html',
  styleUrls: ['./warehouse-inventory.component.scss'],
  host: {
    class: "page-component"
  }
})
export class WarehouseInventoryComponent {
  currentUserProfile:Users;
  error:string;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  order: any = { itemId: "DESC" };

  filter: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[] = [];

  warehouseCode = new FormControl();
  isOptionsWarehouseLoading = false;
  optionWarehouse: {code: string; name: string}[] = [];
  warehouseSearchCtrl = new FormControl();
  @ViewChild('warehouseSearchInput', { static: true}) warehouseSearchInput: ElementRef<HTMLInputElement>;
  constructor(
    private spinner: SpinnerVisibilityService,
    private warehouseInventoryService: WarehouseInventoryService,
    private warehouseService: WarehouseService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router) {
      this.currentUserProfile = this.storageService.getLoginProfile();
      this.dataSource = new MatTableDataSource([]);
      if(this.route.snapshot.data) {
      }
    }

  async ngOnInit(): Promise<void> {
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
      await this.getWarehouseInventoryPaginated();
    });
  }

  async initWarehouseOptions() {
    try {
      this.isOptionsWarehouseLoading = true;
      const res = await this.warehouseService.getByAdvanceSearch({
        order: {},
        columnDef: [{
          apiNotation: "name",
          filter: this.warehouseSearchInput.nativeElement.value
        }],
        pageIndex: 0,
        pageSize: 10
      }).toPromise();
      if(res.success) {
        this.optionWarehouse = res.data.results.map(a=> { return { name: a.name, code: a.warehouseCode }});
        this.isOptionsWarehouseLoading = false;
      } else {
        this.error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isOptionsWarehouseLoading = false;
      }
    } catch (err) {
      this.error = Array.isArray(err.message) ? err.message[0] : err.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isOptionsWarehouseLoading = false;
    }
  }

  displayWarehouseName(value?: number) {
    return value ? this.optionWarehouse.find(_ => _.code === value?.toString())?.name : undefined;
  }

  async ngAfterViewInit() {
    this.getWarehouseInventoryPaginated();
    this.initWarehouseOptions();
    this.warehouseSearchCtrl.setValue(this.warehouseCode.value);
  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]) {
    this.filter = event;
    this.getWarehouseInventoryPaginated();
  }

  async pageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getWarehouseInventoryPaginated();
  }

  async sortChange(event: { active: string, direction: string }) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.warehouseInventory.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction.toUpperCase());
    this.getWarehouseInventoryPaginated()
  }

  async getWarehouseInventoryPaginated(){
    try{

      const key = "warehouse.warehouseCode"
      const filter = {
        "apiNotation": key,
        "filter": this.warehouseCode.value,
        "name": "warehouseCode",
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
      this.warehouseInventoryService.getByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex, pageSize: this.pageSize
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              itemId: d.itemId,
              itemCode: d.item.itemCode,
              itemName: d.item.itemDescription,
              itemDescription: d.item.itemDescription,
              itemCategory: d.item.itemCategory.name,
              warehouse: d.warehouse.name,
              quantity: d.quantity,
              orderedQuantity: d.orderedQuantity,
            } as WarehouseInventoryTableColumn
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

  closeNewWarehouseInventoryDialog() {
    this.dialog.closeAll();
  }
}
