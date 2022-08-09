import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeologiqService } from '../3d/geologiq.service';
import { Wellbore } from '../render/models/wellbore';

@Injectable({
    providedIn: 'root'
})
export class WellboreService {
    private baseUrl: string;
    private apiKey: string;

    constructor(
        private http: HttpClient,
        private geologiqService: GeologiqService
    ) {
        this.baseUrl = this.geologiqService.config?.fdp?.baseUrl ?? '';
        this.apiKey = this.geologiqService.config?.fdp?.apiKey ?? '';
    }

    getWellbore(id: string): Observable<Wellbore> {
        const url = `${this.baseUrl}/services/fdp/wellbores/${id}.json?apiKey=${this.apiKey}`;
        return this.http.get<any>(url).pipe(
            map(traj => {
                const head = traj.well?.wellHeadPosition?.utm?.geometry?.coordinates ?? [0, 0, 0];
                const wellbore: Wellbore = {
                    id,
                    name: traj.wellbore?.name ?? '',
                    md: traj.md,
                    points: traj.points,
                    wellHeadPosition: [head[0], head[2], head[1]]
                };

                return wellbore;
            })
        );
    }
}
