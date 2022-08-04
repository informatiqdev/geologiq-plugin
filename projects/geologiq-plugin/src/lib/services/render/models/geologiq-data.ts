import { Risk } from './risk';
import { Casing } from './casing';
import { Wellbore } from './wellbore';
import { Surface } from './surface';
import { Casing3dOptions, Risk3dOptions, Surface3dConfig, Wellbore3dOptions } from './geologiq-3d-options';

export interface WellboreData {
    wellbores: Wellbore[];
    config?: Wellbore3dOptions;
}

export interface CasingData {
    casings: Casing[];
    config?: Casing3dOptions;
}

export interface RiskData {
    risks: Risk[];
    config?: Risk3dOptions;
}

export interface SurfaceData {
    surfaces: Surface[];
    config?: Surface3dConfig;
}
