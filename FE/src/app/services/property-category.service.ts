import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PropertyCategory } from 'src/app/entities/propertyCategory';

@Injectable({
  providedIn: 'root'
})
export class PropertyCategoryService {

  appUrl: string = environment.baseUrl;
  constructor(public http: HttpClient) { }

  getPropertyTypes(): Observable<PropertyCategory[]> {
    return this.http.get<PropertyCategory[]>(this.appUrl + "PropertyCategory/GetPropertyCategories");
  }
}
