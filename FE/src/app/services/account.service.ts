import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetUserPropertiesViewModel } from 'src/app/viewModels/getUserPropertiesViewModel';
import { Observable, ObservableLike } from 'rxjs';
import { Property } from '../models/property';
import { FavoriteViewModel } from 'src/app/viewModels/favoriteViewModel';
import { ClientUpdateStatusViewModel } from 'src/app/viewModels/clientUpdateStatusViewModel';
import { DeletePropertyViewModel } from 'src/app/viewModels/deletePropertyViewModel';
import { RatingViewModel } from 'src/app/viewModels/ratingViewModel';
import { CheckRatingViewModel } from '../viewModels/checkRatingViewModel';
import { UpdateAnnouncementStatusViewModel } from '../viewModels/updateAnnouncementStausViewModel';
import { UpdateBasicFormViewModel } from '../viewModels/updateBasicFormViewModel';
import { UpdateAddressFormViewModel } from '../viewModels/updateAddressFormViewModel';
import { UpdateAdditionalFormViewModel } from '../viewModels/updateAdditionalFormViewModel';
import { PropertyImage } from '../entities/propertyImage';

@Injectable({
  providedIn: 'root'
})

export class AccountService {


  appUrl: string

  constructor(public http: HttpClient) {
    this.appUrl = environment.baseUrl;
  }

  getMyProperties(viewModel: GetUserPropertiesViewModel): Observable<Property[]> {
    return this.http.post<Property[]>(this.appUrl + "Account/GetMyProperties", viewModel);
  }

  favorite(viewModel: FavoriteViewModel): Observable<any> {
    return this.http.post(this.appUrl + "Account/Favorite", viewModel);
  }

  unfavorite(viewModel: FavoriteViewModel): Observable<any> {
    return this.http.post(this.appUrl + "Account/Unfavorite", viewModel);
  }

  rating(viewModel: RatingViewModel): Observable<any> {
    return this.http.post(this.appUrl + "Account/Rating", viewModel);
  }

  checkRating(viewModel: CheckRatingViewModel): Observable<number> {
    return this.http.post<number>(this.appUrl + "Account/CheckRating", viewModel);
  }

  updateStatus(viewModel: ClientUpdateStatusViewModel): Observable<any> {
    return this.http.post(this.appUrl + 'Account/UpdateStatus', viewModel);
  }

  updateAnnouncementStatus(viewModel: UpdateAnnouncementStatusViewModel): Observable<any> {
    return this.http.post(this.appUrl + 'Announcement/UpdateAnnouncementStatus', viewModel);
  }

  removeAnnouncement(id: number): Observable<any> {
    return this.http.get(this.appUrl + "Announcement/removeAnnouncement/" + id);
  }

  deleteProperty(viewModel: DeletePropertyViewModel): Observable<any> {
    return this.http.post(this.appUrl + 'Account/DeleteProperty', viewModel);
  }

  getProfile(username: string): Observable<any> {
    return this.http.get(this.appUrl + 'Account/GetProfile/' + username);
  }

  // Update profile

  updateProfile(profileVM): Observable<any> {
    return this.http.post(this.appUrl + 'Account/UpdateProfile', profileVM);
  }

  updateAvatar(image: any, id: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', image[0].file, image[0].file.name);
    return this.http.post(this.appUrl + 'Account/' + id + "/UpdateAvatar", formData);
  }

  // Update property

  updateBasicForm(viewModel: UpdateBasicFormViewModel, propertyId: number): Observable<any> {
    return this.http.post(this.appUrl + 'Account/UpdateBasicForm/' + propertyId, viewModel);
  }

  updateAddressForm(viewModel: UpdateAddressFormViewModel, propertyId: number): Observable<any> {
    return this.http.post(this.appUrl + 'Account/UpdateAddressForm/' + propertyId, viewModel);
  }

  updateAdditionalForm(viewModel: UpdateAdditionalFormViewModel, propertyId: number): Observable<any> {
    return this.http.post(this.appUrl + 'Account/UpdateAdditionalForm/' + propertyId, viewModel);
  }

  deleteImageForProperty(id): Observable<any> {
    return this.http.get(this.appUrl + 'Account/DeleteImageForProperty/' + id);
  }

  addPropertyImages(images, propertyId): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('file', images[0].file, images[0].file.name);
    }
    console.log(formData);
    return this.http.post(this.appUrl + 'Account/AddPropertyImages/' + propertyId, formData);
  }
}
