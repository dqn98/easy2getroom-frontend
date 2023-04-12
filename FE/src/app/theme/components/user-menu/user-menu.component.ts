import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  public currentUser: any;
  public avatar;

  @Output() logoutEmitter: EventEmitter<any> = new EventEmitter();
  constructor(public appService:AppService, public authService: AuthService) { }

  ngOnInit() {
    this.currentUser = this.authService.decodedToken;  
    this.avatar = this.authService.decodedToken.photo_url;
  }

  logout() {
    this.appService.Data.favorites = [];
    this.appService.Data.announcements = [];
    this.logoutEmitter.emit();
  }
}
