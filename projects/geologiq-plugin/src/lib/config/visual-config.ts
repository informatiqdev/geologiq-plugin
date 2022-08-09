import { Color, Point } from "../services/3d";

export interface VisualConfig {
    wellbore?: {
        radius?: number;
        color?: Color;
    };

    casing?: {
        size?: Point;
        color?: Color;
    };

    risk?: {
        size?: Point;
        color?: Color;
    };
}