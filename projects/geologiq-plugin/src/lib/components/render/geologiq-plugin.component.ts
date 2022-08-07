import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { forkJoin, of, Subject, BehaviorSubject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { Geologiq3dComponent } from '../3d/geologiq-3d.component';

import { CasingRenderService } from '../../services/render/casing-render.service';
import { GeologiqService } from '../../services/3d/geologiq.service';

import { Model3D, Point, SurfaceModel, Tube } from '../../services/3d';
import { RiskRenderService } from '../../services/render/risk-render.service';
import { WellboreRenderService } from '../../services/render/wellbore-render.service';
import { Casing, Risk, Wellbore, Surface, Infrastructure } from '../../services/render';
import { WellboreService } from '../../services/data/wellbore.service';
import { RiskService } from '../../services/data/risk.service';
import { CasingService } from '../../services/data/casing.service';
import { SurfaceRenderService } from '../../services/render/surface-render.service';
import { SurfaceService } from '../../services/data/surface.service';
import { InfrastructureService } from '../../services/data/infrastructure.service';
import { InfrastructureRenderService } from '../../services/render/infrastrucure-render.service';
import { CasingData, RiskData, SurfaceData, GeologiqSurface, WellboreData, DsisWellbore, InfrastructureData } from '../../services/render/models/geologiq-data';

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

    @Output() elementClicked = new EventEmitter<DsisWellbore | GeologiqSurface | string>();

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

    private _structures?: InfrastructureData;
    @Input() set ifrastructures(value: Infrastructure[] | InfrastructureData) {
        this.setInfrastructures(value);

        if (this.geologiq3d) {
            this.renderInfrastructures();
        }
    }
    private setInfrastructures(value: Infrastructure[] | InfrastructureData) {
        if (value instanceof Array) {
            this._structures = {
                infrastructures: value ?? [],
                config: this._structures?.config
            };
        }
        else {
            this._structures = {
                infrastructures: value?.infrastructures ?? [],
                config: value?.config ?? this._structures?.config
            };
        }
    }

    @ViewChild(Geologiq3dComponent)
    private geologiq3d?: Geologiq3dComponent;

    private loadWellboreData$ = new BehaviorSubject<{ wellbores: DsisWellbore[], casings?: boolean; risks?: boolean }>({ wellbores: [] });
    private loadSurfaces$ = new BehaviorSubject<GeologiqSurface[]>([]);
    private loadInfrastructures$ = new BehaviorSubject<string[]>([]);

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
        private infrastructureService: InfrastructureService,
        private infrastructureRender: InfrastructureRenderService,
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

        this.loadWellboreData$.pipe(
            switchMap(data => {
                const ids = data.wellbores.map(DsisWellbore.getId);
                const wellbores$ = ids.map(id => this.wellboreService.getWellbore(id, this.apiKey));
                const casings$ = data.casings
                    ? ids.map(id => this.casingService.getCasingsByWellboreId(id, this.apiKey))
                    : [of([] as Casing[])];
                const risks$ = data.risks
                    ? ids.map(id => this.riskService.getRisksByWellboreId(id, this.apiKey))
                    : [of([] as Risk[])];

                return forkJoin([
                    forkJoin(wellbores$),
                    forkJoin(casings$),
                    forkJoin(risks$),
                    this.geologiq.activated$.pipe(take(1))
                ]);
            }),
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
            takeUntil(this.destroy$)
        ).subscribe();

        this.loadSurfaces$.pipe(
            switchMap(surfaces => {
                const surfaces$ = surfaces.map(surface => this.surfaceService.getSurface(surface.id, this.apiKey));

                return forkJoin([
                    forkJoin(surfaces$),
                    this.geologiq.activated$.pipe(take(1))
                ]);
            }),
            tap({
                next: ([surfaces]) => {
                    this.setSurfaces(surfaces);

                    if (this.geologiq3d) {
                        this.render$.next();
                        this.renderSurfaces();
                    }
                }
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        this.loadInfrastructures$.pipe(
            switchMap(structures => {
                const structures$ = structures.map(structure => this.infrastructureService.getInfrastructure(structure, this.apiKey));

                return forkJoin([
                    forkJoin(structures$),
                    this.geologiq.activated$.pipe(take(1))
                ]);
            }),
            tap({
                next: ([structures]) => {
                    this.setInfrastructures(structures);

                    if (this.geologiq3d) {
                        this.render$.next();
                        this.renderInfrastructures();
                    }
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

    drawInfrastructures(infrastructures: string[]) {
        this.loadInfrastructures$.next(infrastructures);
    }

    drawSurfaces(surfaces: GeologiqSurface[]) {
        this.loadSurfaces$.next(surfaces);
    }

    drawDsisWellbores(wellbores: DsisWellbore[], drawCasings = true, drawRisks = true) {
        this.loadWellboreData$.next({ wellbores, casings: drawCasings, risks: drawRisks });
    }

    zoomToElement(element: DsisWellbore | GeologiqSurface | string) {
        let id: string;
        if (DsisWellbore.isDsisWellbore(element)) {
            id = DsisWellbore.getId(element);
        } else if (GeologiqSurface.isGeologiqSurface(element)) {
            id = element.id;
        } else {
            id = element;
        }

        this.geologiq3d?.lookAtContent(id);
    }

    private renderInfrastructures() {
        const structures = this._structures?.infrastructures || [];
        const models: Model3D[] = this.infrastructureRender.getInfrastructureModels(structures || [], this.apiKey, this._structures?.config);
        models.forEach(model => {
            this.geologiq3d?.load3DModel(model);
        });
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
        const models: SurfaceModel[] = this.surfaceRender.getSurfaceModels(surfaces || [], this.apiKey, this._surfaces?.config);
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
        this.renderInfrastructures();
    }

    reset() {
        if (!this.geologiq3d) {
            throw new Error('GeologiQ component not properly initialized.');
        }

        this.wellboreRender.clear();
        this.casingRender.clear();
        this.riskRender.clear();
        this.surfaceRender.clear();
        this.infrastructureRender.clear();
        this.geologiq3d.clear();
    }

    @HostListener('window:message', ['$event'])
    onMessage: any = (e: MessageEvent) => {
        // Only accept messages from same origin
        if (e.origin !== window.location.origin || !e.data?.object?.id) {
            return;
        }

        if ('contentClicked' === e.data.type) {
            const id: string = e.data.object.id;

            const surface = this.loadSurfaces$.getValue()?.find(s => s.id == id);
            if (null != surface) {
                this.elementClicked.emit(surface);
                return;
            }

            const wellbore = this.loadWellboreData$.getValue()?.wellbores?.find(wb => DsisWellbore.getId(wb) === id);
            if (null != wellbore) {
                this.elementClicked.emit(wellbore);
                return;
            }

            const casing = this._casings?.casings?.find(w => w.id === id);
            if (null != casing) {
                this.elementClicked.emit(casing.id);
                return;
            }

            const risk = this._risks?.risks?.find(w => w.id === id);
            if (null != risk) {
                this.elementClicked.emit(risk.id);
                return;
            }

            console.warn(`No element found with id: ${id}`);
            this.elementClicked.emit(id);
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.geologiq3d?.hide();
    }
}
