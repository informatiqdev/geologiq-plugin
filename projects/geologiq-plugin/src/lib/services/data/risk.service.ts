import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GeologiqService } from "../3d/geologiq.service";
import { Risk } from "../render/models/risk";

@Injectable({
    providedIn: 'root'
})
export class RiskService {
    private baseUrl: string;
    private apiKey: string;

    constructor(
        private http: HttpClient,
        private geologiqService: GeologiqService
    ) {
        this.baseUrl = this.geologiqService.config?.fdp?.baseUrl ?? '';
        this.apiKey = this.geologiqService.config?.fdp?.apiKey ?? '';
    }

    getRisksByWellboreId(id: string): Observable<Risk[]> {
        let url = `${this.baseUrl}/services/fdp/risks/${id}.json?apiKey=${this.apiKey}`;
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