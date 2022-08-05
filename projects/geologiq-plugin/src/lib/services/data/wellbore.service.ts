import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Wellbore } from "../render/models/wellbore";

@Injectable({
    providedIn: 'root'
})
export class WellboreService {
    private baseUrl = 'https://localhost:7214'

    constructor(private http: HttpClient) { }

    getWellbore(id: string, apiKey: string): Observable<Wellbore> {
        let url = `${this.baseUrl}/services/fdp/wellbores/${id}.json?apiKey=${apiKey}`;
        return this.http.get<any[]>(url).pipe(
            map(([traj]) => {
                const wellbore: Wellbore = {
                    id,
                    name: traj.wellbore?.name ?? '',
                    md: traj.md,
                    points: traj.points,
                    wellHeadPosition: traj.well?.wellHeadPosition?.utm?.geometry?.coordinates ?? [0, 0, 0]
                };

                return wellbore;
            })
        );
    }
}