import { Point } from './point';
import { Color } from './color';

export class Model3D {
    id = '';
    name?: string;
    type?: string;
    url?: string;
    position?: Point;
    rotation?: Point;
    color?: Color;
    size?: Point;
    parent?: string;
    offset?: number;
    direction?: string;
    apiKey?: string;
}
