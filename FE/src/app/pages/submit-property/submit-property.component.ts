/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { MapsAPILoader } from '@agm/core';
import { LocationService } from 'src/app/services/location.service';
import { FeaturesService } from 'src/app/services/features.service';
import { SubmitPropertyService } from 'src/app/services/submit-property.service';
import { RentalTypeService } from 'src/app/services/rental-type.service';
import { AuthService } from 'src/app/services/auth.service';
import { PropertyCategoryService } from 'src/app/services/property-category.service';
import { SubmitPropertyViewModel } from 'src/app/viewModels/submitPropertyViewModel';
import { AddPropertyFeaturesViewModel } from 'src/app/viewModels/addPropertyFeaturesViewModel';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { PropertyImage } from 'src/app/entities/propertyImage';
import * as signalR from "@aspnet/signalr";
import { AddLogViewModel } from 'src/app/viewModels/addLogViewModel';
import { LogsService } from 'src/app/services/logs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-property',
  templateUrl: './submit-property.component.html',
  styleUrls: ['./submit-property.component.scss']
})
export class SubmitPropertyComponent implements OnInit {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  @ViewChild('addressAutocomplete') addressAutocomplete: ElementRef;
  private appUrl = environment.baseUrl;
  public submitForm: FormGroup;
  public features = [];
  public propertyTypes = [];
  public propertyStatuses = [];
  public cities = [];
  public districts = [];
  public wards = [];
  public neighborhoods = [];
  public streets = [];
  public lat: number = 40.678178;
  public lng: number = -73.944158;
  public zoom: number = 12;

  private hubConnection;

  // File upload
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  public response: string;
  public newestPropertyId: number;

  //Form upload
  public isLoadPropertyTypes: boolean = false;
  public isLoadPropertyStatus: boolean = false;
  public isLoadCities: boolean = false;
  public isLoadDistricts: boolean = false;
  public isLoadWards: boolean = false;
  public isLoadFeatures: boolean = false;
  public isSubmitSucess: boolean;
  public isBuildForm: boolean = false;

  constructor(public appService: AppService,
    private fb: FormBuilder,
    public locationService: LocationService,
    public featuresService: FeaturesService,
    public rentalTypeService: RentalTypeService,
    public submitPropertyService: SubmitPropertyService,
    public router: Router,
    public authService: AuthService,
    public logsService: LogsService,
    public propertyCategoryService: PropertyCategoryService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.buildForm();
    this.getCities();
    this.getFeatures();
    this.getPropertyTypes();
    this.getPropertyStatuses();
    this.setCurrentPosition();
    this.placesAutocomplete();
    this.initializeUploader();
    this.signalrConn();
  }

  public buildForm() {
    this.submitForm = this.fb.group({
      basic: this.fb.group({
        gallery: [null, Validators.required],
        title: [null, Validators.required],
        desc: [null, Validators.required],
        price: [{ value: null, disabled: true }, Validators.required],
        priceFrom: [{ value: null, disabled: true }, Validators.required],
        priceTo: [{ value: null, disabled: true }, Validators.required],
        acreage: [{ value: null, disabled: true }, Validators.required],
        acreageFrom: [{ value: null, disabled: true }, Validators.required],
        acreageTo: [{ value: null, disabled: true }, Validators.required],
        monthlyWaterPrice: [null, Validators.required],
        monthlyElectricityPrice: [null, Validators.required],
        propertyType: [{ value: null, disabled: true }, Validators.required],
        rentalType: [{ value: null, disabled: true }, Validators.required],
      }),
      address: this.fb.group({
        location: ['', Validators.required],
        city: [{ value: null, disabled: true }, Validators.required],
        district: [{ value: null, disabled: true }, Validators.required],
        ward: [{ value: null, disabled: true }, Validators.required]
      }),
      additional: this.fb.group({
        bedrooms: '',
        bathrooms: '',
        garages: '',
        yearBuilt: '',
        features: this.buildFeatures()
      })
    });
    this.isBuildForm = true;
  }
  public initializeUploader() {
    this.uploader = new FileUploader({
      url: this.appUrl + 'PropertyImage/' + this.newestPropertyId + '/AddImageForProperty',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      queueLimit: 8,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: PropertyImage = JSON.parse(response);
        const image = {
          id: res.id,
          url: res.url,
          propertyId: res.propertyId,
          publicId: res.publicId
        };
        this.isSubmitSucess = true;
        // this.images.push(image);
      }
    }
  }

