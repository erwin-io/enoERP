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
import { SalesInvoicePaymentsTableColumn } from 'src/app/shared/utility/table';
import { ItemWarehouse } from 'src/app/model/item-warehouse';
import { WarehouseInventoryService } from 'src/app/services/warehouse-inventory.service';
import { SalesInvoice } from 'src/app/model/sales-invoice';
export class WarehouseInventory extends ItemWarehouse {
  availableToRequest: string;
}
@Component({
  selector: 'app-sales-invoice-payments',
  templateUrl: './sales-invoice-payments.component.html',
  styleUrls: ['./sales-invoice-payments.component.scss']
})
export class SalesInvoicePaymentsComponent {
  @Input() branchCode;
  @Input() isReadOnly = true;
  @Input() isNew;
  @Input() totalAmount = 0;
  isProcessing = false;
  accTotalPayments = 0;
  displayedColumns = ['payment', 'controls'];
  dataSource = new MatTableDataSource<SalesInvoicePaymentsTableColumn>();
  @Input() salesInvoice!: SalesInvoice;
  error;
  hasChanges = false;

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

  computeAccTotalPayments() {
    this.accTotalPayments = this.dataSource.data.length > 0 ? this.dataSource.data.map(x=>x.amount).reduce((curr, prev) => {
      return Number(curr) + Number(prev);
    }) : 0;
  }

  init(data: SalesInvoicePaymentsTableColumn[]) {
    if(data) {
      this.dataSource = new MatTableDataSource(data);
      this.computeAccTotalPayments();
    }
  }

  paymentTypeChange(index, row: SalesInvoicePaymentsTableColumn) {
    row.isPaymentTypeChanged = true;
    const items = this.dataSource.data;
    if(!row.paymentType || row.paymentType === '' || items.some((x, i)=> i !== index && x.paymentType === row.paymentType)) {
      row.isInvalidPaymentType = true;
    } else {
      row.isInvalidPaymentType = false;
    }
    console.log(this.dataSource.data);
  }

  updateRow(index, row: SalesInvoicePaymentsTableColumn) {
    const items = this.dataSource.data;
    if(!row.paymentType || row.paymentType === '' || ![
      "CASH",
      "CREDIT CARD",
      "DEBIT CARD",
      "MOBILE PAYMENT",
      "CHECK",
    ].some(x=> row?.paymentType === x) || items.some((x, i)=> i !== index && x.paymentType === row.paymentType)) {
      row.isInvalidPaymentType = true;
    } else if(Number(row?.amount) <= 0) {
      row.isInvalidAmount = true;
    } else {
      row.isInvalidAmount = false;
      row.isInvalidPaymentType = false;
      row.isEditMode = false;
      row.isAmountChanged = true;
      this.computeAccTotalPayments();
      this.itemsChanged.emit(this.dataSource.data);
    }
    this.hasChanges = true;
  }

  toNumber(value: any = "0") {
    return isNaN(Number(value && value !== '' ? value.toString() : "0")) ? 0 : Number(value?.toString());
  }

  addRow() {
    const items = this.dataSource.data;
    items.push({
      paymentType: "",
      isInvalidPaymentType: true,
      isPaymentTypeChanged: false,
      amount: 0,
      isInvalidAmount: false,
      isAmountChanged: false,
      isEditMode: true,
    });
    this.computeAccTotalPayments();
    this.dataSource = new MatTableDataSource(items);
  }

  remove(index) {
    const items = this.dataSource.data.filter((r, i)=> index !== i);
    this.dataSource = new MatTableDataSource(items);
    this.computeAccTotalPayments();
    this.itemsChanged.emit(this.dataSource.data);
    this.hasChanges = true;
  }

}
