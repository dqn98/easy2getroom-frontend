import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { InputFileModule } from 'ngx-input-file';
import { SubmitPropertyComponent } from './submit-property.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SubmitPropertyService } from 'src/app/services/submit-property.service';
import { LogsService } from 'src/app/services/logs.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

export const routes = [
  { path: '', component: SubmitPropertyComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [SubmitPropertyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    AgmCoreModule,
    InputFileModule,
    FileUploadModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    SubmitPropertyService,
    LogsService,
  ]
})
export class SubmitPropertyModule { }
