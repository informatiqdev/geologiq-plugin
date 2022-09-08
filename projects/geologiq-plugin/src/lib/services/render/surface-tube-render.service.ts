import { Injectable } from '@angular/core';
import { SurfaceTube } from './models/surface-tube';
import { Point, Tube } from '../3d';
import { ConfigService } from '../data/config.service';
import { SurfaceTube3dOptions } from './models/geologiq-3d-options';

@Injectable({
    providedIn: 'root'
})
export class SurfaceTubeRenderService {
    private loaded = new Map<string, SurfaceTube>();

    constructor(private configService: ConfigService) { }

    clear(): void {
        this.loaded = new Map<string, SurfaceTube>();
    }

    async getTubes(surfaceTubes: SurfaceTube[], options: SurfaceTube3dOptions | null = null): Promise<Tube[]> {
        const vConfig = await this.configService.getVisualConfig().toPromise();
        const defaultConfig = {
            radius: vConfig.surfaceTube?.radius ?? 3,
            color: vConfig.surfaceTube?.color ?? { r: 0.48, g: 0.88, b: 0.42, a: 0 }
        };

        const tubes: Tube[] = surfaceTubes
            .filter(wb => !this.loaded.has(wb.id) || wb !== this.loaded.get(wb.id))
            .map(surfaceTube => {
                const config = vConfig.surfaceTube?.configs
                    ? vConfig.surfaceTube.configs[surfaceTube.id] ?? defaultConfig
                    : defaultConfig;

                const head = Point.getPoint(surfaceTube.startPosition);
                const points: Point[] = surfaceTube.points?.map(Point.getPoint) ?? [];
                const tube: Tube = {
                    id: surfaceTube.id,
                    name: surfaceTube.name ?? '',
                    points,
                    lengths: surfaceTube.md,
                    startPosition: head,
                    radius: config.radius ?? defaultConfig.radius,
                    color: config.color ?? defaultConfig.color
                };

                // mark as loaded
                this.loaded.set(surfaceTube.id, surfaceTube);

                return tube;
            });

        return tubes;
    }
}

