import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  logInForm = this.formBuilder.group({
    mobileNumber: ['', Validators.required],
    password: ['', Validators.required]
  });
  admin = false;
  loading = false;
  submitted = false;
  error: string;
  isProcessing = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    private router: Router) {
      // redirect to home if already logged in

      const user = localStorage.getItem("user");
      if (user && JSON.parse(user??"") !== null && JSON.parse(user??"") !== undefined) {
          this.router.navigate(['/']);
      }
    }

  ngOnInit() {
    this.logInForm.controls.password.errors
  }

  onSubmit() {
    if (this.logInForm.invalid) {
        return;
    }
    try{
      const params = this.logInForm.value;
      this.spinner.show();
      this.authService.register(params)
        .subscribe(async res => {
          if (res.success) {
            localStorage.setItem("user", JSON.stringify(res.data));
            this.spinner.hide();
            this.router.navigate(['/']);
          } else {
            this.spinner.hide();
            this.error = Array.isArray(res.message) ? res.message[0] : res.message;
            this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          }
        }, async (res) => {
          this.spinner.hide();
          this.error = res.error.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        });
    } catch (e){
      this.spinner.hide();
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
    }
  }
}
