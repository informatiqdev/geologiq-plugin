import { Point } from './point';
import { Color } from './color'

export class Model3D {
    id?: string;
    name?: string;
    type?: string;
    color?: Color;
    size?: Point;
    parent?: string;
    offset?: number;
    direction?: string;    
}