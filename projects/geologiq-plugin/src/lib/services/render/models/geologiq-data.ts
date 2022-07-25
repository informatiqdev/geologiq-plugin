import { Risk } from './risk';
import { Casing } from './casing';
import { Wellbore } from './wellbore';

export interface GeologiqData {
    wellbore: Wellbore;
    casings?: Casing[];
    risks?: Risk[];
}
