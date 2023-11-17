import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Access } from 'src/app/model/access';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    class: "page-component"
  }
})
export class HomeComponent {
  // pageAccess: Access = {
  //   view: true,
  //   modify: false,
  // };
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router) {
      if(this.route.snapshot.data) {
        // this.pageAccess = {
        //   ...this.pageAccess,
        //   ...this.route.snapshot.data["access"]
        // };
      }
    }
}