  public onChangeRentalType(e: any) {
    if (e.value.name == 'Need rent' || e.value.name == 'Need sharing') {
      this.submitForm.controls.basic.get('priceFrom').enable();
      this.submitForm.controls.basic.get('priceTo').enable();
      this.submitForm.controls.basic.get('acreageFrom').enable();
      this.submitForm.controls.basic.get('acreageTo').enable();

      this.submitForm.controls.basic.get('price').disable();
      this.submitForm.controls.basic.get('acreage').disable();
    }
    else {
      this.submitForm.controls.basic.get('priceFrom').disable();
      this.submitForm.controls.basic.get('priceTo').disable();
      this.submitForm.controls.basic.get('acreageFrom').disable();
      this.submitForm.controls.basic.get('acreageTo').disable();

      this.submitForm.controls.basic.get('price').enable();
      this.submitForm.controls.basic.get('acreage').enable();
    }
  }

  public getFeatures() {
    this.features = [];
    this.featuresService.getFeatures().subscribe(features => {
      features.forEach(feature => {
        let vm = {
          id: feature.id,
          name: feature.name,
          selected: false
        };
        this.features.push(vm);
      });
      this.isLoadFeatures = true;
      this.buildForm();
    });
  }

  public getPropertyTypes() {
    this.propertyCategoryService.getPropertyTypes().subscribe(types => {
      types.forEach(type => {
        let vm = {
          id: type.id,
          name: type.name
        };
        this.propertyTypes.push(vm);
      });
      this.isLoadPropertyTypes = true;
      if (this.isBuildForm == true) {
        this.submitForm.controls.basic.get('propertyType').enable();
      }
    });
  }

  public getPropertyStatuses() {
    this.rentalTypeService.getPropertyStatuses().subscribe(statuses => {
      statuses.forEach(status => {
        let vm = {
          id: status.id,
          name: status.name
        };
        this.propertyStatuses.push(vm);
      });
      this.isLoadPropertyStatus = true;
      if (this.isBuildForm == true) {
        this.submitForm.controls.basic.get('rentalType').enable();
      }
    });
  }

  public onSelectionChange(e: any) {
    if (e.selectedIndex == 3) {
      this.horizontalStepper._steps.forEach(step => step.editable = false);
      if (this.authService.loggedIn()) {
        let vm: SubmitPropertyViewModel = {
          userId: this.authService.decodedToken.user_id,
          title: this.submitForm.value.basic.title,
          desc: this.submitForm.value.basic.desc,
          propertyCategoryId: this.submitForm.value.basic.propertyType.id,
          rentalTypeId: this.submitForm.value.basic.rentalType.id,
          price: this.submitForm.value.basic.price,
          priceFrom: this.submitForm.value.basic.priceFrom,
          priceTo: this.submitForm.value.basic.priceTo,
          acreage: this.submitForm.value.basic.acreage,
          acreageFrom: this.submitForm.value.basic.agreageFrom,
          acreageTo: this.submitForm.value.basic.acreageTo,
          monthlyWaterPrice: this.submitForm.value.basic.monthlyWaterPrice,
          monthlyElectricityPrice: this.submitForm.value.basic.monthlyElectricityPrice,
          address: this.submitForm.value.address.location,
          lat: this.lat,
          lng: this.lng,
          bedrooms: this.submitForm.value.additional.bedrooms,
          bathrooms: this.submitForm.value.additional.bathrooms,
          garages: this.submitForm.value.additional.garages,
          yearBuild: this.submitForm.value.additional.yearBuilt,
          wardsId: this.submitForm.value.address.ward.id
        };

        if (vm.rentalTypeId == 3 || vm.rentalTypeId == 1) {
          vm.price = 0;
          vm.acreage = 0;
        }
        else {
          vm.priceFrom = 0;
          vm.priceTo = 0;
          vm.acreageFrom = 0;
          vm.acreageTo = 0;
        }
        this.submitPropertyService.submitProperty(vm).subscribe(res => {
          let content = 'New property' + this.submitForm.value.basic.title + ' was submitted by user ' + this.authService.decodedToken.full_name;
          this.sendSubbmitLog(content);
          if (res != 0) {
            // Add images and features
            let featuresSelected = [];
            this.submitForm.value.additional.features.filter(feature => {
              if (feature.selected == true) {
                featuresSelected.push(feature.id);
              }
            });
            let vm: AddPropertyFeaturesViewModel = {
              propertyId: res,
              features: featuresSelected
            };
            this.submitPropertyService.addPropertyFeatures(vm).subscribe(res => {
              this.isSubmitSucess = true;
            }, error => {
              this.isSubmitSucess = false;
            });
            this.newestPropertyId = res;
            this.uploader.setOptions({
              url: this.appUrl + 'PropertyImage/' + res + '/AddImageForProperty'
            });
            this.uploader.uploadAll();
          }
        });
      }
    }
  }
  public reset() {
    this.horizontalStepper.reset();
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }

