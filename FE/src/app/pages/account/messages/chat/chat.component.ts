import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserResultViewModel } from 'src/app/viewModels/userResultViewModel';
import * as signalR from "@aspnet/signalr";
import { Message } from 'src/app/entities/message';
import { AppService } from 'src/app/app.service';
import { MessagesService } from 'src/app/services/messages.service';
import { MessageViewModel } from 'src/app/viewModels/messageViewModel';
import { GetMessageViewModel } from 'src/app/viewModels/getMessageViewModel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private sub: any;
  messages: Message[] = [];
  resmessage: string;
  loggedUserid: string;
  recipientId: string = '';
  recipient: any;

  //API
  public _chatUrl: string = 'api/chat/userChat';
  //Chat
  public onlineUser: any = [];
  public usersList: any[] = [];
  public chatConnection: string;
  public chatMessages: Message[] = [];
  public chatMessage: Message = null;

  private hubConnection;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    public appService: AppService,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.loggedUserid = this.authService.decodedToken.user_id;
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.recipientId = params['userId'];
      this.signalrConn();
      this.chatLog();
    });
  }

  signalrConn() {
    //Init Connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44390/ChatHub?user=" + this.loggedUserid)
      .build();

    //Call client methods from hub to update User
    this.hubConnection.on("UpdateUserList", () => { });

    //Call client methods from hub to update User
    this.hubConnection.on("ReceiveMessage", (message: Message) => {
      message.status = 'Recipient';
      this.appService.addToMessages(message);
      this.chatMessages.push(message);
      // this.chatLog()
    });

    //Start Connection
    this.hubConnection
      .start()
      .then(function () {
        console.log("Connected");
      }).catch(function (err) {
        return console.error(err.toString());
      });
  }

  public sendMessage(content) {
    //Send Message
    if (content != '') {
      let viewModel = new MessageViewModel();
      viewModel.senderId = this.loggedUserid;
      viewModel.recipientId = this.recipientId;
      viewModel.content = content;
      viewModel.status = 'Sent';
      this.messagesService.saveMessage(viewModel).subscribe(message => {
        console.log(viewModel);
        this.chatMessages.push(message);
        this.hubConnection.invoke('SendMessage', message);
      });
    }
  }

  public chatLog() {
    this.chatMessages = [];
    //ChatLog
    var viewModel: GetMessageViewModel = {
      senderId: this.loggedUserid,
      recipientId: this.recipientId
    }
    this.messagesService.getMessage(viewModel).subscribe(messages => {
      this.messages = messages;
      if (this.messages != null) {
        for (let i = 0; i < this.messages.length; i++) {
          if (this.messages[i].senderId === this.loggedUserid) {
            this.messages[i].status = 'Sent';
          }
          else {
            this.messages[i].status = 'Recipient';
          }
          this.chatMessages.push(this.messages[i]);
        }
      }
    }, error => {
      console.log(error);
    });
  }

  ngOnDestroy() {
    //Stop Connection
    this.hubConnection
      .stop()
      .then(function () {
        console.log("Stopped");
      }).catch(function (err) {
        return console.error(err.toString());
      });
  }
}
