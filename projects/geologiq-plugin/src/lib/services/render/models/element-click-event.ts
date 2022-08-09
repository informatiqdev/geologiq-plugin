import { DsisWellbore, GeologiqSurface } from './geologiq-data';

export interface ElementClickvent {
    type: string;
    data: DsisWellbore | GeologiqSurface | string;
}
