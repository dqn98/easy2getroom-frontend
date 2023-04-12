import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AddLogViewModel } from 'src/app/viewModels/addLogViewModel';
import { LogViewModel } from 'src/app/viewModels/logViewModel';
import { Observable } from 'rxjs';
import * as signalR from "@aspnet/signalr";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  appUrl: string = environment.baseUrl;
  private hubConnection;
  constructor(private http: HttpClient, private authService: AuthService) { }

  public addLog(viewModel: AddLogViewModel): Observable<LogViewModel> {
    return this.http.post<LogViewModel>(this.appUrl + 'AdminLogging/AddLog', viewModel);
  }

  public signalrConn(userId) {
    //Init Connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44390/LoggingHub?user=" + userId)
      .build();

    //Call client methods from hub to update User
    this.hubConnection.on("UpdateUserList", () => { });

    //Start Connection
    this.hubConnection
      .start()
      .then(function () {
        console.log("Connected");
      }).catch(function (err) {
        return console.error(err.toString());
      });
  }

  public sendSubbmitLog(viewModel: AddLogViewModel) {
    this.addLog(viewModel).subscribe(log => {
      console.log(log);
      this.hubConnection.invoke('SendLog', log);
    });
  }
}
