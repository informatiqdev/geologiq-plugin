import { EntityRef } from './entity-ref';
import { Point } from 'geologiq-plugin';

export class Trajectory {
    id: string = '';
    name?: string;
    wellbore?: EntityRef;
    md?: number[];
    points?: Point[];
    inclination?: number[];
    azimuth?: number[];
    trueAzimuth?: number[];
    dls?: number[];
    rkbMsl?: number;
    msl?: number;
    wellCategory?: string;
    wellHeadPosition?: Point;
}