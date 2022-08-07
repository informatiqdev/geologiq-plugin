import { Injectable } from '@angular/core';
import { Infrastructure } from './models/infrastructure';
import { Infrastructure3dConfig, Infrastructure3dOptions } from './models/geologiq-3d-options';
import { Model3D } from '../3d';

@Injectable({
    providedIn: 'root'
})
export class InfrastructureRenderService {
    private loaded = new Map<string, Infrastructure>();

    clear() {
        this.loaded = new Map<string, Infrastructure>();
    }

    getInfrastructureModels(structures: Infrastructure[], apiKey: string, options: Infrastructure3dOptions | null = null): Model3D[] {
        const defaultConfig = {
            size: { x: 100, y: 100, z: 100 },
            color: { r: 0, g: 1, b: 0, a: 0 }
        };

        return (structures || [])
            .filter(c => !this.loaded.has(c.id) || c !== this.loaded.get(c.id))
            .map(structure => {
                const config: Infrastructure3dConfig = options?.infrastructures?.get(structure.id) || options?.default || defaultConfig;

                // mark as loaded
                this.loaded.set(structure.id, structure);

                const model: Model3D = {
                    id: structure.id,
                    name: structure.name,
                    url: structure.url,
                    type: "custom",
                    position: structure.position,
                    rotation: structure.rotation,
                    size: structure.size
                };

                return model;
            });
    }
}