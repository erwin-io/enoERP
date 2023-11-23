import { Component, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Item } from 'src/app/model/item';
import { ItemService } from 'src/app/services/item.service';

export class SelectItemDialogTableColumn {
  itemId: string;
  itemCode: string;
  itemName: string;
  itemCategory: string;
  selected: boolean;
}
@Component({
  selector: 'app-select-item-dialog',
  templateUrl: './select-item-dialog.component.html',
  styleUrls: ['./select-item-dialog.component.scss']
})
export class SelectItemDialogComponent {
  displayedColumns = ["selected", "itemName", "itemCategory" ]
  dataSource = new MatTableDataSource<SelectItemDialogTableColumn>();
  selected: SelectItemDialogTableColumn;
  doneSelect = new EventEmitter();

  filterItemName = "";
  filterItemCategory = "";

  constructor(
    private itemService: ItemService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelectItemDialogComponent>
    ) {
  }

  ngAfterViewInit(): void {
    this.init();
  }

  init() {
    const filter: any[] = [
      {
        apiNotation: "itemName",
        filter: this.filterItemName,
      },
      {
        apiNotation: "itemCategory.name",
        filter: this.filterItemCategory,
      },
    ];
    // if(this.selected && this.selected?.itemId && this.selected?.itemId !== "") {
    //   filter.push({
    //     apiNotation: "itemId",
    //     filter: this.selected?.itemId,
    //     type: "not",
    //   });
    // }
    try {
      this.itemService.getByAdvanceSearch({
        order: {},
        columnDef: filter,
        pageIndex: 0,
        pageSize: 10
      }).subscribe(res=> {
        this.dataSource = new MatTableDataSource(res.data.results.map(x=> {
          return {
            itemId: x.itemId,
            itemCode:  x.itemCode,
            itemName:  x.itemName,
            itemCategory:  x.itemCategory.name,
            selected: this.selected?.itemId === x.itemId
          }
        }));

      });
    }catch(ex) {

    }
  }

  isSelected(item: SelectItemDialogTableColumn) {
    return this.dataSource.data.find(x=>x.itemId === item.itemId && x.selected) ? true : false;
  }

  selectionChange(currentItem: SelectItemDialogTableColumn, selected) {
    console.log(currentItem);
    console.log("selected", selected);
    const items = this.dataSource.data;
    if(selected) {
      for(var item of items) {
        item.selected = currentItem.itemId === item.itemId;
      }
    }
    else {
      const items = this.dataSource.data;
      for(var item of items) {
        item.selected = false;
      }
    }
    this.dataSource = new MatTableDataSource<SelectItemDialogTableColumn>(items);
    console.log("selected", this.dataSource.data);
    this.selected = this.dataSource.data.find(x=>x.selected);
  }

  async doneSelection() {
    try {
      this.spinner.show();
      const res = await this.itemService.getById(this.selected.itemId).toPromise();
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
