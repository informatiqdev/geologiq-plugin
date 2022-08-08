import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { GeologiqService } from "../3d/geologiq.service";
import { Surface } from "../render/models/surface";

@Injectable({
    providedIn: 'root'
})
export class SurfaceService {
    private baseUrl: string;

    constructor(
        private geologiqService: GeologiqService
    ) {
        this.baseUrl = this.geologiqService.config?.fdp?.baseUrl ?? '';
    }

    getSurface(id: string): Observable<Surface> {
        const url = `${this.baseUrl}/services/fdp/surfaces/${id}/surface.json`;
        const surface: Surface = {
            id,
            url
        };

        return of(surface);
    }
}