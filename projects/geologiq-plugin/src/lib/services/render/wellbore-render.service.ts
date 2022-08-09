import { Injectable } from '@angular/core';
import { Wellbore } from './models/wellbore';
import { Point, Tube } from '../3d';
import { Wellbore3dConfig, Wellbore3dOptions } from './models/geologiq-3d-options';
import { ConfigService } from '../data/config.service';

@Injectable({
    providedIn: 'root'
})
export class WellboreRenderService {
    private loaded = new Map<string, Wellbore>();

    constructor(private configService: ConfigService) { }

    clear(): void {
        this.loaded = new Map<string, Wellbore>();
    }

    async getTubes(wellbores: Wellbore[], options: Wellbore3dOptions | null = null): Promise<Tube[]> {
        const vConfig = await this.configService.getVisualConfig().toPromise();
        const defaultConfig = {
            radius: vConfig.wellbore?.radius ?? 3,
            color: vConfig.wellbore?.color ?? { r: 0.48, g: 0.88, b: 0.42, a: 0 }
        };

        const tubes: Tube[] = wellbores
            .filter(wb => !this.loaded.has(wb.id) || wb !== this.loaded.get(wb.id))
            .map(wellbore => {
                const config = vConfig.wellbore?.configs
                    ? vConfig.wellbore.configs[wellbore.id] ?? defaultConfig
                    : defaultConfig;

                const head = Point.getPoint(wellbore.wellHeadPosition);
                const points: Point[] = wellbore.points?.map(Point.getPoint) ?? [];
                const tube: Tube = {
                    id: wellbore.id,
                    name: wellbore.name ?? '',
                    points: points,
                    lengths: wellbore.md,
                    startPosition: head,
                    radius: config.radius ?? defaultConfig.radius,
                    color: config.color ?? defaultConfig.color
                };

                // mark as loaded
                this.loaded.set(wellbore.id, wellbore);

                return tube;
            });

        return tubes;
    }
}

