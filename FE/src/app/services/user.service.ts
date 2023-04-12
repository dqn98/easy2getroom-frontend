import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  appUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.appUrl + "User/GetUsers");
  }

  getUser(username: string): Observable<any> {
    return this.http.get<any>(this.appUrl + "User/GetUser/" + username);
  }

  getPropertiesByUsername(username: string): Observable<any[]> {
    return this.http.get<any[]>(this.appUrl + "User/GetPropertiesByUsername/" + username);
  }
}
