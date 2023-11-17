import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router, ResolveEnd, ActivatedRouteSnapshot, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { filter } from 'rxjs';
import { Users } from 'src/app/model/users';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { RouteService } from 'src/app/services/route.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  host: {
    class: "component-wrapper"
  }
})
export class FeaturesComponent {
  appName = "";
  title = "";
  loading = false;
  drawerDefaultOpened = false;
  details = false;
  profile: Users;
  currentGroup;
  disableGroupAnimation = true;
  constructor(
    private titleService:Title,
    private authService: AuthService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private routeService: RouteService
    ) {
      this.profile = this.storageService.getLoginProfile();
      this.onResize();
      this.routeService.data$.subscribe((res: { title: string; admin: boolean; details: boolean }) => {
        this.title = res.title;
        this.details = res.details;
      });
  }
  ngOnInit(): void {
  }

  onActivate(event) {
    this.currentGroup = event?.route?.snapshot?.data["group"] && event?.route?.snapshot?.data["group"] !== undefined ? event?.route?.snapshot?.data["group"] : null;
    this.onResize();
  }

  expand(group = "") {
    return this.currentGroup?.toLowerCase() === group.toLowerCase();
  }

  showGroupMenu(pages = []) {
    return this.profile && this.profile.access && this.profile?.access?.accessPages?.some(x=> pages.some(p => p.toLowerCase() === x.page.toLowerCase()) && x.view === true);
  }

  showMenu(page: string) {
    return this.profile && this.profile.access && this.profile?.access?.accessPages?.some(x=>x.page.toLowerCase() === page.toLowerCase() && x.view === true);
  }

  signOut() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Are you sure you want to logout?';
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
    dialogRef.componentInstance.conFirm.subscribe(async (confirmed: any) => {
      const profile = this.storageService.getLoginProfile();
      this.storageService.saveLoginProfile(null);
      this.authService.redirectToPage(true)
      dialogRef.close();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if(window.innerWidth >= 960) {
      this.drawerDefaultOpened = true;
    } else {
      this.drawerDefaultOpened = false;
    }
  }
}
