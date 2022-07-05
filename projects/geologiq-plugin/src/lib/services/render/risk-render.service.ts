import { Injectable } from '@angular/core';
import { Risk } from './models/risk';
import { Model3D } from '../3d';
import { Risk3dConfig, Risk3dOptions } from './models/geologiq-3d-options';

@Injectable({
    providedIn: 'root'
})
export class RiskRenderService {
    private loaded = new Map<string, Risk>();

    clear() {
        this.loaded = new Map<string, Risk>();
    }

    getRiskModels(risks: Risk[], options: Risk3dOptions | null = null): Model3D[] {
        const defaultConfig = {
            size: { x: 100, y: 100, z: 100 },
            color: { r: 1, g: 0, b: 0, a: 0 }
        };

        return (risks || [])
            .filter(r => !this.loaded.has(r.id) || r !== this.loaded.get(r.id))
            .map(risk => {
                const config: Risk3dConfig = options?.risks?.get(risk.id) || options?.default || defaultConfig;

                const model: Model3D = {
                    id: risk.id,
                    name: risk.title || '',
                    type: 'sphere',
                    color: config.color ?? defaultConfig.color,
                    size: config.size ?? defaultConfig.size,
                    parent: risk.parent?.id,
                    offset: risk.depth
                };

                // mark as loaded
                this.loaded.set(risk.id, risk);

                return model;
            });
    }
}


