import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Message } from 'src/app/entities/message';

@Component({
  selector: 'app-toolbar1',
  templateUrl: './toolbar1.component.html'
})
export class Toolbar1Component implements OnInit {
  public messages: Message[] = [];
  @Output() onMenuIconClick: EventEmitter<any> = new EventEmitter<any>();
  constructor(public appService: AppService, public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.messages = this.appService.Data.messages;
  }

  public sidenavToggle() {
    this.onMenuIconClick.emit();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}