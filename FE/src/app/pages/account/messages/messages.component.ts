import { Component, OnInit, ViewChild } from '@angular/core';
import { UserResultViewModel } from 'src/app/viewModels/userResultViewModel';
import * as signalR from "@aspnet/signalr";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { Message } from 'src/app/entities/message';
import { AuthService } from 'src/app/services/auth.service';
import { MessageViewModel } from 'src/app/viewModels/messageViewModel';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  messages: Message[] = [];
  resmessage: string;
  loggedUserid: string;
  recipientId: string = '';
  recipient: any;

  //Chat
  public onlineUser: any = [];
  public usersList: any[] = [];
  public chatConnection: string;
  public chatMessages: Message[] = [];
  public chatMessage: Message = null;

  constructor(
    private authService: AuthService,
    public appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private messagesService: MessagesService
  ) {
    this.loggedUserid = this.authService.decodedToken.user_id;
  }

  ngOnInit() {
    let userId = this.authService.decodedToken.user_id;
    this.messagesService.getUsers(userId).subscribe(users => {

      this.usersList = users;
      console.log(this.usersList);
    });

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

  chooseUser(user: UserResultViewModel) {
    this.router.navigate(['/account/messages/' + user.id]);
    let i = 0;
    this.appService.Data.messages.forEach(message => {
      if (message.senderId == user.id) {
        this.appService.Data.announcements.splice(i, 1);
      }
      i++;
    });
  }


  public applyFilter(filterValue: string) {
    let tempUserList: UserResultViewModel[];
    this.usersList.forEach(user => {
      if (user.fullName.includes(filterValue)) {
        tempUserList.push(user);
      }
    });
    this.usersList = tempUserList;
  }
}
