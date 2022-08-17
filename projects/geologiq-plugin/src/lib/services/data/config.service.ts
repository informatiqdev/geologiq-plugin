import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { VisualConfig } from '../../config/visual-config';
import { GeologiqService } from '../3d/geologiq.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private baseUrl: string;
    private apiKey: string;
    private config$?: Observable<VisualConfig>;
    private version: string;

    constructor(
        private http: HttpClient,
        private geologiqService: GeologiqService
    ) {
        this.version = Date.now().toString();
        const fdp =  this.geologiqService.config?.fdp;
        this.baseUrl = fdp?.baseUrl ?? '';
        this.apiKey = fdp?.apiKey ?? '';
    }

    getVisualConfig(): Observable<VisualConfig> {
        if (!this.config$) {
            // make sure to bypass the browser cache by appending a random version as a query string
            // because config might be updated and browser aggresively cache static files
            const url = `${this.baseUrl}/services/fdp/configs/visual-config.json?apiKey=${this.apiKey}&_=${this.version}`;
            this.config$ = this.http.get<VisualConfig>(url).pipe(
                shareReplay()
            );
        }

        return this.config$;
    }
}
