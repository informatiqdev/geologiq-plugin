import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeologiqService } from '../3d/geologiq.service';
import { Infrastructure } from '../render/models/infrastructure';

@Injectable({
    providedIn: 'root'
})
export class InfrastructureService {
    private baseUrl: string;
    private apiKey: string;

    constructor(
        private http: HttpClient,
        private geologiqService: GeologiqService
    ) {
        this.baseUrl = this.geologiqService.config?.fdp?.baseUrl ?? '';
        this.apiKey = this.geologiqService.config?.fdp?.apiKey ?? '';
    }

    getInfrastructure(id: string): Observable<Infrastructure> {
        const baseUrl = `${this.baseUrl}/services/fdp/infrastructures`;
        const url = `${baseUrl}/${id}.json?apiKey=${this.apiKey}`;
        return this.http.get<any>(url).pipe(
            map(infra => {
                if (!infra) {
                    return infra;
                }

                let filename = infra.filename ?? '';
                filename = filename.startsWith('/') ? filename.replace(/^\//, '') : filename;
                const fileurl = `${baseUrl}/${filename}`;

                const structure = {
                    id: infra.id,
                    name: infra.name,
                    position: infra.position,
                    rotation: infra.rotation,
                    size: infra.size,
                    fileurl
                };

                return structure;
            })
        );
    }
}
