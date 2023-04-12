import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from '../../app.service';
import { FeaturesService } from 'src/app/services/features.service';
import { RentalTypeService } from 'src/app/services/rental-type.service';
import { PropertyCategoryService } from 'src/app/services/property-category.service';
import { LocationService } from 'src/app/services/location.service';
import { District } from 'src/app/entities/district';

@Component({
  selector: 'app-properties-search',
  templateUrl: './properties-search.component.html',
  styleUrls: ['./properties-search.component.scss']
})
export class PropertiesSearchComponent implements OnInit {
  @Input() variant: number = 1;
  @Input() vertical: boolean = false;
  @Input() searchOnBtnClick: boolean = false;
  @Input() removedSearchField: string;
  @Output() onSearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchClick: EventEmitter<any> = new EventEmitter<any>();
  public showMore: boolean = false;
  public form: FormGroup;
  public propertyTypes = [];
  public propertyStatuses = [];
  public cities = [];
  public neighborhoods = [];
  public streets = [];
  public features = [];
  public districts = [];
  public wards = [];

  public cityId: number;
  public wardsId: number;
  public districtId: number;

  //Check load success
  public isLoadPropertyTypes: boolean = false;
  public isLoadPropertyStatus: boolean = false;
  public isLoadCities: boolean = false;
  public isLoadDistricts: boolean = false;
  public isLoadWards: boolean = false;
  public isLoadFeatures: boolean = false;

  constructor(public appService: AppService,
    public fb: FormBuilder,
    public featuresService: FeaturesService,
    public rentalTypeService: RentalTypeService,
    public propertyCategoryService: PropertyCategoryService,
    public locationService: LocationService) {

  }

  ngOnInit() {
    if (this.vertical) {
      this.showMore = true;
    };
    this.getFeatures();
    // this.propertyTypes = this.appService.getPropertyTypes();
    // this.propertyStatuses = this.appService.getPropertyStatuses();
    this.getPropertyTypes();
    this.getPropertyStatuses();
    this.getCities();
    // this.cities = this.appService.getCities();
    this.neighborhoods = this.appService.getNeighborhoods();
    this.streets = this.appService.getStreets();
  }

  public buildForm() {
    this.form = this.fb.group({
      propertyType: null,
      propertyStatus: null,
      price: this.fb.group({
        from: null,
        to: null
      }),
      city: null,
      district: null,
      wards: null,
      zipCode: null,
      neighborhood: null,
      street: null,
      bedrooms: this.fb.group({
        from: null,
        to: null
      }),
      bathrooms: this.fb.group({
        from: null,
        to: null
      }),
      garages: this.fb.group({
        from: null,
        to: null
      }),
      area: this.fb.group({
        from: null,
        to: null
      }),
      yearBuilt: this.fb.group({
        from: null,
        to: null
      }),
      features: this.buildFeatures()
    });

    this.onSearchChange.emit(this.form);
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
    });
  }

  public getCities() {
    this.cities = [];
    this.locationService.getCities().subscribe(cities => {
      cities.forEach(city => {
        let vm = {
          id: city.id,
          name: city.name
        };
        this.cities.push(vm);
      });

      this.isLoadCities = true;
    });
  }

  public getDistrict(cityId: number) {
    this.locationService.getDistricts(cityId).subscribe(districts => {
      districts.forEach(district => {
        let vm = {
          id: district.id,
          name: district.name
        };
        this.districts.push(vm);
      });
      this.isLoadDistricts = true;
    });
  }


  public getWards(districtId: number) {
    this.locationService.getWards(districtId).subscribe(wards => {
      wards.forEach(wards => {
        let vm = {
          id: wards.id,
          name: wards.name
        };
        this.wards.push(vm);
      });
      this.isLoadWards = true;
    });
  }

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


  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf(".") > -1) {
        let arr = this.removedSearchField.split(".");
        this.form.controls[arr[0]]['controls'][arr[1]].reset();
      }
      else if (this.removedSearchField.indexOf(",") > -1) {
        let arr = this.removedSearchField.split(",");
        this.form.controls[arr[0]]['controls'][arr[1]]['controls']['selected'].setValue(false);
      }
      else {
        this.form.controls[this.removedSearchField].reset();
      }
    }
  }

  public reset() {
    this.form.reset({
      propertyType: null,
      propertyStatus: null,
      price: {
        from: null,
        to: null
      },
      city: null,
      district: null,
      wards: null,
      zipCode: null,
      neighborhood: null,
      street: null,
      bedrooms: {
        from: null,
        to: null
      },
      bathrooms: {
        from: null,
        to: null
      },
      garages: {
        from: null,
        to: null
      },
      area: {
        from: null,
        to: null
      },
      yearBuilt: {
        from: null,
        to: null
      },
      features: this.features
    });
  }

  public search() {
    this.onSearchClick.emit();
  }

  public onSelectCity(city) {
    this.getDistrict(city.id);
  }

  public onSelectDistrict(district) {
    this.getWards(district.id);
  }
  public onSelectNeighborhood() {
    // this.form.controls['street'].setValue(null, { emitEvent: false });
  }

  public getAppearance() {
    return (this.variant != 3) ? 'outline' : '';
  }
  public getFloatLabel() {
    return (this.variant == 1) ? 'always' : '';
  }


}
