import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MatChipsModule } from '@angular/material/chips';
import { InputFileModule } from 'ngx-input-file';
import { AgmCoreModule } from '@agm/core';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyPropertiesComponent } from './my-properties/my-properties.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProfileComponent } from './profile/profile.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';

import { AccountService } from 'src/app/services/account.service';
import { PropertyImagesService } from 'src/app/services/property-images.service';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { MessagesComponent } from './messages/messages.component';
import { ChatComponent } from './messages/chat/chat.component';

export const routes = [
  {
    path: '',
    component: AccountComponent, children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'my-properties', component: MyPropertiesComponent },
      { path: 'my-properties/:id', component: EditPropertyComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'announcements', component: AnnouncementsComponent },
      // {
      //   path: 'messages', component: MessagesComponent, children: [
      //     { path: ':username', component: ChatComponent }
      //   ]
      // },
      { path: 'messages', loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule) }, 
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    AccountComponent,
    MyPropertiesComponent,
    FavoritesComponent,
    ProfileComponent,
    EditPropertyComponent,
    AnnouncementsComponent,
    // MessagesComponent,
    // ChatComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InputFileModule,
    AgmCoreModule,
    MatChipsModule
  ],
  providers: [
    AccountService,
    PropertyImagesService
  ]
})
export class AccountModule { }
