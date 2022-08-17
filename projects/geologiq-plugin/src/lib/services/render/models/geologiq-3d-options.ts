import { Color, Point } from '../../3d';

export interface Wellbore3dOptions {
    default?: Wellbore3dConfig;
    wellbores?: Map<string, Wellbore3dConfig>;
}

export interface Wellbore3dConfig {
    radius?: number;
    color?: Color;
}

export interface Risk3dOptions {
    default?: Risk3dConfig;
    risks?: Map<string, Risk3dConfig>;
}

export interface Risk3dConfig {
    size?: Point;
    color?: Color;
}

export interface Casing3dOptions {
    default?: Casing3dConfig;
    casings?: Map<string, Casing3dConfig>;
}

export interface Casing3dConfig {
    size?: Point;
    color?: Color;
}

export interface Surface3dOptions {
    default?: Surface3dConfig;
    surfaces?: Map<string, Surface3dConfig>;
}

export interface Surface3dConfig {}

export interface Infrastructure3dOptions {
    default?: Infrastructure3dConfig;
    infrastructures?: Map<string, Infrastructure3dConfig>;
}

export interface Infrastructure3dConfig {}

export interface SurfaceTube3dConfig {}

export interface SurfaceTube3dOptions {
    default?: SurfaceTube3dConfig;
    surfaceTubes?: Map<string, SurfaceTube3dConfig>;
}