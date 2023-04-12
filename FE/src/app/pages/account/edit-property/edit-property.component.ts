import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Property } from 'src/app/app.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PropertiesService } from 'src/app/services/properties.service';
import { LocationService } from 'src/app/services/location.service';
import { PropertyImagesService } from 'src/app/services/property-images.service';

import { UpdateBasicFormViewModel } from 'src/app/viewModels/updateBasicFormViewModel';
import { UpdateAddressFormViewModel } from 'src/app/viewModels/updateAddressFormViewModel';
import { UpdateAdditionalFormViewModel } from 'src/app/viewModels/updateAdditionalFormViewModel';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss']
})
export class EditPropertyComponent implements OnInit {
  @ViewChild('addressAutocomplete') addressAutocomplete: ElementRef;
  public propertyId: number;
  // Form conditions
  public isForRentalType: boolean;
  public isSharingRentalType: boolean;

  public isLoadCities: boolean = false;
  public isLoadDistricts: boolean = false;
  public isLoadWards: boolean = false;
  public images: any[] = [];
  public imagesLimited: number = 0;

  private sub: any;
  public property: Property;
  public submitForm: FormGroup;
  public features = [];
  public propertyTypes = [];
  public propertyStatuses = [];
  public cities = [];
  public districts = [];
  public wards = [];
  public neighborhoods = [];
  public lat: number = 40.678178;
  public lng: number = -73.944158;
  public zoom: number = 12;
  public propertyImages: any[];
  constructor(public appService: AppService,
    public propertiesService: PropertiesService,
    public propertyImagesService: PropertyImagesService,
    private activatedRoute: ActivatedRoute,
    public locationService: LocationService,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
    public accountService: AccountService) { }

  ngOnInit() {
    this.buildForm();
    this.placesAutocomplete();
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.propertyId = params['id'];
      this.getPropertyById(params['id']);
      this.getImages(params['id']);
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public buildForm() {
    this.features = this.appService.getFeatures();
    this.propertyTypes = this.appService.getPropertyTypes();
    this.propertyStatuses = this.appService.getPropertyStatuses();

    this.submitForm = this.fb.group({
      basic: this.fb.group({
        title: [null, Validators.required],
        desc: [null, Validators.required],
        propertyType: [null, Validators.required],
        rentalType: [null, Validators.required],
        gallery: null,
        acreage: [{ value: '', disabled: true }, Validators.required],
        acreageFrom: [{ value: '', disabled: true }, Validators.required],
        acreageTo: [{ value: '', disabled: true }, Validators.required],
        price: [{ value: '', disabled: true }, Validators.required],
        priceFrom: [{ value: '', disabled: true }, Validators.required],
        priceTo: [{ value: '', disabled: true }, Validators.required],
      }),
      address: this.fb.group({
        location: ['', Validators.required],
        city: ['', Validators.required],
        district: ['', Validators.required],
        wards: ['', Validators.required]
      }),
      additional: this.fb.group({
        bedrooms: '',
        bathrooms: '',
        garages: '',
        yearBuilt: '',
        features: this.buildFeatures()
      })
    });
  }

  public getPropertyById(id) {
    this.propertiesService.getPropertyByIdToEdit(id).subscribe(data => {
      this.getCities();
      this.property = data;
      console.log(data);
      this.getDistrict(this.property.cityId);
      this.getWards(this.property.districtId);

      this.submitForm.controls.basic.get('title').setValue(this.property.title);
      this.submitForm.controls.basic.get('desc').setValue(this.property.desc);
      this.submitForm.controls.basic.get('propertyType').setValue(this.propertyTypes.filter(p => p.name == this.property.propertyType)[0]);
      this.submitForm.controls.basic.get('rentalType').setValue(this.propertyStatuses.filter(p => p.name == this.property.propertyStatus[0])[0]);
      if (this.property.propertyStatus[0] == 'For rent' || this.property.propertyStatus[0] == 'For sharing') {
        this.submitForm.controls.basic.get('price').enable();
        this.submitForm.controls.basic.get('acreage').enable();

        this.submitForm.controls.basic.get('priceFrom').disable();
        this.submitForm.controls.basic.get('priceTo').disable();
        this.submitForm.controls.basic.get('acreageFrom').disable();
        this.submitForm.controls.basic.get('acreageTo').disable();
      }
      else {
        this.submitForm.controls.basic.get('price').disable();
        this.submitForm.controls.basic.get('acreage').disable();

        this.submitForm.controls.basic.get('priceFrom').enable();
        this.submitForm.controls.basic.get('priceTo').enable();
        this.submitForm.controls.basic.get('acreageFrom').enable();
        this.submitForm.controls.basic.get('acreageTo').enable();
      }
      this.submitForm.controls.basic.get('price').setValue(this.property.price.priceFor);
      this.submitForm.controls.basic.get('priceFrom').setValue(this.property.price.priceFrom);
      this.submitForm.controls.basic.get('priceTo').setValue(this.property.price.priceTo);
      this.submitForm.controls.basic.get('acreage').setValue(this.property.area.value);
      this.submitForm.controls.basic.get('acreageFrom').setValue(this.property.area.valueFrom);
      this.submitForm.controls.basic.get('acreageTo').setValue(this.property.area.valueTo);
      const images: any[] = [];
      this.imagesLimited = 8 - this.property.gallery.length;

      this.submitForm.controls.address.get('location').setValue(this.property.formattedAddress);
      this.lat = this.property.location.lat;
      this.lng = this.property.location.lng;
      this.getAddress();
      // this.submitForm.controls.address.get('city').setValue(this.property.cityId);
      // if (this.isLoadCities == true) {
      //   this.submitForm.controls.address.get('city').setValue(this.property.cityId);
      //   console.log(this.cities.filter(c => c.id == this.property.cityId));
      //   console.log(this.cities.length);
      // }
      this.submitForm.controls.additional.get('bedrooms').setValue(this.property.bedrooms);
      this.submitForm.controls.additional.get('bathrooms').setValue(this.property.bathrooms);
      this.submitForm.controls.additional.get('garages').setValue(this.property.garages);
      this.submitForm.controls.additional.get('yearBuilt').setValue(this.property.yearBuilt);
      this.features.forEach(feature => {
        this.property.features.forEach(name => {
          if (feature.name == name) {
            feature.selected = true;
          }
        })
      })
      this.submitForm.controls.additional.get('features').setValue(this.features);
    });
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

  public getImages(id) {
    this.propertyImagesService.getPropertyImages(id).subscribe(images => {
      this.images = images;
        if(this.images.length >= 8) {
          this.submitForm.controls.basic.get('gallery').disable();
        }
    });
  }

  public deleteImageForProperty(image) {
    if(this.images.length <= 8) {
      this.submitForm.controls.basic.get('gallery').enable();
    }
    if(this.images.length <= 3) {
      this.snackBar.open('Each property must contain more than 3 images. Delete failed', '×', {
        verticalPosition: 'top',
        duration: 5000
      });
      return;
    }
    this.accountService.deleteImageForProperty(image.id).subscribe(res => {
      console.log(res);
      this.getImages(this.property.id);
      this.snackBar.open('This image has been deleted.', '×', {
        verticalPosition: 'top',
        duration: 4000
      });
    }, error => {
      this.snackBar.open('Delete failed.', '×', {
        verticalPosition: 'top',
        duration: 4000
      });
    })
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
      this.submitForm.controls.address.get('city').setValue(this.cities.filter(c => c.id == this.property.cityId)[0]);
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
      this.submitForm.controls.address.get('district').setValue(this.districts.filter(d => d.id == this.property.districtId)[0]);
      this.isLoadDistricts = true;
    });
  }


