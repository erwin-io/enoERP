import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription, debounceTime, distinctUntilChanged, forkJoin, of, map } from 'rxjs';
import { Access } from 'src/app/model/access';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Users } from 'src/app/model/users';
import { AccessService } from 'src/app/services/access.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { AccessPagesTableComponent } from '../../../../shared/access-pages-table/access-pages-table.component';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { BranchService } from 'src/app/services/branch.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  host: {
    class: 'page-component',
  },
})
export class UserDetailsComponent implements OnInit {
  currentUserCode;
  userCode;
  isNew = false;
  // pageAccess: Access = {
  //   view: true,
  //   modify: false,
  // };

  isReadOnly = true;

  error;
  isLoading = false;

  userForm: FormGroup;
  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;
  maxDate = moment(new Date().getFullYear() - 18).format('YYYY-MM-DD');

  displayedColumns = ['page', 'view', 'modify', 'rights'];
  accessDataSource = new MatTableDataSource<Access>();

  branchSearchCtrl = new FormControl()
  isOptionsBranchLoading = false;
  optionsBranch: { name: string; id: string}[] = [];
  @ViewChild('branchSearchInput', { static: true}) branchSearchInput: ElementRef<HTMLInputElement>;

  accessSearchCtrl = new FormControl()
  isOptionsAccessLoading = false;
  optionsAccess: { name: string; code: string}[] = [];
  @ViewChild('accessPagesTable', { static: true}) accessPagesTable: AccessPagesTableComponent;
  @ViewChild('accessSearchInput', { static: true}) accessSearchInput: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private branchService: BranchService,
    private accessService: AccessService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private spinner: SpinnerVisibilityService
  ) {
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.userCode = this.route.snapshot.paramMap.get('userCode');
    const profile = this.storageService.getLoginProfile();
    this.currentUserCode = profile["userCode"];
    this.isReadOnly = !edit && !isNew;
    if(!isNew && edit && edit !== undefined && this.currentUserCode ===this.userCode) {
      this.router.navigate(['/users/' + this.userCode]);
    }
    if (this.route.snapshot.data) {
      // this.pageAccess = {
      //   ...this.pageAccess,
      //   ...this.route.snapshot.data['access'],
      // };
    }
    this.accessDataSource = new MatTableDataSource([] as Access[]);
  }

  get pageRights() {
    let rights = {};
    // for(var right of this.pageAccess.rights) {
    //   rights[right] = this.pageAccess.modify;
    // }
    return rights;
  }

  get f() {
    return this.userForm.controls;
  }
  get formIsValid() {
    return this.userForm.valid && this.branchSearchCtrl.valid && this.accessSearchCtrl.valid;
  }
  get formIsReady() {
    return (this.userForm.valid && this.userForm.dirty) ||
    (this.branchSearchCtrl.valid && this.branchSearchCtrl.dirty) ||
    (this.accessSearchCtrl.valid && this.accessSearchCtrl.dirty);
  }
  get formData() {
    return this.userForm.value;
  }

  ngOnInit(): void {
    this.initDetails();
  }

  async initDetails() {
    if (this.isNew) {
      this.userForm = this.formBuilder.group(
        {
          userName: [null],
          fullName: [
            '',
            [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')],
          ],
          gender: ['',[Validators.required]],
          birthDate: ['',[Validators.required]],
          mobileNumber: [
            '',
            [
              Validators.minLength(11),
              Validators.maxLength(11),
              Validators.pattern('^[0-9]*$'),
              Validators.required,
            ],
          ],
          email: ['',[Validators.required]],
          address: ['',[Validators.required]],
          password: [
            '',
            [
              Validators.minLength(6),
              Validators.maxLength(16),
              Validators.required,
            ],
          ],
          confirmPassword: '',
          accessCode: ['', Validators.required],
          branchId: ['', Validators.required],
        },
        { validators: this.checkPasswords }
      );
    } else {
      this.userForm = this.formBuilder.group({
        userName: [null],
        fullName: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')],
        ],
        gender: ['',[Validators.required]],
        birthDate: ['',[Validators.required]],
        mobileNumber: [
          '',
          [
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern('^[0-9]*$'),
            Validators.required,
          ],
        ],
        email: ['',[
          Validators.required,
          Validators.email]],
        address: ['',[Validators.required]],
        accessCode: ['', Validators.required],
        branchId: ['', Validators.required],
      });


      forkJoin([
        this.userService.getByCode(this.userCode).toPromise(),
        this.branchService.getByAdvanceSearch({
        order: {},
        columnDef: [],
        pageIndex: 0,
        pageSize: 10
      }),
        this.accessService.getByAdvanceSearch({
        order: {},
        columnDef: [],
        pageIndex: 0,
        pageSize: 10
      })
      ]).subscribe(([user, branchOptions, accessOptions])=> {
        if(branchOptions.success) {
          this.optionsBranch = branchOptions.data.results.map(x=> {
            return { name: x.name, id: x.branchId }
          });
        }
        if(accessOptions.success) {
          this.optionsAccess = accessOptions.data.results.map(x=> {
            return { name: x.name, code: x.accessCode }
          });
        }
        if (user.success) {
          this.f['userName'].setValue(user.data.userName);
          this.f['fullName'].setValue(user.data.fullName);
          this.f['gender'].setValue(user.data.gender && ["MALE", "FEMALE"].includes(user.data.gender) ? user.data.gender : "OTHERS");
          this.f['birthDate'].setValue(user.data.birthDate);
          this.f['mobileNumber'].setValue(user.data.mobileNumber);
          this.f['email'].setValue(user.data.email);
          this.f['address'].setValue(user.data.address);
          this.f['branchId'].setValue(user.data.branch?.branchId);
          this.f['accessCode'].setValue(user.data.access?.accessCode);
          if(user.data.access?.accessPages) {
            this.accessPagesTable.setDataSource(user.data.access?.accessPages);
          }
          this.f['userName'].disable();
          this.branchSearchCtrl.disable();
          if (this.isReadOnly) {
            this.userForm.disable();
            this.accessSearchCtrl.disable();
          }
          this.branchSearchCtrl.setValue(user.data.branch?.branchId);
          this.accessSearchCtrl.setValue(user.data.access?.accessCode);
        } else {
          this.error = Array.isArray(user.message) ? user.message[0] : user.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
        }
      });
    }
    this.f['email'].valueChanges.subscribe(res=> {
      if(res && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(res))) {
        this.f['email'].setErrors({ pattern: true})
      } else if(res && res !== "") {
        this.f['email'].setErrors(null)
      }
    })
    this.f['accessCode'].valueChanges.subscribe(async res=> {
      if(!this.isReadOnly) {
        this.spinner.show();
        const access = await this.accessService.getByCode(res).toPromise();
        if(access.data && access.data.accessPages) {
          this.accessPagesTable.setDataSource(access.data.accessPages)
        }
        this.spinner.hide();
      }
    })
    this.branchSearchCtrl.valueChanges
    .pipe(
        debounceTime(2000),
        distinctUntilChanged()
    )
    .subscribe(async value => {
        await this.initBranchOptions();
    });
    this.accessSearchCtrl.valueChanges
    .pipe(
        debounceTime(2000),
        distinctUntilChanged()
    )
    .subscribe(async value => {
        await this.initAccessOptions();
    });
    await this.initBranchOptions();
    await this.initAccessOptions();
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
    this.optionsBranch = res.data.results.map(a=> { return { name: a.name, id: a.branchId }});
    this.mapSearchBranch();
    this.isOptionsBranchLoading = false;
  }

  displayBranchName(value?: number) {
    return value ? this.optionsBranch.find(_ => _.id === value?.toString())?.name : undefined;
  }

  mapSearchBranch() {
    if(this.f['branchId'].value !== this.branchSearchCtrl.value) {
      this.f['branchId'].setErrors({ required: true});
      const selected = this.optionsBranch.find(x=>x.id === this.branchSearchCtrl.value);
      if(selected) {
        this.f["branchId"].setValue(selected.id);
      } else {
        this.f["branchId"].setValue(null);
      }
      if(!this.f["branchId"].value) {
        this.f["branchId"].setErrors({required: true});
      } else {
        this.f['branchId'].setErrors(null);
        this.f['branchId'].markAsPristine();
      }
    }
    this.branchSearchCtrl.setErrors(this.f["branchId"].errors);
  }

  async initAccessOptions() {
    this.isOptionsAccessLoading = true;
    const res = await this.accessService.getByAdvanceSearch({
      order: {},
      columnDef: [{
        apiNotation: "name",
        filter: this.accessSearchInput.nativeElement.value
      }],
      pageIndex: 0,
      pageSize: 10
    }).toPromise();
    this.optionsAccess = res.data.results.map(a=> { return { name: a.name, code: a.accessCode }});
    this.mapSearchAccess();
    this.isOptionsAccessLoading = false;
  }

  displayAccessName(value?: number) {
    return value ? this.optionsAccess.find(_ => _.code === value?.toString())?.name : undefined;
  }

  mapSearchAccess() {
    if(this.f['accessCode'].value !== this.accessSearchCtrl.value) {
      this.f['accessCode'].setErrors({ required: true});
      const selected = this.optionsAccess.find(x=>x.code === this.accessSearchCtrl.value);
      if(selected) {
        this.f["accessCode"].setValue(selected.code);
      } else {
        this.f["accessCode"].setValue(null);
      }
      if(!this.f["accessCode"].value) {
        this.f["accessCode"].setErrors({required: true});
      } else {
        this.f['accessCode'].setErrors(null);
        this.f['accessCode'].markAsPristine();
      }
    }
    this.accessSearchCtrl.setErrors(this.f["accessCode"].errors);
  }

  getError(key: string) {
    if (key === 'confirmPassword') {
      this.formData.confirmPassword !== this.formData.password
        ? this.f[key].setErrors({ notMatched: true })
        : this.f[key].setErrors(null);
    }
    return this.f[key].errors;
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notMatched: true };
  };

  onSubmit() {
    if (this.userForm.invalid || this.accessSearchCtrl.invalid) {
      return;
    }

    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Save user?';
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
        this.isProcessing = true;
        const params = this.formData;
        let res;
        if(this.isNew) {
          res = await this.userService.createUsers(params).toPromise();
        } else {
          res = await this.userService.updateUsers(this.userCode, params).toPromise();
        }

        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/users/' + res.data.userCode]);
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
