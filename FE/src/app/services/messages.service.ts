import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Message } from '../entities/message';
import { GetMessageViewModel } from '../viewModels/getMessageViewModel';
import { MessageViewModel } from '../viewModels/messageViewModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  appUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.appUrl + "Message/GetMessages");
  }

  getMessage(viewModel: GetMessageViewModel): Observable<Message[]> {
    return this.http.post<Message[]>(this.appUrl + "Message/GetMessages", viewModel);
  }

  saveMessage(viewModel: MessageViewModel): Observable<Message> {
    return this.http.post<Message>(this.appUrl + "Message/SendMessage", viewModel);
  }

  getUsers(userId: string): Observable<any[]> {
    return this.http.get<any[]>(this.appUrl + "Message/GetUserMessages/" + userId);
  }

}
