import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, ObservableLike } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/entities/user';
import { ExternalLoginViewModel } from 'src/app/viewModels/externalLoginViewModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  appUrl: string;

  public jwtHelper = new JwtHelperService();
  public decodedToken: any;
  public currentUser: User;
  public avatar = new BehaviorSubject<string>('https://res.cloudinary.com/namqd98/image/upload/v1592814619/Default/defaultuser_qyklmd.png');
  public currentAvatar = this.avatar.asObservable();

  constructor(private http: HttpClient) {
    this.appUrl = environment.baseUrl;
  }

  changeMemberPhoto(photoUrl: string) {
    this.avatar.next(photoUrl);
  }

  login(viewModel: ExternalLoginViewModel) {
    return this.http.post(this.appUrl + 'Security/login', viewModel)
      .pipe(
        map((response: any) => {
          const user = response;
          (user);
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            this.changeMemberPhoto(this.currentUser.avatar);
          }
        })
      )
  }

  externalLogin(formData: any) {
    return this.http.post(this.appUrl + 'Security/externalLogin', formData)
      .pipe(
        map((response: any) => {
          console.log(response);
          const user = response;
          (user);
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            this.changeMemberPhoto(this.currentUser.avatar);
          }
        })
      )
  }

  register(formData: any) {
    return this.http.post(this.appUrl + 'Security/register', formData);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isEmailExisted(socialUser: any): Observable<any> {
    return this.http.post(this.appUrl + 'Security/IsEmailExisted', socialUser)
  }

  changePassword(changePassword): Observable<any> {
    return this.http.post(this.appUrl + 'Security/ChangePassword', changePassword);
  }
}
