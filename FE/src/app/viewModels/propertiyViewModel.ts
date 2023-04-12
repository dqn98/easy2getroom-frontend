export class PropertyViewModel {
    id: number;
    title: string;
    propertyType: string;
    propertyStatus: string[];
    city: string;
    zipCode: string;
    neighborhood?: string[];
    street: string[];
    location: Location;
    formattedAddress: string;
    features: string[];
    plans: [
        {
            name: string;
            desc: string;
            area: {
                value: number;
                unit: string;
            }
        }
    ];
    gallery: [
        {
            small: string;
            medium: string;
            big: string;
        }
    ]
    videos?: {
        name: string;
        link: string;
    }
    lastUpdate: Date;
    views: number;
    price: number;
    published: Date;
}