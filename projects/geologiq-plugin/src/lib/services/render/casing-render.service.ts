import { Injectable } from '@angular/core';
import { Casing } from './models/casing';
import { Model3D } from '../3d';
import { Casing3dConfig, Casing3dOptions } from './models/geologiq-3d-options';
import { ConfigService } from '../data/config.service';

@Injectable({
    providedIn: 'root'
})
export class CasingRenderService {
    private loaded = new Map<string, Casing>();

    constructor(private configService: ConfigService) { }

    clear(): void {
        this.loaded = new Map<string, Casing>();
    }

    async getCasingModels(casings: Casing[], options: Casing3dOptions | null = null): Promise<Model3D[]> {
        const vConfig = await this.configService.getVisualConfig().toPromise();
        const defaultConfig = {
            size: vConfig.casing?.size ?? { x: 40, y: 40, z: 40 },
            color: vConfig.casing?.color ?? { r: 1, g: 1, b: 1, a: 0 }
        };

        return (casings || [])
            .filter(c => !this.loaded.has(c.id) || c !== this.loaded.get(c.id))
            .map(casing => {
                const config = vConfig.casing?.configs
                    ? vConfig.casing.configs[casing.id] ?? defaultConfig
                    : defaultConfig;

                const model: Model3D = {
                    id: casing.id,
                    name: casing.name ?? '',
                    type: 'cone',
                    color: config.color ?? defaultConfig.color,
                    size: config.size ?? defaultConfig.size,
                    parent: casing.parent?.id,
                    offset: casing.shoeDepthMd,
                    direction: 'align'
                };

                // mark as loaded
                this.loaded.set(casing.id, casing);

                return model;
            });
    }
}
