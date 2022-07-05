import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Casing } from '../models/casing';
import { CasingSample } from '../samples/casing.sample';

@Injectable({
    providedIn: 'root'
})
export class CasingService {
   
    get(trajectoryId: string): Observable<Casing[]> {
        return of(CasingSample.get(trajectoryId) ?? []);
    }
}