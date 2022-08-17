import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeologiqService } from '../3d/geologiq.service';
import { Casing } from '../render/models/casing';

@Injectable({
    providedIn: 'root'
})
export class CasingService {
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

    getCasingsByWellboreId(id: string): Observable<Casing[]> {
        const url = `${this.baseUrl}/services/fdp/casings/${id}.json?apiKey=${this.apiKey}&_=${this.version}`;
        return this.http.get<any[]>(url).pipe(
            map(items => {
                const casings: Casing[] = items.map(item => {
                    const casing: Casing = {
                        id: item.id,
                        name: item.name ?? '',
                        shoeDepthMd: item.shoeDepthMd,
                        parent: { id }
                    };

                    return casing;
                });

                return casings;
            })
        );
    }
}
