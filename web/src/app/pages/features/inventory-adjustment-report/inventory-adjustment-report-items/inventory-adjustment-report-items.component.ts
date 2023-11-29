import { Component, ElementRef, Input, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { InventoryAdjustmentReport, InventoryAdjustmentReportItem } from 'src/app/model/inventory-adjustment-report';
import { Item } from 'src/app/model/item';
import { InventoryAdjustmentReportService } from 'src/app/services/inventory-adjustment-report.service';
import { ItemService } from 'src/app/services/item.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { SelectItemDialogComponent } from 'src/app/shared/select-item-dialog/select-item-dialog.component';
import { InventoryAdjustmentReportItemTableColumn } from 'src/app/shared/utility/table';
import { ItemWarehouse } from 'src/app/model/item-warehouse';
import { WarehouseInventoryService } from 'src/app/services/warehouse-inventory.service';
export class WarehouseInventory extends ItemWarehouse {
  availableToRequest: string;
}
@Component({
  selector: 'app-inventory-adjustment-report-items',
  templateUrl: './inventory-adjustment-report-items.component.html',
  styleUrls: ['./inventory-adjustment-report-items.component.scss']
})
export class InventoryAdjustmentReportItemComponent {
  @Input() warehouseCode;
  isProcessing = false;
  accTotalRefund = 0;
  displayedColumns = ['itemName', 'itemCategory', 'quantityReceived', 'returnedQuantity', 'proposedUnitReturnRate', 'totalRefund', 'controls'];
  dataSource = new MatTableDataSource<InventoryAdjustmentReportItemTableColumn>();
  @Input() inventoryAdjustmentReport!: InventoryAdjustmentReport;
  @Input() isReadOnly = true;
  @Input() isNew = true;
  error;

  @Output() itemsChanged = new EventEmitter();
  constructor(
    private spinner: SpinnerVisibilityService,
    private inventoryAdjustmentReportService: InventoryAdjustmentReportService,
    private warehouseInventoryService: WarehouseInventoryService,
    private itemService: ItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,) {
  }


  ngAfterViewInit() {
  }

  computeAccTotalRefund() {
    this.accTotalRefund = this.dataSource.data.map(x=>x.totalRefund).reduce((curr, prev) => {
      return Number(curr) + Number(prev);
    });
  }

  init(data: InventoryAdjustmentReportItemTableColumn[]) {
    if(data) {
      this.dataSource = new MatTableDataSource(data);
      this.computeAccTotalRefund();
    }
  }

  updateRow(row: InventoryAdjustmentReportItemTableColumn) {
    if(Number(row?.returnedQuantity) > Number(row?.returnedQuantity)) {
      row.isInvalidReturnedQuantity = true;
    } else {
      row.isInvalidReturnedQuantity = false;
      row.isEditMode = false;
      row.isReturnedQuantityChanged = true;
      this.itemsChanged.emit(this.dataSource.data);
    }
  }

  remove(row: InventoryAdjustmentReportItemTableColumn) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = `Are you sure you want to remove ${row.itemName}? You can't recover this item later if you wish to update the report.`;
    dialogData.confirmButton = {
      visible: true,
      text: 'continue',
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
      const newRows = this.dataSource.data.filter(x=>x.itemId !== row.itemId).map(x=> {
        x.isReturnedQuantityChanged = true;
        x.isInvalidReturnedQuantity = false;
        return x;
      });
      this.dataSource = new MatTableDataSource(newRows);
      this.itemsChanged.emit(this.dataSource.data);
      dialogRef.close();
    });
  }

  toNumber(value: any = "0") {
    return isNaN(Number(value && value !== '' ? value.toString() : "0")) ? 0 : Number(value?.toString());
  }

}
