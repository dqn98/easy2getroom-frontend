import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  public agents;
  constructor(public appService: AppService,
    public userService: UserService) { }

  ngOnInit() {
    // this.agents = this.appService.getAgents();
    this.userService.getUsers().subscribe(users => {
      this.agents = users;
    });
  }

}
