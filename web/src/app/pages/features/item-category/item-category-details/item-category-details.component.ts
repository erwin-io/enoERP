import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemCategory } from 'src/app/model/item-category';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ItemCategoryService } from 'src/app/services/item-category.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { ItemCategoryFormComponent } from '../item-category-form/item-category-form.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-item-category-details',
  templateUrl: './item-category-details.component.html',
  styleUrls: ['./item-category-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class ItemCategoryDetailsComponent {
  id;
  isNew = false;
  // pageItemCategory: ItemCategory = {
  //   view: true,
  //   modify: false,
  // };

  isReadOnly = true;

  error;
  isLoading = false;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('itemCategoryForm', { static: true}) itemCategoryForm: ItemCategoryFormComponent;

  constructor(
    private itemCategoryService: ItemCategoryService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.id = this.route.snapshot.paramMap.get('itemCategoryId');
    this.isReadOnly = !edit && !isNew;
    if (this.route.snapshot.data) {
      // this.pageItemCategory = {
      //   ...this.pageItemCategory,
      //   ...this.route.snapshot.data['itemCategory'],
      // };
    }
  }

  get pageRights() {
    let rights = {};
    // for(var right of this.pageItemCategory.rights) {
    //   rights[right] = this.pageItemCategory.modify;
    // }
    return rights;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initDetails();
  }

  itemCategoryGridChange(event) {
    console.log(event);
    this.itemCategoryForm.form.controls["itemCategoryPages"].setValue(event);
    this.itemCategoryForm.form.markAllAsTouched();
    this.itemCategoryForm.form.markAsDirty();
  }

  async initDetails() {
    const res = await this.itemCategoryService.getById(this.id).toPromise();
    if (res.success) {
      this.itemCategoryForm.setFormValue(res.data);

      if (this.isReadOnly) {
        this.itemCategoryForm.form.disable();
      }
    } else {
      this.error = Array.isArray(res.message) ? res.message[0] : res.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
    }
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notMatched: true };
  };

  onDelete() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Delete itemCategory?';
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
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
      this.isProcessing = true;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      try {
        let res = await this.itemCategoryService.delete(this.id).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/item-category/']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
        } else {
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.error = Array.isArray(res.message)
            ? res.message[0]
            : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          dialogRef.close();
        }
      } catch (e) {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }

  onUpdate(formData) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Update Item category?';
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
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
      this.isProcessing = true;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      try {
        let res = await this.itemCategoryService.update(this.id, formData).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/item-category/' + res.data.itemCategoryId]);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
        } else {
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.error = Array.isArray(res.message)
            ? res.message[0]
            : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          dialogRef.close();
        }
      } catch (e) {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }
}
