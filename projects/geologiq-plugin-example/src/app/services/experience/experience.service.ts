import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Experience } from '../models/experience';
import { ExperienceSample } from '../samples/experience.sample';

@Injectable({
    providedIn: 'root'
})
export class ExperienceService {
   
    get(trajectoryId: string): Observable<Experience[]> {
        return of(ExperienceSample.get(trajectoryId) ?? []);
    }
}