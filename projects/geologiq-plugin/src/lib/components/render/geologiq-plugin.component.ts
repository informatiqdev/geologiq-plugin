import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { Subject, take, takeUntil, tap } from 'rxjs';

import { Geologiq3dComponent } from '../3d/geologiq-3d.component';

import { CasingRenderService } from '../../services/render/casing-render.service';
import { GeologiqService } from '../../services/3d/geologiq.service';

import { GeologiqData } from '../../services/render/models/geologiq-data';
import { Model3D, Point, Tube } from '../../services/3d';
import { Geologiq3dOptions } from '../../services/render/models/geologiq-3d-options';
import { RiskRenderService } from '../../services/render/risk-render.service';
import { WellboreRenderService } from '../../services/render/wellbore-render.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'geologiq-plugin',
    templateUrl: './geologiq-plugin.component.html',
    styleUrls: ['./geologiq-plugin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeologiqPluginComponent implements AfterViewInit, OnChanges, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() centerPosition: Point = new Point();
    @Input() models: GeologiqData[] = [];
    @Input() options?: Geologiq3dOptions;

    @ViewChild(Geologiq3dComponent)
    geologiq3d?: Geologiq3dComponent;

    constructor(
        private geologiq: GeologiqService,
        private riskRender: RiskRenderService,
        private casingRender: CasingRenderService,
        private wellboreRender: WellboreRenderService,
    ) { }

    ngOnChanges() {
        if (this.geologiq3d) {
            this.refreshView();
        }
    }

    ngAfterViewInit() {
        this.geologiq.activated$.pipe(
            take(1),
            tap(() => {
                // Display GeologiQ 3D engine
                this.geologiq3d?.show();
                this.geologiq3d?.createView(this.centerPosition);

                this.refreshView();
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    private refreshView() {
        if (!this.geologiq3d) {
            throw new Error('GeologiQ component not properly initialized.');
        }

        const wellbores = this.models.map(item => item.wellbore);
        const tubes: Tube[] = this.wellboreRender.getTubes(wellbores, this.options?.wellbore);
        tubes.forEach(tube => {
            this.geologiq3d?.drawTube(tube);
        });

        this.models.forEach(({ wellbore, casings, risks }) => {
            let models: Model3D[] = this.casingRender.getCasingModels(casings || [], wellbore.id, this.options?.casing);
            models.forEach(model => {
                this.geologiq3d?.load3DModel(model);
            });

            models = this.riskRender.getRiskModels(risks || [], wellbore.id, this.options?.risk);
            models.forEach(model => {
                this.geologiq3d?.load3DModel(model);
            });
        });
    }

    reset() {
        if (!this.geologiq3d) {
            throw new Error('GeologiQ component not properly initialized.');
        }

        this.wellboreRender.clear();
        this.casingRender.clear();
        this.riskRender.clear();
        this.geologiq3d.clear();
    }

    ngOnDestroy() {
        this.destroy$.next();
    }
}
