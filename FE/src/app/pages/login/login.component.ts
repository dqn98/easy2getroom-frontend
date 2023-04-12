import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { AppService } from 'src/app/app.service';
import { phoneNumberValidator } from 'src/app/theme/utils/app-validators';
import { ExternalLoginViewModel } from 'src/app/viewModels/externalLoginViewModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public isLoginWithSocialAccnount: boolean;
  public isEmailExisted: boolean;
  public loginForm: FormGroup;
  public externalInfo: FormGroup;
  public hide = true;
  public socialUser: SocialUser;
  constructor(public fb: FormBuilder,
    public router: Router,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    public appService: AppService) { }

  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
      password: [null, Validators.required]
    });
  }

  initExternalInfoForm(socialUser: SocialUser) {
    this.externalInfo = this.fb.group({
      email: [{ value: socialUser.email, disabled: true }, Validators.required],
      name: [{ value: socialUser.name, disabled: true }, Validators.required],
      photoUrl: [{ value: socialUser.photoUrl, disabled: true }, Validators.required],
      phoneNumber: ['', Validators.compose([Validators.required, phoneNumberValidator])],
      birthDay: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.socialUser == null;
  }

  public resetFormState() {
    this.isLoginWithSocialAccnount = undefined;
    this.isEmailExisted = undefined;
  }

  public onLoginFormSubmit(values: Object): void {
    if (!this.loginForm.valid) {
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(res => {
      this.appService.refreshFavorites();
      this.appService.refreshAnnouncements();
      this.appService.signalrConn();
      this.router.navigate(['/']);
    }, error => {
    }, () => {
      this.router.navigate(['/']);
    });
  }


  public onExternalInfoFormSubmit(values: Object): void {
    if (!this.externalInfo.valid) {
      return;
    }

    let viewModel: ExternalLoginViewModel = {
      authToken: this.socialUser.authToken,
      provider: this.socialUser.provider,
      email: this.socialUser.email,
      id: this.socialUser.id,
      name: this.socialUser.name,
      photoUrl: this.socialUser.photoUrl,
      phoneNumber: this.externalInfo.value.phoneNumber,
      address: this.externalInfo.value.address,
      birthDay: this.externalInfo.value.birthDay
    };
    this.externalLogin(viewModel);
  }


  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(socialUser => {
      this.socialUser = socialUser;
      this.initExternalInfoForm(socialUser);
      this.authService.isEmailExisted(socialUser).subscribe(res => {
        if (res == true) {
          let viewModel: ExternalLoginViewModel = {
            authToken: this.socialUser.authToken,
            provider: this.socialUser.provider,
            email: this.socialUser.email,
            id: this.socialUser.id,
            name: this.socialUser.name,
            photoUrl: this.socialUser.photoUrl,
            phoneNumber: "",
            address: "",
            birthDay: new Date()
          };
          this.externalLogin(viewModel);
        }
        this.isEmailExisted = res;
        this.isLoginWithSocialAccnount = true;
      });
    });
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(socialUser => {
      this.socialUser = socialUser;
      this.initExternalInfoForm(socialUser);
      this.authService.isEmailExisted(socialUser).subscribe(res => {
        if (res == true) {
          let viewModel: ExternalLoginViewModel = {
            authToken: this.socialUser.authToken,
            provider: this.socialUser.provider,
            email: this.socialUser.email,
            id: this.socialUser.id,
            name: this.socialUser.name,
            photoUrl: this.socialUser.photoUrl,
            phoneNumber: "",
            address: "",
            birthDay: new Date()
          };
          this.externalLogin(viewModel);
        }
        this.isEmailExisted = res;
        this.isLoginWithSocialAccnount = true;
      });
    });
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  externalLogin(viewModel: ExternalLoginViewModel) {
    this.authService.externalLogin(viewModel).subscribe(res => {
      this.appService.refreshFavorites();
      this.appService.refreshAnnouncements();
      this.appService.signalrConn();
      this.router.navigate(['/']);
    }, error => {
    }, () => {
      this.router.navigate(['/']);
    });
  }
}
