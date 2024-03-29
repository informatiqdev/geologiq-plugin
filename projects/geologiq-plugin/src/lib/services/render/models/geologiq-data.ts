import { Risk } from './risk';
import { Casing } from './casing';
import { Wellbore } from './wellbore';
import { Surface } from './surface';
import { Infrastructure } from './infrastructure';
import { Casing3dOptions, Infrastructure3dConfig, Risk3dOptions, Surface3dConfig, SurfaceTube3dConfig, Wellbore3dOptions } from './geologiq-3d-options';
import { Point } from '../../3d';
import { SurfaceTube } from './surface-tube';

export interface Ocean {
    size: Point;
    position: Point;
    rotation: number;
}

export class GeologiqSurface {
    id = '';
    name = '';

    static isGeologiqSurface(data: any): data is GeologiqSurface {
        return data && data.id && data.name;
    }
}

export class DsisWellbore {
    wellId = '';
    wellboreId = '';
    defSurveyHeaderId = '';

    static getId(wellbore: DsisWellbore): string {
        return `${wellbore.wellboreId}-${wellbore.defSurveyHeaderId}`;
    }

    static isDsisWellbore(data: any): data is DsisWellbore {
        return data && data.wellId && data.wellboreId && data.defSurveyHeaderId;
    }
}

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

export interface InfrastructureData {
    infrastructures: Infrastructure[];
    config?: Infrastructure3dConfig;
}

export interface SurfaceTubeData {
    surfaceTubes: SurfaceTube[];
    config?: SurfaceTube3dConfig;
}
