import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SubmitPropertyViewModel } from 'src/app/viewModels/submitPropertyViewModel';
import { AddPropertyFeaturesViewModel } from 'src/app/viewModels/addPropertyFeaturesViewModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmitPropertyService {
  appurl: string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  submitProperty(viewModel: SubmitPropertyViewModel): Observable<number> {
    return this.http.post<number>(this.appurl + "Account/SubmitProperty", viewModel);
  }

  addPropertyFeatures(viewModel: AddPropertyFeaturesViewModel): Observable<any> {
    return this.http.post(this.appurl + "Account/AddPropertyFeatures", viewModel);
  }
}
