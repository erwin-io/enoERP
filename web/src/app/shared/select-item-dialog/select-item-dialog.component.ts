import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
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
  total = 0;
  pageIndex = 0;
  pageSize = 10
  order = { itemCode: "ASC" } as any;
  filterItemName = "";
  filterItemCategory = "";
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private itemService: ItemService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelectItemDialogComponent>
    ) {
  }

  ngAfterViewInit(): void {
    this.init();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event: PageEvent)=> {
      const { pageIndex, pageSize } = event;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.init();
    });
    this.dataSource.sort.sortChange.subscribe((event: MatSort)=> {
      const { active, direction } = event;
      if(active === "itemName") {
        this.order = { itemName: direction.toUpperCase()}
      } else if(active === "itemCategory") {
        this.order = { itemCategory: {
          name: direction.toUpperCase()
        }}
      }
      this.init();
    });
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
    try {
      this.itemService.getByAdvanceSearch({
        order: this.order,
        columnDef: filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
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
        this.total = res.data.total;
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
