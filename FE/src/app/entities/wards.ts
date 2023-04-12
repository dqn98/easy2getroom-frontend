import { District } from './district';
import { Property } from './property';

export class Wards {
    id: number;
    name: string;
    district: District;
    properties: Property[];
}