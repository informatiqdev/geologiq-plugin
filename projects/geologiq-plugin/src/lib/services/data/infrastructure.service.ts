import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environment";
import { Infrastructure } from "../render/models/infrastructure";

@Injectable({
    providedIn: 'root'
})
export class InfrastructureService {
    private baseUrl = environment.services.fdp;

    constructor(private http: HttpClient) { }

    getInfrastructure(id: string, apiKey: string): Observable<Infrastructure> {
        const url = `${this.baseUrl}/services/fdp/infrastructures/${id}.json?apiKey=${apiKey}`;
        return this.http.get<Infrastructure>(url);
    }
}
