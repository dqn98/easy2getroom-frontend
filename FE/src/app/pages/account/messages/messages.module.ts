import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { ChatComponent } from './chat/chat.component';
import { RouterModule } from '@angular/router';
export const routes = [
  {
    path: '', component: MessagesComponent, children: [
      { path: ':userId', component: ChatComponent }
    ]
  }
]

@NgModule({
  declarations: [
    MessagesComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class MessagesModule { }
