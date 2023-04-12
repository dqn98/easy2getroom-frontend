import { Title } from "@angular/platform-browser";

export class Property {
    constructor(public id: number,
        public title: string,
        public desc: string,
        public propertyType: string,
        public propertyStatus: string[],
        public city: string,
        public zipCode: string[],
        public neighborhood: string[],
        public street: string[],
        public location: Location,
        public formattedAddress: string,
        public features: string[],
        public featured: boolean,
        public price: Price,
        public bedrooms: number,
        public bathrooms: number,
        public garages: number,
        public area: Area,
        public yearBuilt: number,
        public ratingsCount: number,
        public ratingsValue: number,
        public additionalFeatures: AdditionalFeature[],
        public gallery: Gallery[],
        public plans: Plan[],
        public videos: Video[],
        public published: string,
        public lastUpdate: string,
        public views: number,
        public wardsId: number,
        public districtId: number,
        public cityId: number,
        public monthlyWaterPrice: number,
        public monthlyElectricityPrice: number) { }
}

export class Announcement {
    constructor(public id: number,
        public senderId: string,
        public receiverId: string,
        public content: string,
        public type: string,
        public isRead: boolean,
        public icon: string,
        public date: Date) { }
}

export class Area {
    public id: number;
    public value: number;
    public valueFrom: number;
    public valueTo: number;
    public unit: string;
}

export class AdditionalFeature {
    constructor(public id: number,
        public name: string,
        public value: string) { }
}

export class Location {
    constructor(public id: number,
        public lat: number,
        public lng: number) { }
}

export class Price {
    public priceFrom: number;
    public priceTo: number;
    public priceFor: number;
}


export class Gallery {
    constructor(public id: number,
        public small: string,
        public medium: string,
        public big: string) { }
}

export class Plan {
    constructor(public id: number,
        public name: string,
        public desc: string,
        public area: Area,
        public rooms: number,
        public baths: number,
        public image: string) { }
}

export class Video {
    constructor(public id: number,
        public name: string,
        public link: string) { }
}

export class Pagination {
    constructor(public page: number,
        public perPage: number,
        public prePage: number,
        public nextPage: number,
        public total: number,
        public totalPages: number) { }
}
