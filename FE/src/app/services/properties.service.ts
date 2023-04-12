import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from 'src/app/models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  public url = "assets/data/";
  public appUrl = "https://localhost:44390/api/Property/";
  constructor(private http: HttpClient) {
  }

  public getProperties(): Observable<Property[]> {
    // return this.http.get<Property[]>(this.url + 'properties.json');
    return this.http.get<Property[]>(this.appUrl + 'GetProperties');
  }

  public getPropertyOwner(id: number): Observable<any> {
    return this.http.get<any>(this.appUrl + 'GetPropertyOwner/' + id);
  }

  public getPropertyById(id: number): Observable<Property> {
    // return this.http.get<Property>(this.url + 'property-' + id + '.json');
    return this.http.get<Property>(this.appUrl + 'GetPropertyById/' + id);
  }
  public getPropertyByIdToEdit(id: number): Observable<Property> {
    // return this.http.get<Property>(this.url + 'property-' + id + '.json');
    return this.http.get<Property>(this.appUrl + 'GetPropertyByIdToEdit/' + id);
  }

  public getFeaturedProperties(): Observable<Property[]> {
    // return this.http.get<Property[]>(this.url + 'featured-properties.json');
    return this.http.get<Property[]>(this.appUrl + 'GetFeaturedProperties');
  }

  public getRelatedProperties(id: number): Observable<Property[]> {
    // return this.http.get<Property[]>(this.url + 'related-properties.json');
    return this.http.get<Property[]>(this.appUrl + 'GetRelatedProperties/' + id);
  }
  public getPropertiesByAgentId(agentId): Observable<Property[]> {
    return this.http.get<Property[]>(this.url + 'properties-agentid-' + agentId + '.json');
  }
}
