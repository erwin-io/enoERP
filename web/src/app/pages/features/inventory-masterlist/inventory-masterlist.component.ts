import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { InventoryMasterlistService } from 'src/app/services/inventory-masterlist.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { InventoryMasterlistTableColumn } from 'src/app/shared/utility/table';
import { FormControl } from '@angular/forms';
import { BranchService } from 'src/app/services/branch.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Users } from 'src/app/model/users';

@Component({
  selector: 'app-inventory-masterlist',
  templateUrl: './inventory-masterlist.component.html',
  styleUrls: ['./inventory-masterlist.component.scss'],
  host: {
    class: "page-component"
  }
})
export class InventoryMasterlistComponent {
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

  branchCode = new FormControl();
  isOptionsBranchLoading = false;
  optionBranch: {code: string; name: string}[] = [];
  branchSearchCtrl = new FormControl();
  @ViewChild('branchSearchInput', { static: true}) branchSearchInput: ElementRef<HTMLInputElement>;
  constructor(
    private spinner: SpinnerVisibilityService,
    private inventoryMasterlistService: InventoryMasterlistService,
    private branchService: BranchService,
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
      if(!this.currentUserProfile.branch.isMainBranch) {
        this.branchSearchCtrl.disable();
      }
    }

  async ngOnInit(): Promise<void> {
    this.branchSearchCtrl.valueChanges
    .pipe(
        debounceTime(2000),
        distinctUntilChanged()
    )
    .subscribe(async value => {
        await this.initBranchOptions();
    });
    this.branchCode.valueChanges
    .subscribe(async value => {
      await this.getInventoryMasterlistPaginated();
    });
    this.branchCode.setValue(this.currentUserProfile.branch.branchCode);
  }

  async initBranchOptions() {
    this.isOptionsBranchLoading = true;
    const res = await this.branchService.getByAdvanceSearch({
      order: {},
      columnDef: [{
        apiNotation: "name",
        filter: this.branchSearchInput.nativeElement.value
      }],
      pageIndex: 0,
      pageSize: 10
    }).toPromise();
    this.optionBranch = res.data.results.map(a=> { return { name: a.name, code: a.branchCode }});
    this.isOptionsBranchLoading = false;
  }

  displayBranchName(value?: number) {
    return value ? this.optionBranch.find(_ => _.code === value?.toString())?.name : undefined;
  }

  async ngAfterViewInit() {
    this.getInventoryMasterlistPaginated();
    this.initBranchOptions();
    this.branchSearchCtrl.setValue(this.branchCode.value);
  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]) {
    this.filter = event;
    this.getInventoryMasterlistPaginated();
  }

  async pageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getInventoryMasterlistPaginated();
  }

  async sortChange(event: { active: string, direction: string }) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.branch.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction.toUpperCase());
    this.getInventoryMasterlistPaginated()
  }

  async getInventoryMasterlistPaginated(){
    try{

      const key = "branch.branchCode"
      const filter = {
        "apiNotation": key,
        "filter": this.branchCode.value,
        "name": "branchCode",
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
      this.inventoryMasterlistService.getByAdvanceSearch({
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
              price: d.item.price,
              itemCategory: d.item.itemCategory.name,
              branch: d.branch.name,
              quantity: d.quantity,
            } as InventoryMasterlistTableColumn
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

  closeNewInventoryMasterlistDialog() {
    this.dialog.closeAll();
  }
}
