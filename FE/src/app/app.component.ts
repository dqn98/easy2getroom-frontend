import { Component, OnInit } from '@angular/core';
import { Settings, AppSettings } from './app.settings';
import { Router, NavigationEnd } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Easy2GetRoom-Admin';
  jwtHelper = new JwtHelperService();
  public settings: Settings;

  constructor(public appSettings: AppSettings,
    public router: Router,
    private authService: AuthService,
    public appservice: AppService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (this.authService.loggedIn()) {
      this.appservice.signalrConn();
      this.appservice.chatSignalRConn();
    }
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.scrollTo(0, 0);
        });
      }
    });
  }
}
