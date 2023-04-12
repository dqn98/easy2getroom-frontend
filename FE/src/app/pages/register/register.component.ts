import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matchingPasswords, emailValidator, phoneNumberValidator } from 'src/app/theme/utils/app-validators';
import { AuthService } from 'src/app/services/auth.service';
import { LogsService } from 'src/app/services/logs.service';
import { AddLogViewModel } from 'src/app/viewModels/addLogViewModel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public hide = true;
  constructor(public fb: FormBuilder,
    public router: Router,
    public snackBar: MatSnackBar,
    public logsService: LogsService,
    public authService: AuthService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, emailValidator])],
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.compose([Validators.required, phoneNumberValidator])],
      address: ['', Validators.required],
      birthDay: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      receiveNewsletter: false
    }, { validator: matchingPasswords('password', 'confirmPassword') });
  }

  public onRegisterFormSubmit(values: Object): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(res => {
        if (res != null) {
          this.snackBar.open('You registered successfully. Login to contrinute !', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
          this.router.navigate(['/login']);
          return;
        }
      }, error => {
        console.log(error.error.toString());
        if (error.error.toString() == "Email is existed") {
          this.snackBar.open('Email is existed! ', '×', { panelClass: 'fail', verticalPosition: 'top', duration: 3000 });
          return;
        }
        this.snackBar.open('You registered failed! ', '×', { panelClass: 'fail', verticalPosition: 'top', duration: 3000 });
        return;
      });

    }
  }
}
