import { Injectable } from '@angular/core';
import { Risk } from './models/risk';
import { Model3D } from '../3d';
import { Risk3dConfig, Risk3dOptions } from './models/geologiq-3d-options';
import { ConfigService } from '../data/config.service';

@Injectable({
    providedIn: 'root'
})
export class RiskRenderService {
    private loaded = new Map<string, Risk>();

    constructor(private configService: ConfigService) { }

    clear() {
        this.loaded = new Map<string, Risk>();
    }

    async getRiskModels(risks: Risk[], options: Risk3dOptions | null = null): Promise<Model3D[]> {
        const vConfig = await this.configService.getVisualConfig().toPromise();
        const defaultConfig = {
            size: vConfig.risk?.size ?? { x: 20, y: 20, z: 20 },
            color: vConfig.risk?.color ?? { r: 1, g: 0, b: 0, a: 0 }
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


