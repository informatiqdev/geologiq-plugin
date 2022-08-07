import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environment";
import { Risk } from "../render/models/risk";

@Injectable({
    providedIn: 'root'
})
export class RiskService {
    private baseUrl = environment.services.fdp;

    constructor(private http: HttpClient) { }

    getRisksByWellboreId(id: string, apiKey: string): Observable<Risk[]> {
        let url = `${this.baseUrl}/services/fdp/risks/${id}.json?apiKey=${apiKey}`;
        return this.http.get<any[]>(url).pipe(
            map(items => {
                const risks: Risk[] = items.map(item => {
                    const risk: Risk = {
                        id: item.id,
                        title: item.title ?? '',
                        depth: item?.context?.wellbore?.md?.from ?? 0,
                        parent: { id }
                    };

                    return risk;
                });

                return risks;
            })
        );
    }
}