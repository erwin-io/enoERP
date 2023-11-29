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
import { AdjustmentConfirmationItemTableColumn } from 'src/app/shared/utility/table';
import { ItemWarehouse } from 'src/app/model/item-warehouse';
import { WarehouseInventoryService } from 'src/app/services/warehouse-inventory.service';
export class WarehouseInventory extends ItemWarehouse {
  availableToRequest: string;
}
@Component({
  selector: 'app-adjustment-confirmation-items',
  templateUrl: './adjustment-confirmation-items.component.html',
  styleUrls: ['./adjustment-confirmation-items.component.scss']
})
export class AdjustmentConfirmationItemComponent {
  @Input() warehouseCode;
  isProcessing = false;
  accTotalRefund = 0;
  displayedColumns = ['itemName', 'itemCategory', 'quantityReceived', 'returnedQuantity', 'proposedUnitReturnRate', 'totalRefund', 'controls'];
  dataSource = new MatTableDataSource<AdjustmentConfirmationItemTableColumn>();
  @Input() inventoryAdjustmentReport!: InventoryAdjustmentReport;
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

  get isReadOnly() {
    return !this.inventoryAdjustmentReport || !["PENDING", "REVIEWED"].some(x=> x === this.inventoryAdjustmentReport.reportStatus);
  }


  ngAfterViewInit() {
  }

  computeAccTotalRefund() {
    this.accTotalRefund = this.dataSource.data.map(x=>x.totalRefund).reduce((curr, prev) => {
      return Number(curr) + Number(prev);
    });
  }

  init(data: AdjustmentConfirmationItemTableColumn[]) {
    if(data) {
      this.dataSource = new MatTableDataSource(data);
      this.computeAccTotalRefund();
    }
  }

  updateRow(row: AdjustmentConfirmationItemTableColumn) {
    if(Number(row?.proposedUnitReturnRate) <= 0) {
      row.isInvalidProposedUnitReturnRate = true;
    } else {
      row.isInvalidProposedUnitReturnRate = false;
      row.isEditMode = false;
      row.isProposedUnitReturnRateChanged = true;
      row.totalRefund = Number(row?.proposedUnitReturnRate) * Number(row?.returnedQuantity);
      this.computeAccTotalRefund();
      this.itemsChanged.emit(this.dataSource.data);
    }
  }

  toNumber(value: any = "0") {
    return isNaN(Number(value && value !== '' ? value.toString() : "0")) ? 0 : Number(value?.toString());
  }

}
