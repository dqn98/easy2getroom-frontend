import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lang',
  templateUrl: './lang.component.html',
  styleUrls: ['./lang.component.scss']
})
export class LangComponent implements OnInit {
  public flags = [
    { name:'Vietnamese', image: 'assets/images/flags/vn.svg' },
    { name:'English', image: 'assets/images/flags/gb.svg' },
  ]
  public flag:any;
  constructor() { }

  ngOnInit() {
    this.flag = this.flags[0]; 
  }

  public changeLang(flag){
    this.flag = flag;
  }

}
