import { DsisWellbore, GeologiqSurface } from './geologiq-data';

export interface ElementClickEvent {
    type: string;
    data: DsisWellbore | GeologiqSurface | string;
}
