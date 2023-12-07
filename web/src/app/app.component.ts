import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ResolveEnd, ActivatedRouteSnapshot, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouterEvent } from '@angular/router';
import { Spinkit, SpinnerVisibilityService } from 'ng-http-loader';
import { filter } from 'rxjs';
import { RouteService } from './services/route.service';
import { AppConfigService } from './services/app-config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { CustomSocket } from './sockets/custom-socket.sockets';
import { StorageService } from './services/storage.service';
import { PusherService } from './services/pusher.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public spinkit = Spinkit;
  title;
  grantNotif = false;
  constructor(
    private titleService:Title,
    private spinner: SpinnerVisibilityService,
    private router: Router,
    private snackBar:MatSnackBar,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private routeService: RouteService,
    private socket: CustomSocket,
    private pusher: PusherService) {
      if(this.storageService.getLoginProfile()?.userId) {
        this.socket.init();
      }
      this.socket.fromEvent('notifAdded').subscribe(res => {
        const { userId, title, description, unRead } = res as any;
        if(this.grantNotif) {
          const notify = new Notification(title, {
            body: description,
            icon: '../assets/img/banner.png'
          });
        }
        else {
          this.snackBar.open(title);
        }
        this.storageService.saveUnreadNotificationCount(unRead);
      });
      if (!window.Notification) {
        console.log('Browser does not support notifications.')
      } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
          // show notification here
          this.grantNotif = true;
        } else {
          // request permission from the user
          Notification.requestPermission()
            .then(function (p) {
              if (p === 'granted') {
                // show notification here
              } else {
                console.log('User blocked notifications.')
              }
            })
            .catch(function (err) {
              console.error(err)
            })
        }
      }
    this.setupTitleListener();
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    const channel = this.pusher.init('test');
    channel.bind('test', ({ userId, title, description }) => {
      // this.snackBar.open(title);
      console.log("pusher worked! ", title);
    });
  }
  private setupTitleListener() {
    this.router.events.pipe(filter(e => e instanceof ResolveEnd)).subscribe((e: any) => {
      const { data } = this.getDeepestChildSnapshot(e.state.root);
      this.routeService.changeData(data);
      if(data?.['title']){
        this.title = data['title'];
        this.titleService.setTitle(`${this.title} | ${this.appconfig.config.appName}`);
      }
      this.navigationInterceptor(e);
    });
  }

  getDeepestChildSnapshot(snapshot: ActivatedRouteSnapshot) {
    let deepestChild = snapshot.firstChild;
    while (deepestChild?.firstChild) {
      deepestChild = deepestChild.firstChild
    };
    return deepestChild || snapshot
  }
  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.spinner.show();
    }
    if (event instanceof NavigationEnd) {
      this.spinner.hide();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.spinner.hide();
    }
    if (event instanceof NavigationError) {
      this.spinner.hide();
    }
  }
}
