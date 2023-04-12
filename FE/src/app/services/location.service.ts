import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../entities/ctity';
import { District } from '../entities/district';
import { Wards } from '../entities/wards';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  appUrl: string = environment.baseUrl;
  constructor(public http: HttpClient) { }

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(this.appUrl + "Location/GetCities");
  }

  getDistricts(cityId: number): Observable<District[]> {
    return this.http.get<District[]>(this.appUrl + "Location/GetDistricts/" + cityId);
  }

  getWards(districtId: number): Observable<Wards[]> {
    return this.http.get<Wards[]>(this.appUrl + "Location/GetWards/" + districtId);
  }
}
