import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator, matchingPasswords, phoneNumberValidator } from 'src/app/theme/utils/app-validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { AccountService } from 'src/app/services/account.service';
import { UpdateProfileViewModel } from 'src/app/viewModels/updateProfileViewModel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public infoForm: FormGroup;
  public avatar: string;
  public passwordForm: FormGroup;
  public user: any;
  public isChangeAvatar: boolean = false;
  constructor(public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public authService: AuthService,
    public accountService: AccountService) { }

  ngOnInit() {
    this.avatar = this.authService.decodedToken.photo_url;
    this.accountService.getProfile(this.authService.decodedToken.user_name).subscribe(user => {
      this.initInfoForm(user);
    });
    this.initPasswordForm();
  }

  public initInfoForm(user) {
    this.user = user;
    console.log(user);
    var images: any[] = [];
    let avatar = {
      link: user.avatar,
      preview: user.avatar
    };
    images.push(avatar);
    this.infoForm = this.formBuilder.group({
      name: [user.name, Validators.compose([Validators.required, Validators.minLength(3)])],
      email: [user.email, Validators.compose([Validators.required, emailValidator])],
      phone: [user.phone, Validators.compose([Validators.required, phoneNumberValidator])],
      address: [user.name, Validators.required],
      birthday: [user.birthday, Validators.required],
      image: [images, Validators.required],
      facebook: user.facebook,
      twitter: user.twitter,
      website: user.website
    });
  }

  public initPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    }, { validator: matchingPasswords('newPassword', 'confirmNewPassword') });
  }

  public onInfoFormSubmit(values): void {
    if (this.infoForm.valid) {
      if (this.infoForm.get('image').value != null) {
        var image = this.infoForm.get('image').value;
      }
      console.log(this.isChangeAvatar);
      if (image != null && this.isChangeAvatar == true) {
        this.accountService.updateAvatar(image, this.authService.decodedToken.user_id).subscribe(res => {
        });
      }  
      let profileVM: UpdateProfileViewModel = {
        userId: this.authService.decodedToken.user_id,
        name: values.name,
        phone: values.phone,
        address: values.address,
        birthday: values.birthday,
        facebook: values.facebook,
        twitter: values.twitter,
        website: values.website
      };

      this.accountService.updateProfile(profileVM).subscribe(res => {
        this.snackBar.open('Your account information updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      }, error => {
        this.snackBar.open('Your account information updated failed!', '×', { verticalPosition: 'top', duration: 3000 });
      });
    }
  }

  public onPasswordFormSubmit(values: Object): void {
    if (this.passwordForm.valid) {
      let changePassowrd = {
        userId: this.authService.decodedToken.user_id,
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };
      this.authService.changePassword(changePassowrd).subscribe(res => {
        console.log(res);
        this.initPasswordForm();
        this.snackBar.open('Your password changed successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      }, error => {
        this.snackBar.open('Your password changed failed!', '×', { panelClass: 'failed', verticalPosition: 'top', duration: 3000 });
      });
    }
  }

}
