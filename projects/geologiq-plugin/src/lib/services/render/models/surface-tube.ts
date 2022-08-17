import { Point } from '../../3d';

export class SurfaceTube {
    id: string = '';
    name?: string;
    md?: number[];
    points?: (Point | number[])[];
    startPosition?: Point | number[];
}
