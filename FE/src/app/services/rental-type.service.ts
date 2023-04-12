import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { RentalType } from '../entities/rentalType';

@Injectable({
  providedIn: 'root'
})
export class RentalTypeService {
  appUrl: string = environment.baseUrl;

  constructor(public http: HttpClient) { }

  getPropertyStatuses(): Observable<RentalType[]> {
    return this.http.get<RentalType[]>(this.appUrl + "RentalType/GetRentalTypes");
  }
}
