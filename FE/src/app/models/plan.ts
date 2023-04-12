import { Area } from "./area";

export class Plan {
    public id: number;
    public name: string;
    public desc: string;
    public area: Area;
    public rooms: number;
    public baths: number;
    public image: string;
}