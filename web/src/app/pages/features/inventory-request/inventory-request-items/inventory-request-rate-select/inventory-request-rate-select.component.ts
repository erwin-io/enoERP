import { Component, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Item } from 'src/app/model/item';
import { InventoryRequestRateService } from 'src/app/services/inventory-request-rate.service';
export class SelectInventoryRequestRateDialogTableColumn {
  inventoryRequestRateId: string;
  inventoryRequestRateCode: string;
  rate: string;
  rateName: string;
  minQuantity: string;
  maxQuantity: string;
  baseRate: boolean;
  selected: boolean
}
@Component({
  selector: 'app-inventory-request-rate-select',
  templateUrl: './inventory-request-rate-select.component.html',
  styleUrls: ['./inventory-request-rate-select.component.scss']
})
export class InventoryRequestRateSelectComponent {
  item:Item;
  displayedColumns = ["selected", "rate", "rateName", "minQuantity", "maxQuantity" ]
  dataSource = new MatTableDataSource<SelectInventoryRequestRateDialogTableColumn>();
  selected: SelectInventoryRequestRateDialogTableColumn;
  doneSelect = new EventEmitter();

  filterRate = "0 - 100";
  filterRateName = "";
  filterMinQuantity = "0 - 100";
  filterMaxQuantity = "0 - 100";

  constructor(
    private inventoryRequestRateService: InventoryRequestRateService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InventoryRequestRateSelectComponent>
    ) {
  }

  ngAfterViewInit(): void {
    this.init();
  }

  init() {
    const filter: any[] = [
      {
        apiNotation: "item.itemCode",
        filter: this.item?.itemCode,
        type: "precise"
      },
      {
        apiNotation: "rate",
        filter: this.filterRate,
        type: "number-range"
      },
      {
        apiNotation: "rateName",
        filter: this.filterRateName
      },
      {
        apiNotation: "minQuantity",
        filter: this.filterMinQuantity,
        type: "number-range"
      },
      {
        apiNotation: "maxQuantity",
        filter: this.filterMaxQuantity,
        type: "number-range"
      },
    ];
    try {
      this.inventoryRequestRateService.getByAdvanceSearch({
        order: {},
        columnDef: filter,
        pageIndex: 0,
        pageSize: 10
      }).subscribe(res=> {
        this.dataSource = new MatTableDataSource(res.data.results.map(x=> {
          return {
            inventoryRequestRateId: x.inventoryRequestRateId,
            inventoryRequestRateCode: x.inventoryRequestRateCode,
            rate:  x.rate,
            rateName:  x.rateName,
            minQuantity:  x.minQuantity,
            maxQuantity:  x.maxQuantity,
            baseRate: x.baseRate,
            selected: this.selected?.inventoryRequestRateCode === x.inventoryRequestRateCode
          }
        }));

      });
    }catch(ex) {

    }
  }

  isSelected(item: SelectInventoryRequestRateDialogTableColumn) {
    return this.dataSource.data.find(x=>x.inventoryRequestRateCode === item.inventoryRequestRateCode && x.selected) ? true : false;
  }

  selectionChange(currentItem: SelectInventoryRequestRateDialogTableColumn, selected) {
    const items = this.dataSource.data;
    if(selected) {
      for(var item of items) {
        item.selected = currentItem.inventoryRequestRateCode === item.inventoryRequestRateCode;
      }
    }
    else {
      const items = this.dataSource.data;
      for(var item of items) {
        item.selected = false;
      }
    }
    this.dataSource = new MatTableDataSource<SelectInventoryRequestRateDialogTableColumn>(items);
    console.log("selected", this.dataSource.data);
    this.selected = this.dataSource.data.find(x=>x.selected);
  }

  async doneSelection() {
    try {
      this.spinner.show();
      const res = await this.inventoryRequestRateService.getByCode(this.selected.inventoryRequestRateCode).toPromise();
      this.spinner.hide();
      if(res.success) {
        this.dialogRef.close(res.data);
      } else {
        const error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(error, 'close', {panelClass: ['style-error']});
      }
    } catch(ex) {
      const error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(error, 'close', {panelClass: ['style-error']});
      this.spinner.hide();
    }
  }
}
