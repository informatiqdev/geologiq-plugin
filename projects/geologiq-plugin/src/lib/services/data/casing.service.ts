import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GeologiqService } from "../3d/geologiq.service";
import { Casing } from "../render/models/casing";

@Injectable({
    providedIn: 'root'
})
export class CasingService {
    private baseUrl: string;
    private apiKey: string;

    constructor(
        private http: HttpClient,
        private geologiqService: GeologiqService
    ) {
        this.baseUrl = this.geologiqService.config?.fdp?.baseUrl ?? '';
        this.apiKey = this.geologiqService.config?.fdp?.apiKey ?? '';
    }

    getCasingsByWellboreId(id: string): Observable<Casing[]> {
        let url = `${this.baseUrl}/services/fdp/casings/${id}.json?apiKey=${this.apiKey}`;
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