  public getWards(districtId: number) {
    this.wards = [];
    this.locationService.getWards(districtId).subscribe(wards => {
      wards.forEach(wards => {
        let vm = {
          id: wards.id,
          name: wards.name
        };
        this.wards.push(vm);
      });
      this.submitForm.controls.address.get('wards').setValue(this.wards.filter(w => w.id == this.property.wardsId)[0]);
      this.isLoadWards = true;
    });
  }


  // -------------------- Address ---------------------------  
  public onSelectCity(cityId) {
    this.getDistrict(cityId);
  }

  public onSelectDistrict(districtId) {
    this.getWards(districtId);
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
      let address = response['results'][0].formatted_address;
      this.submitForm.controls.address.get('location').setValue(address);
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

    var address: string = "";

    var newCity, newStreet, newNeighborhood;

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



  // -------------------- Media --------------------------- 

  public step = 0;
  setStep(index: number) {
    this.step = index;
  }

  onSubmitForm(form) {
    console.log(this.submitForm.get(form).value);
    if (this.submitForm.get(form).valid) {
      if (form == 'basic') {
        //Update basic form
        let value = this.submitForm.get(form).value;
        let viewModel: UpdateBasicFormViewModel = {
          title: value.title,
          desc: value.desc,
          propertyCategoryId: value.propertyType.id,
          rentalTypeId: value.propertyType.id,
          price: value.price,
          priceFrom: value.priceFrom,
          priceTo: value.priceTo,
          acreage: value.acreage,
          acreageFrom: value.acreageFrom,
          acreageTo: value.acreageTo,
        };
        if(value.gallery != null) {
          this.accountService.addPropertyImages(value.gallery, this.property.id).subscribe(res => {
            console.log(res);
          })
        } 
        this.accountService.updateBasicForm(viewModel, this.propertyId).subscribe(res => {
          this.nextStep();
        });
      }
      if (form == 'address') {
        //Update address form
        let value = this.submitForm.get(form).value;
        let viewModel: UpdateAddressFormViewModel = {
          address: value.location,
          lat: this.lat,
          lng: this.lng,
          wardsId: value.wards.id
        };
        this.accountService.updateAddressForm(viewModel, this.propertyId).subscribe(res => {
          this.nextStep();
        });
      }
      if (form == 'additional') {
        //Update additional form
        let value = this.submitForm.get(form).value;
        var features = [];
        value.features.filter(feature => {
          if (feature.selected == true) {
            features.push(feature.id);
          }
        });
        let viewModel: UpdateAdditionalFormViewModel = {
          bedrooms: value.bedrooms,
          bathrooms: value.bathrooms,
          garages: value.garages,
          features: features,
          yearBuild: value.yearBuild
        };
        this.accountService.updateAdditionalForm(viewModel, this.propertyId).subscribe(res => {
          this.nextStep();
        });
      }
      if (form == "additional") {
        this.snackBar.open('The property "' + this.property.title + '" has been updated.', '×', {
          verticalPosition: 'top',
          duration: 5000
        });
      }
    }
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
}