  // -------------------- Address ---------------------------  
  public onSelectCity(city) {
    this.getDistrict(city.id);
  }
  public onSelectDistrict(district) {
    this.getWards(district.id);
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }
  private placesAutocomplete() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.addressAutocomplete.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          };
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.getAddress();
        });
      });
    });
  }

  public getAddress() {
    this.appService.getAddress(this.lat, this.lng).subscribe(response => {
      if (response['results'].length) {
        let address = response['results'][0].formatted_address;
        this.submitForm.controls.address.get('location').setValue(address);
        this.setAddresses(response['results'][0]);
      }
    })
  }
  public onMapClick(e: any) {
    this.lat = e.coords.lat;
    this.lng = e.coords.lng;
    this.getAddress();
  }
  public onMarkerClick(e: any) {
    console.log(e);
  }

  public setAddresses(result) {
    this.submitForm.controls.address.get('city').setValue(null);

    let address: string = "";

    let newCity;

    result.address_components.forEach(item => {
      if (item.types.indexOf('street_number') > -1) {
        address = address + item.long_name + " ";
      }
      if (item.types.indexOf('route') > -1) {
        address = address + item.long_name;
      }
      if (item.types.indexOf('locality') > -1) {
        if (this.cities.filter(city => city.name == item.long_name)[0]) {
          newCity = this.cities.filter(city => city.name == item.long_name)[0];
        }
        else {
          newCity = { id: this.cities.length + 1, name: item.long_name };
          this.cities.push(newCity);
        }
        this.submitForm.controls.address.get('city').setValue(newCity);
      }
    });
    this.submitForm.controls.address.get('location').setValue(address);
  }

  public getCities() {
    this.cities = [];
    this.districts = [];
    this.wards = [];
    this.locationService.getCities().subscribe(cities => {
      cities.forEach(city => {
        let vm = {
          id: city.id,
          name: city.name
        };
        this.cities.push(vm);
      });
      if (this.isBuildForm == true) {
        this.submitForm.controls.address.get('city').enable();
      }
      this.isLoadCities = true;
    });
  }
  public getDistrict(cityId: number) {
    this.districts = [];
    this.wards = [];
    this.locationService.getDistricts(cityId).subscribe(districts => {
      districts.forEach(district => {
        let vm = {
          id: district.id,
          name: district.name
        };
        this.districts.push(vm);
      });
      if (this.isBuildForm == true) {
        this.submitForm.controls.address.get('district').enable();
      }
      this.isLoadDistricts = true;
    });
  }


  public getWards(districtId: number) {
    this.wards = [];
    this.locationService.getWards(districtId).subscribe(wards => {
      wards.forEach(ward => {
        let vm = {
          id: ward.id,
          name: ward.name
        };
        this.wards.push(vm);
      });
      if (this.isBuildForm == true) {
        this.submitForm.controls.address.get('ward').enable();
      }
      this.isLoadWards = true;
    });
  }

  // -------------------- Additional ---------------------------  
  public buildFeatures() {
    const arr = this.features.map(feature => {
      return this.fb.group({
        id: feature.id,
        name: feature.name,
        selected: feature.selected
      });
    })
    return this.fb.array(arr);
  }
  public signalrConn() {
    //Init Connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44390/LoggingHub?user=" + this.authService.decodedToken.user_id)
      .build();

    //Call client methods from hub to update User
    this.hubConnection.on("UpdateUserList", () => { });

    //Start Connection
    this.hubConnection
      .start()
      .then(function () {
        console.log("Connected");
      }).catch(function (err) {
        return console.error(err.toString());
      });
  }

  public sendSubbmitLog(content: string) {
    //Send Message
    if (content != '') {
      let viewModel: AddLogViewModel = {
        content: content,
        typeId: 5
      };
      this.logsService.addLog(viewModel).subscribe(log => {
        console.log(log);
        this.hubConnection.invoke('SendLog', log);
      });
    }
  }

}