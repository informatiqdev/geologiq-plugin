import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Surface } from '../models/surface';
import { SurfaceSample } from '../samples/surface.sample';

@Injectable({
    providedIn: 'root'
})
export class SurfaceService {
   
    get(): Observable<Surface[]> {
        return of(SurfaceSample ?? []);
    }
}