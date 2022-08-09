import { Point } from '../../3d';

export class Wellbore {
    id = '';
    name?: string;
    md?: number[];
    points?: (Point | number[])[];
    wellHeadPosition?: Point | number[];
}
