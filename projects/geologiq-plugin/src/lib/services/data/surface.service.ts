import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Surface } from "../render/models/surface";

@Injectable({
    providedIn: 'root'
})
export class SurfaceService {
    private baseUrl = 'https://localhost:7214'

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