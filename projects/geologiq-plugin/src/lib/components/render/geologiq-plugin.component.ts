import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { filter, take, takeUntil, tap } from 'rxjs/operators';

import { Geologiq3dComponent } from '../3d/geologiq-3d.component';

import { CasingRenderService } from '../../services/render/casing-render.service';
import { GeologiqService } from '../../services/3d/geologiq.service';

import { CasingData, RiskData, SurfaceData, WellboreData } from '../../services/render/models/geologiq-data';
import { Model3D, Point, SurfaceModel, Tube } from '../../services/3d';
import { RiskRenderService } from '../../services/render/risk-render.service';
import { WellboreRenderService } from '../../services/render/wellbore-render.service';
import { Casing, Risk, Wellbore, Surface } from '../../services/render';
import { WellboreService } from '../../services/data/wellbore.service';
import { RiskService } from '../../services/data/risk.service';
import { CasingService } from '../../services/data/casing.service';
import { SurfaceRenderService } from '../../services/render/surface-render.service';
import { SurfaceService } from '../../services/data/surface.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'geologiq-plugin',
    templateUrl: './geologiq-plugin.component.html',
    styleUrls: ['./geologiq-plugin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeologiqPluginComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    private destroy$ = new Subject<void>();
    private render$ = new Subject<void>();

    @Input() maintainAspectRatio = true;

    private _position?: Point;
    @Input() set centerPosition(value: Point | undefined) {
        this._position = value;
        this.render$.next();
    }

    @Input() apiKey: string = '';

    private _wellbores?: WellboreData;
    @Input() set wellbores(value: Wellbore[] | WellboreData) {
        this.setWellbores(value);

        if (this.geologiq3d) {
            this.renderWellbores();
        }
    }
    private setWellbores(value: Wellbore[] | WellboreData) {
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
    }

    private _casings?: CasingData;
    @Input() set casings(value: Casing[] | CasingData) {
        this.setCasings(value);
        if (this.geologiq3d) {
            this.renderCasings();
        }
    }
    private setCasings(value: Casing[] | CasingData) {
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
    }

    private _risks?: RiskData;
    @Input() set risks(value: Risk[] | RiskData) {
        this.setRisks(value);

        if (this.geologiq3d) {
            this.renderRisks();
        }
    }
    private setRisks(value: Risk[] | RiskData) {
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
    }

    private _surfaces?: SurfaceData;
    @Input() set surfaces(value: Surface[] | SurfaceData) {
        this.setSurfaces(value);

        if (this.geologiq3d) {
            this.renderSurfaces();
        }
    }
    private setSurfaces(value: Surface[] | SurfaceData) {
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
    }

    @ViewChild(Geologiq3dComponent)
    geologiq3d?: Geologiq3dComponent;

    constructor(
        private geologiq: GeologiqService,
        private riskRender: RiskRenderService,
        private casingRender: CasingRenderService,
        private wellboreRender: WellboreRenderService,
        private wellboreService: WellboreService,
        private casingService: CasingService,
        private riskService: RiskService,
        private surfaceRender: SurfaceRenderService,
        private surfaceService: SurfaceService,
    ) { }

    ngOnInit() {
        this.render$.pipe(
            filter(() => null != this.geologiq3d && null != this._position),
            take(1),
            tap(() => {
                this.geologiq3d?.show();
                if (null != this._position) {
                    this.geologiq3d?.createView(this._position);
                }
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    ngOnChanges() {
        if (this.geologiq3d) {
            this.refreshView();
        }
    }

    ngAfterViewInit() {
        this.geologiq.activated$.pipe(
            take(1),
            tap(() => {
                this.render$.next();
                this.refreshView();
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    drawSurfaces(ids: string[]) {
        const surfaces$ = ids.map(id => this.surfaceService.getSurface(id, this.apiKey));
        forkJoin([
            forkJoin(surfaces$),
            this.geologiq.activated$.pipe(take(1))
        ]).pipe(
            tap({
                next: ([surfaces]) => {
                    this.setSurfaces(surfaces);
                    this.renderSurfaces();
                }
            })
        ).subscribe();
    }

    drawWellbores(ids: string[], drawCasings = true, drawExperiences = true) {
        const wellbores$ = ids.map(id => this.wellboreService.getWellbore(id, this.apiKey));
        const casings$ = drawCasings
            ? ids.map(id => this.casingService.getCasingsByWellboreId(id, this.apiKey))
            : [of([] as Casing[])];
        const risks$ = drawExperiences
            ? ids.map(id => this.riskService.getRisksByWellboreId(id, this.apiKey))
            : [of([] as Risk[])];

        forkJoin([
            forkJoin(wellbores$),
            forkJoin(casings$),
            forkJoin(risks$),
            this.geologiq.activated$.pipe(take(1))
        ]).pipe(
            tap({
                next: ([wellbores, casings, risks]) => {
                    if (null == this.centerPosition) {
                        const head = wellbores[0]?.wellHeadPosition;
                        this.centerPosition = Point.getPoint(head);
                    }
                    this.setWellbores(wellbores);
                    this.setCasings((casings as any).flat());
                    this.setRisks((risks as any).flat());

                    if (this.geologiq3d) {
                        this.render$.next();
                        this.refreshView();
                    }
                }
            }),
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
        const models: SurfaceModel[] = this.surfaceRender.getSurfaceModels(surfaces || [], this._surfaces?.config, this.apiKey);
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
        this.surfaceRender.clear();
        this.geologiq3d.clear();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.geologiq3d?.hide();
    }
}
