import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/theme/utils/app-validators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public contactForm: FormGroup;
  public lat: number = 10.8496468;
  public lng: number = 106.7716404;
  public zoom: number = 12; 
  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
  }
}
