import { Injectable } from '@angular/core';
import { Surface } from './models/surface';
import { Surface3dConfig, Surface3dOptions } from './models/geologiq-3d-options';
import { SurfaceModel } from '../3d';

@Injectable({
    providedIn: 'root'
})
export class SurfaceRenderService {
    private loaded = new Map<string, Surface>();

    clear() {
        this.loaded = new Map<string, Surface>();
    }

    getSurfaceModels(surfaces: Surface[], apiKey: string, options: Surface3dOptions | null = null): SurfaceModel[] {
        const defaultConfig = {
            size: { x: 100, y: 100, z: 100 },
            color: { r: 0, g: 1, b: 0, a: 0 }
        };

        return (surfaces || [])
            .filter(c => !this.loaded.has(c.id) || c !== this.loaded.get(c.id))
            .map(surface => {
                const config: Surface3dConfig = options?.surfaces?.get(surface.id) || options?.default || defaultConfig;

                // mark as loaded
                this.loaded.set(surface.id, surface);

                const url = (surface.url ?? '');
                const parts = url.split('/');
                const filename = parts[parts.length - 1];
                const model: SurfaceModel = {
                    baseUrl: url.replace(filename, ''),
                    filename,
                    apiKey
                };

                return model;
            });
    }
}
