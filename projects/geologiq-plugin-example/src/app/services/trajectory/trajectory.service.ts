import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Trajectory } from '../models/trajectory';
import { TrajectorySample } from '../samples/trajectory-sample';

@Injectable({
    providedIn: 'root'
})

export class TrajectoryService {
   
    get(): Observable<Trajectory[]> {
        return of(TrajectorySample);
    }
}