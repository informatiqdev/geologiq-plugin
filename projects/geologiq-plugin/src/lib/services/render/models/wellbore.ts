import { Point } from "../../3d";

export class Wellbore {
    id: string = '';
    name?: string;
    md?: number[];
    points?: (Point | number[])[];
    wellHeadPosition?: Point | number[];
}
