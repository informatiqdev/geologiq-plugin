import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import { Geologiq3dComponent } from '../3d/geologiq-3d.component';

import { CasingRenderService } from '../../services/render/casing-render.service';
import { GeologiqService } from '../../services/3d/geologiq.service';

import { CasingData, RiskData, SurfaceData, WellboreData } from '../../services/render/models/geologiq-data';
import { Model3D, Point, SurfaceModel, Tube } from '../../services/3d';
import { RiskRenderService } from '../../services/render/risk-render.service';
import { WellboreRenderService } from '../../services/render/wellbore-render.service';
import { Casing, Risk, Wellbore, Surface } from '../../services/render';
import { SurfaceRenderService } from '../../services/render/surface-render.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'geologiq-plugin',
    templateUrl: './geologiq-plugin.component.html',
    styleUrls: ['./geologiq-plugin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeologiqPluginComponent implements AfterViewInit, OnChanges, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() maintainAspectRatio = true;

    @Input() centerPosition?: Point;

    private _wellbores?: WellboreData;
    @Input() set wellbores(value: Wellbore[] | WellboreData) {
        if (value instanceof Array) {
            this._wellbores = {
                wellbores: value ?? [],
                config: this._wellbores?.config
            };
        }
        else {
            this._wellbores = {
                wellbores: value?.wellbores ?? [],
                config: value?.config ?? this._wellbores?.config
            };
        }

        if (this.geologiq3d) {
            this.renderWellbores();
        }
    }

    private _casings?: CasingData;
    @Input() set casings(value: Casing[] | CasingData) {
        if (value instanceof Array) {
            this._casings = {
                casings: value ?? [],
                config: this._casings?.config
            };
        }
        else {
            this._casings = {
                casings: value?.casings ?? [],
                config: value?.config ?? this._casings?.config
            };
        }

        if (this.geologiq3d) {
            this.renderCasings();
        }
    }

    private _risks?: RiskData;
    @Input() set risks(value: Risk[] | RiskData) {
        if (value instanceof Array) {
            this._risks = {
                risks: value ?? [],
                config: this._risks?.config
            };
        }
        else {
            this._risks = {
                risks: value?.risks ?? [],
                config: value?.config ?? this._risks?.config
            };
        }

        if (this.geologiq3d) {
            this.renderRisks();
        }
    }

    private _surfaces?: SurfaceData;
    @Input() set surfaces(value: Surface[] | SurfaceData) {
        if (value instanceof Array) {
            this._surfaces = {
                surfaces: value ?? [],
                config: this._surfaces?.config
            };
        }
        else {
            this._surfaces = {
                surfaces: value?.surfaces ?? [],
                config: value?.config ?? this._surfaces?.config
            };
        }

        if (this.geologiq3d) {
            this.renderSurfaces();
        }
    }

    @ViewChild(Geologiq3dComponent)
    geologiq3d?: Geologiq3dComponent;

    constructor(
        private geologiq: GeologiqService,
        private riskRender: RiskRenderService,
        private casingRender: CasingRenderService,
        private wellboreRender: WellboreRenderService,
        private surfaceRender: SurfaceRenderService,
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
                if (null != this.centerPosition) {
                    this.geologiq3d?.createView(this.centerPosition);
                    // console.log('geo-3d: set center position', { center: this.centerPosition });
                }

                this.refreshView();
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    private renderWellbores() {
        const wellbores = this._wellbores?.wellbores || [];
        const tubes: Tube[] = this.wellboreRender.getTubes(wellbores, this._wellbores?.config);
        tubes.forEach(tube => {
            this.geologiq3d?.drawTube(tube);
        });
    }

    private renderCasings() {
        const casings = this._casings?.casings || [];
        const models: Model3D[] = this.casingRender.getCasingModels(casings || [], this._casings?.config);
        models.forEach(model => {
            this.geologiq3d?.load3DModel(model);
        });
    }

    private renderRisks() {
        const risks = this._risks?.risks || [];
        const models: Model3D[] = this.riskRender.getRiskModels(risks || [], this._risks?.config);
        models.forEach(model => {
            this.geologiq3d?.load3DModel(model);
        });
    }

    private renderSurfaces() {
        const surfaces = this._surfaces?.surfaces || [];
        const models: SurfaceModel[] = this.surfaceRender.getSurfaceModels(surfaces || [], this._surfaces?.config);
        models.forEach(model => {
            this.geologiq3d?.loadSurface(model);
        });
    }

    private refreshView() {
        if (!this.geologiq3d) {
            throw new Error('GeologiQ component not properly initialized.');
        }

        this.renderWellbores();
        this.renderCasings();
        this.renderRisks();
        this.renderSurfaces();
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
        this.geologiq3d?.hide();
    }
}
