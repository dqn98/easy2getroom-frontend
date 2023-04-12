import { Price } from "./price";
import { AdditionalFeature } from "./additionalFeature";
import { Gallery } from "./gallery";
import { Plan } from "./plan";
import { Video } from "./video";
import { Area } from "./area";
import { Location } from "./location";

export class Property {
    public id: number;
    public title: string;
    public desc: string;
    public propertyType: string;
    public propertyStatus: string[];
    public city: string;
    public zipCode: string[];
    public neighborhood: string[];
    public street: string[];
    public location: Location;
    public formattedAddress: string;
    public features: string[];
    public featured: boolean;
    public price: Price;
    public bedrooms: number;
    public bathrooms: number;
    public garages: number;
    public area: Area;
    public yearBuilt: number;
    public ratingsCount: number;
    public ratingsValue: number;
    public additionalFeatures: AdditionalFeature[];
    public gallery: Gallery[];
    public plans: Plan[];
    public videos: Video[];
    public published: string;
    public lastUpdate: string;
    public views: number
    public status: number;
    public wardsId: number;
    public districtId: number;
    public cityId: number;
    public monthlyWaterPrice: number;
    public monthlyElectricityPrice: number;
}