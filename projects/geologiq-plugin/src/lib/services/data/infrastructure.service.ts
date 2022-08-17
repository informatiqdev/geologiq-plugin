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

    getInfrastructure(id: string): Observable<Infrastructure> {
        const baseUrl = `${this.baseUrl}/services/fdp/infrastructures`;
        const url = `${baseUrl}/${id}.json?apiKey=${this.apiKey}&_=${this.version}`;
        return this.http.get<any>(url).pipe(
            map(infra => {
                if (!infra) {
                    return infra;
                }

                let filename = infra.filename ?? '';
                filename = filename.startsWith('/') ? filename.replace(/^\//, '') : filename;
                const fileUrl = `${baseUrl}/${filename}`;

                const structure: Infrastructure = {
                    id: infra.id,
                    name: infra.name,
                    position: infra.position,
                    rotation: infra.rotation,
                    size: infra.size,
                    url: fileUrl
                };

                return structure;
            })
        );
    }
}
