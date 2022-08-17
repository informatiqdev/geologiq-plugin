import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeologiqService } from '../3d/geologiq.service';
import { SurfaceTube } from '../render/models/surface-tube';

@Injectable({
    providedIn: 'root'
})
export class SurfaceTubeService {
    private baseUrl: string;
    private apiKey: string;
    private version: string;

    constructor(
        private http: HttpClient,
        private geologiqService: GeologiqService
    ) {
        this.version = Date.now().toString();
        const fdp =  this.geologiqService.config?.fdp;
        this.baseUrl = fdp?.baseUrl ?? '';
        this.apiKey = fdp?.apiKey ?? '';
    }

    getSurfaceTubes(id: string): Observable<SurfaceTube> {
        const url = `${this.baseUrl}/services/fdp/surface-tubes/${id}.json?apiKey=${this.apiKey}&_=${this.version}`;
        return this.http.get<any>(url).pipe(
            map(data => {
                const tube: SurfaceTube = {
                    id,
                    name: data.name ?? '',
                    md: data.md,
                    points: data.points,
                    startPosition: data.startPosition ?? [0, 0, 0]
                };

                return tube;
            })
        );
    }
}
