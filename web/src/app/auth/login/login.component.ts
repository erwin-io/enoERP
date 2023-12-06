import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/compiler';
import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Users } from 'src/app/model/users';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { CustomSocket } from 'src/app/sockets/custom-socket.sockets';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    class: "page-component"
  }
})
export class LoginComponent {
  logInForm = this.formBuilder.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
});
  loading = false;
  submitted = false;
  error: string;
  isProcessing = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private socket: CustomSocket,
    private router: Router) {
      // redirect to home if already logged in

      const user = this.storageService.getLoginProfile();
      if(user) {
        this.authService.redirectToPage(false);
      }
    }

  ngOnInit() {
  }

  onSubmit() {
    if (this.logInForm.invalid) {
        return;
    }
    try{
      const params = this.logInForm.value;
      this.authService.login(params)
        .subscribe(async res => {
          if (res.success) {
            this.storageService.saveLoginProfile(res.data);
            this.socket.init();
            this.authService.redirectToPage(false);
          } else {
            this.error = Array.isArray(res.message) ? res.message[0] : res.message;
            this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          }
        }, async (res) => {
          this.error = res.error.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        });
    } catch (e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
    }
  }
}
