import { Injectable } from '@angular/core';
import { Wellbore } from './models/wellbore';
import { Point, Tube } from '../3d';
import { Wellbore3dConfig, Wellbore3dOptions } from './models/geologiq-3d-options';

@Injectable({
    providedIn: 'root'
})
export class WellboreRenderService {
    private loaded = new Map<string, Wellbore>();

    clear() {
        this.loaded = new Map<string, Wellbore>();
    }

    getTubes(wellbores: Wellbore[], options: Wellbore3dOptions | null = null): Tube[] {
        const defaultConfig = {
            radius: 10,
            color: { r: 170 / 255, g: 170 / 255, b: 170 / 255, a: 0 }
        };

        const tubes: Tube[] = wellbores
            .filter(wb => !this.loaded.has(wb.id) || wb !== this.loaded.get(wb.id))
            .map(wellbore => {
                const config: Wellbore3dConfig = options?.wellbores?.get(wellbore.id) || options?.default || defaultConfig;

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

