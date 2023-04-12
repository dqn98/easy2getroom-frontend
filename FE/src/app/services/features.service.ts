import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Feature } from 'src/app/entities/feature'

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  appUrl: string;
  constructor(public http: HttpClient) {
    this.appUrl = environment.baseUrl;
  }

  getFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(this.appUrl + "Feature/GetFeatures");
  }
}
