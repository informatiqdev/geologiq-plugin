import { Point } from './point';
import { Color } from './color';

export class Tube {
    id = '';
    name?: string;
    startPosition?: Point;
    points?: Point[];
    lengths?: number[];
    radius?: number;
    color?: Color;
}
