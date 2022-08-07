import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../environment";
import { Surface } from "../render/models/surface";

@Injectable({
    providedIn: 'root'
})
export class SurfaceService {
    private baseUrl = environment.services.fdp;

    constructor(private http: HttpClient) { }

    getSurface(id: string, apiKey: string): Observable<Surface> {
        let url = `${this.baseUrl}/services/fdp/surfaces/${id}/surface.json`;
        const surface: Surface = {
            id,
            url
        };

        return of(surface);
    }
}