import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environment";
import { Casing } from "../render/models/casing";

@Injectable({
    providedIn: 'root'
})
export class CasingService {
    private baseUrl = environment.services.fdp;

    constructor(private http: HttpClient) { }

    getCasingsByWellboreId(id: string, apiKey: string): Observable<Casing[]> {
        let url = `${this.baseUrl}/services/fdp/casings/${id}.json?apiKey=${apiKey}`;
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