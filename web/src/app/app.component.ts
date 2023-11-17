import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ResolveEnd, ActivatedRouteSnapshot, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouterEvent } from '@angular/router';
import { Spinkit, SpinnerVisibilityService } from 'ng-http-loader';
import { filter } from 'rxjs';
import { RouteService } from './services/route.service';
import { AppConfigService } from './services/app-config.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public spinkit = Spinkit;
  title;
  constructor(
    private titleService:Title,
    private spinner: SpinnerVisibilityService,
    private router: Router,
    private appconfig: AppConfigService,
    private routeService: RouteService) {
    this.setupTitleListener();
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