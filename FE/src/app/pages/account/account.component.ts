import { Component, OnInit, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen: boolean = true;

  public fullName: string;
  public avatar: string;

  public links = [
    { name: 'Profile', href: 'profile', icon: 'person' },
    { name: 'Announcements', href: 'announcements', icon: 'notifications' },
    { name: 'Messages', href: 'messages', icon: 'chat_bubble' },
    { name: 'My Properties', href: 'my-properties', icon: 'view_list' },
    { name: 'Favorites', href: 'favorites', icon: 'favorite' },
    { name: 'Submit Property', href: '/submit-property', icon: 'add_circle' },
    // { name: 'Logout', href: '/login', icon: 'power_settings_new' },
  ];
  constructor(public router: Router, public authService: AuthService, public appService: AppService) { }

  @Output() logoutEmitter: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.fullName = this.authService.decodedToken.full_name;
    this.avatar = this.authService.decodedToken.photo_url;
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    };
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (window.innerWidth < 960) {
          this.sidenav.close();
        }
      } 
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
