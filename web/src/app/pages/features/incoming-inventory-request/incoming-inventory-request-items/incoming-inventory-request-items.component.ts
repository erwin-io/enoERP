import { Component, ElementRef, Input, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InventoryRequest, InventoryRequestItem } from 'src/app/model/inventory-request';
import { InventoryRequestService } from 'src/app/services/inventory-request.service';
import { ItemService } from 'src/app/services/item.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { InventoryRequestItemTableColumn } from 'src/app/shared/utility/table';

@Component({
  selector: 'app-incoming-inventory-request-items',
  templateUrl: './incoming-inventory-request-items.component.html',
  styleUrls: ['./incoming-inventory-request-items.component.scss']
})
export class IncomingInventoryRequestItemComponent {
  id;
  isProcessing = false;
  isNew = false;
  accTotalAmount = 0;
  displayedColumns = ['itemName', 'itemCategory', 'quantity', 'totalAmount', 'quantityReceived'];
  dataSource = new MatTableDataSource<InventoryRequestItemTableColumn>();
  @Input() inventoryRequest!: InventoryRequest;
  @Input() isReadOnly = true;

  error;

  @Output() itemsChanged = new EventEmitter()
  constructor(
    private inventoryRequestService: InventoryRequestService,
    private itemService: ItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,) {
  }

  ngAfterViewInit() {
  }

  init(data: InventoryRequestItemTableColumn[]) {
    if(data) {
      this.dataSource = new MatTableDataSource(data);
      this.accTotalAmount = this.dataSource.data.map(x=>x.totalAmount).reduce((curr, prev) => {
        return Number(curr) + Number(prev);
      });
    }
  }

  Number(value: any = "0") {
    return isNaN(Number(value ? value.toString() : "0")) ? 0 : Number(value.toString());
  }

}
