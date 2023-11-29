import { Component, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { InventoryRequestRateService } from 'src/app/services/inventory-request-rate.service';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
export class SelectInventoryRequestDialogTableColumn {
  inventoryRequestId?: string;
  inventoryRequestCode?: string;
  dateRequested?: string;
  fromWarehouse?: string;
  requestedByUser?: string;
  selected?: boolean
}
@Component({
  selector: 'app-inventory-adjustment-report-request-select',
  templateUrl: './inventory-adjustment-report-request-select.component.html',
  styleUrls: ['./inventory-adjustment-report-request-select.component.scss']
})
export class InventoryAdjustmentReportRequestSelectComponent {
  displayedColumns = ["selected", "inventoryRequestCode", "dateRequested", "fromWarehouse", "requestedByUser" ]
  dataSource = new MatTableDataSource<SelectInventoryRequestDialogTableColumn>();
  selected: SelectInventoryRequestDialogTableColumn;
  doneSelect = new EventEmitter();
  defaultDate = new Date();

  filterInventoryRequestCode = "";
  filteDateRequested= "";
  filteFromWarehouse = "";
  filteRequestedByUser = "";

  constructor(
    private inventoryRequestService: InventoryRequestService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InventoryAdjustmentReportRequestSelectComponent>
    ) {
  }

  ngAfterViewInit(): void {
    this.init();
  }

  init() {
    const filter: any[] = [
      {
        apiNotation: "inventoryRequestCode",
        filter: this.filterInventoryRequestCode,
      },
      {
        apiNotation: "dateRequested",
        filter: this.filteDateRequested,
        type: "date-range"
      },
      {
        apiNotation: "fromWarehouse.name",
        filter: this.filteFromWarehouse
      },
      {
        apiNotation: "requestedByUser.fullName",
        filter: this.filteRequestedByUser
      },
      {
        apiNotation: "requestStatus",
        filter: "COMPLETED"
      },
      {
        type: "number-range",
        apiNotation: "inventoryRequestItems.quantityReceived",
        filter: "1-10000000000"
      },
    ];
    try {
      this.inventoryRequestService.getByAdvanceSearch({
        order: {},
        columnDef: filter,
        pageIndex: 0,
        pageSize: 10
      }).subscribe(res=> {
        this.dataSource = new MatTableDataSource(res.data.results.map(x=> {
          return {
            inventoryRequestId: x.inventoryRequestId,
            inventoryRequestCode: x.inventoryRequestCode,
            dateRequested: x.dateRequested.toString(),
            fromWarehouse: x.fromWarehouse.name,
            requestedByUser: x.requestedByUser.fullName,
            selected: false,
          } as SelectInventoryRequestDialogTableColumn
        }));

      });
    }catch(ex) {

    }
  }

  formatDateRange(from, to) {
    from = from && from !== "" ? moment(from).format("YYYY-MM-DD") : "";
    to = to && to !== "" ? moment(to).format("YYYY-MM-DD") : "";
    return `${from},${to}`;
  }


  isSelected(row: SelectInventoryRequestDialogTableColumn) {
    return this.dataSource.data.find(x=>x.inventoryRequestCode === row.inventoryRequestCode && x.selected) ? true : false;
  }

  selectionChange(currentRow: SelectInventoryRequestDialogTableColumn, selected) {
    let rows = this.dataSource.data;
    if(selected) {
      for(var row of rows) {
        row.selected = currentRow.inventoryRequestCode === row.inventoryRequestCode;
      }
    }
    else {
      rows = this.dataSource.data;
      for(var row of rows) {
        row.selected = false;
      }
    }
    this.dataSource = new MatTableDataSource<SelectInventoryRequestDialogTableColumn>(rows);
    console.log("selected", this.dataSource.data);
    this.selected = this.dataSource.data.find(x=>x.selected);
  }

  async doneSelection() {
    try {
      this.spinner.show();
      const res = await this.inventoryRequestService.getByCode(this.selected.inventoryRequestCode).toPromise();
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

  toNumber(value: any = "0") {
    return isNaN(Number(value ? value.toString() : "0")) ? 0 : Number(value.toString());
  }
}
