import { Color, Point } from '../services/3d';

export interface VisualConfig {
    wellbore?: {
        radius?: number;
        color?: Color;

        // for wellbore specific
        configs?: {
            [id: string]: {
                radius?: number;
                color?: Color;
            };
        };
    };

    casing?: {
        size?: Point;
        color?: Color;

        // for casing specific
        configs?: {
            [id: string]: {
                size?: Point;
                color?: Color;
            };
        };
    };

    risk?: {
        size?: Point;
        color?: Color;

        // for risk specific
        configs?: {
            [id: string]: {
                size?: Point;
                color?: Color;
            };
        };
    };
}
