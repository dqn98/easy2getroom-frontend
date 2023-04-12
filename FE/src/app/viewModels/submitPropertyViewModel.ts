export class SubmitPropertyViewModel {
    userId: string; 
    title: string;
    desc: string;
    propertyCategoryId: number;
    rentalTypeId: number;
    price: number;
    priceFrom: number;
    priceTo: number;
    acreage: number;
    acreageFrom: number;
    acreageTo: number;
    monthlyWaterPrice: number;
    monthlyElectricityPrice: number;
    address: string;
    lat: number;
    lng: number;
    bedrooms?: number;
    bathrooms?: number;
    garages?: number;
    yearBuild?: number;
    wardsId: number;
}