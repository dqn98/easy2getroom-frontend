import { City } from './ctity';
import { Wards } from './wards';

export class District {
    id: number;
    name: string;
    city: City;
    wards: Wards[];
}