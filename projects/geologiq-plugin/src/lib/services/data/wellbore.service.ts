import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environment";
import { Wellbore } from "../render/models/wellbore";

@Injectable({
    providedIn: 'root'
})
export class WellboreService {
    private baseUrl = environment.services.fdp;

    constructor(private http: HttpClient) { }

    getWellbore(id: string, apiKey: string): Observable<Wellbore> {
        let url = `${this.baseUrl}/services/fdp/wellbores/${id}.json?apiKey=${apiKey}`;
        return this.http.get<any[]>(url).pipe(
            map(([traj]) => {
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