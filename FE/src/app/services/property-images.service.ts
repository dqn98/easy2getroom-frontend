import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyImagesService {
  public appUrl = "https://localhost:44390/api/PropertyImage/";
  constructor(private http: HttpClient) { }

  getPropertyImages(propertyId: number): Observable<any[]> {
    return this.http.get<any[]>(this.appUrl + 'GetPropertyImages/' + propertyId);
  }
}
