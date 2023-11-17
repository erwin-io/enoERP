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
  accessSearchCtrl = new FormControl()
  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;
  maxDate = moment(new Date().getFullYear() - 18).format('YYYY-MM-DD');

  displayedColumns = ['page', 'view', 'modify', 'rights'];
  accessDataSource = new MatTableDataSource<Access>();

  isOptionsAccessLoading = false;
  optionsAccess: { name: string; id: string}[] = [];
  @ViewChild('accessPagesTable', { static: true}) accessPagesTable: AccessPagesTableComponent;
  @ViewChild('accessSearchInput', { static: true}) accessSearchInput: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
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
    return this.userForm.valid && this.accessSearchCtrl.valid;
  }
  get formIsReady() {
    return (this.userForm.valid && this.userForm.dirty) || (this.accessSearchCtrl.valid && this.accessSearchCtrl.dirty);
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
          accessId: ['', Validators.required],
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
        accessId: ['', Validators.required],
      });


      const [user, accessOptions] = await forkJoin([this.userService.getByCode(this.userCode).toPromise(), this.accessService.getByAdvanceSearch({
        order: {},
        columnDef: [],
        pageIndex: 0,
        pageSize: 10
      })]).toPromise();
      if(accessOptions.success) {
        this.optionsAccess = accessOptions.data.results.map(x=> {
          return { name: x.name, id: x.accessId }
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
        this.f['accessId'].setValue(user.data.access?.accessId);
        if(user.data.access?.accessPages) {
          this.accessPagesTable.setDataSource(user.data.access?.accessPages);
        }
        this.f['userName'].disable();
        if (this.isReadOnly) {
          this.userForm.disable();
          this.accessSearchCtrl.disable();
        }
        this.accessSearchCtrl.setValue(user.data.access?.accessId);
      } else {
        this.error = Array.isArray(user.message) ? user.message[0] : user.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
      }
    }
    this.f['email'].valueChanges.subscribe(res=> {
      if(res && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(res))) {
        this.f['email'].setErrors({ pattern: true})
      } else if(res && res !== "") {
        this.f['email'].setErrors(null)
      }
    })
    this.f['accessId'].valueChanges.subscribe(async res=> {
      if(!this.isReadOnly) {
        this.spinner.show();
        const access = await this.accessService.getById(res).toPromise();
        if(access.data && access.data.accessPages) {
          this.accessPagesTable.setDataSource(access.data.accessPages)
        }
        this.spinner.hide();
      }
    })
    this.accessSearchCtrl.valueChanges
    .pipe(
        debounceTime(2000),
        distinctUntilChanged()
    )
    .subscribe(async value => {
        //your API call
        await this.initAccessOptions();
    });
    this.initAccessOptions();
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
    this.optionsAccess = res.data.results.map(a=> { return { name: a.name, id: a.accessId }});
    this.mapSearchAccess();
    this.isOptionsAccessLoading = false;
  }

  getError(key: string) {
    if (key === 'confirmPassword') {
      this.formData.confirmPassword !== this.formData.password
        ? this.f[key].setErrors({ notMatched: true })
        : this.f[key].setErrors(null);
    }
    return this.f[key].errors;
  }

  displayFn(value?: number) {
    return value ? this.optionsAccess.find(_ => _.id === value?.toString())?.name : undefined;
  }

  mapSearchAccess() {
    this.f['accessId'].setErrors({ required: true});
    const selected = this.optionsAccess.find(x=>x.id === this.accessSearchCtrl.value);
    if(selected) {
      this.f["accessId"].setValue(selected.id);
    } else {
      this.f["accessId"].setValue(null);
    }
    if(!this.f["accessId"].value) {
      this.f["accessId"].setErrors({required: true});
    } else {
      this.f['accessId'].setErrors(null);
      this.f['accessId'].markAsPristine();
    }
    this.accessSearchCtrl.setErrors(this.f["accessId"].errors);
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notMatched: true };
  };

  onSubmit() {
    console.log(this.formData);
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
