import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter,
    HostListener, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { forkJoin, of, Subject, BehaviorSubject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { Geologiq3dComponent } from '../3d/geologiq-3d.component';

import { CasingRenderService } from '../../services/render/casing-render.service';
import { GeologiqService } from '../../services/3d/geologiq.service';

import { Model3D, Point, SurfaceModel, Tube } from '../../services/3d';
import { RiskRenderService } from '../../services/render/risk-render.service';
import { WellboreRenderService } from '../../services/render/wellbore-render.service';
import { Casing, Risk, Wellbore, Surface, Infrastructure, ElementClickvent as ElementClickEvent } from '../../services/render';
import { WellboreService } from '../../services/data/wellbore.service';
import { RiskService } from '../../services/data/risk.service';
import { CasingService } from '../../services/data/casing.service';
import { SurfaceRenderService } from '../../services/render/surface-render.service';
import { SurfaceService } from '../../services/data/surface.service';
import { InfrastructureService } from '../../services/data/infrastructure.service';
import { InfrastructureRenderService } from '../../services/render/infrastrucure-render.service';
import { CasingData, RiskData, SurfaceData, GeologiqSurface, WellboreData,
    DsisWellbore, InfrastructureData, Ocean } from '../../services/render/models/geologiq-data';

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

    private position?: Point;
    private wellbores?: WellboreData;
    private casings?: CasingData;
    private risks?: RiskData;
    private surfaces?: SurfaceData;
    private structures?: InfrastructureData;

    private loadWellboreData$ = new BehaviorSubject<{ wellbores: DsisWellbore[], casings?: boolean; risks?: boolean }>({ wellbores: [] });
    private loadSurfaces$ = new BehaviorSubject<GeologiqSurface[]>([]);
    private loadInfrastructures$ = new BehaviorSubject<string[]>([]);

    @ViewChild(Geologiq3dComponent)
    private geologiq3d?: Geologiq3dComponent;

    @Output()
    elementClick = new EventEmitter<ElementClickEvent>();

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

    ngOnInit(): void {
        this.render$.pipe(
            filter(() => null != this.geologiq3d && null != this.position),
            take(1),
            tap(() => {
                this.geologiq3d?.show();
                if (null != this.position) {
                    this.geologiq3d?.createView(this.position);
                }
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        this.loadWellboreData$.pipe(
            switchMap(data => {
                const ids = data.wellbores.map(DsisWellbore.getId);
                const wellbores$ = ids.map(id => this.wellboreService.getWellbore(id));
                const casings$ = data.casings
                    ? ids.map(id => this.casingService.getCasingsByWellboreId(id))
                    : [of([] as Casing[])];
                const risks$ = data.risks
                    ? ids.map(id => this.riskService.getRisksByWellboreId(id))
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
                const surfaces$ = surfaces.map(surface => this.surfaceService.getSurface(surface.id));

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
                const structures$ = structures.map(structure => this.infrastructureService.getInfrastructure(structure));

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

    ngOnChanges(): void {
        if (this.geologiq3d) {
            this.refreshView();
        }
    }

    ngAfterViewInit(): void {
        this.geologiq.activated$.pipe(
            take(1),
            tap(() => {
                this.render$.next();
                this.refreshView();
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    drawInfrastructures(infrastructures: string[]): void {
        this.loadInfrastructures$.next(infrastructures);
    }

    drawSurfaces(surfaces: GeologiqSurface[]): void {
        this.loadSurfaces$.next(surfaces);
    }

    drawDsisWellbores(wellbores: DsisWellbore[], drawCasings = true, drawRisks = true): void {
        this.loadWellboreData$.next({ wellbores, casings: drawCasings, risks: drawRisks });
    }

    drawOcean(ocean: Ocean): void {
        this.geologiq.activated$.pipe(
            take(1),
            tap(() => {
                this.geologiq3d?.defineOcean(ocean);
                this.geologiq3d?.toggleOcean(true);
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    zoomToElement(element: DsisWellbore | GeologiqSurface | string): void {
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

    reset(): void {
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

            const surface = this.loadSurfaces$.getValue()?.find(s => s.id === id);
            if (null != surface) {
                this.elementClick.emit({ type: 'surface', data: surface });
                return;
            }

            const wellbore = this.loadWellboreData$.getValue()?.wellbores?.find(wb => DsisWellbore.getId(wb) === id);
            if (null != wellbore) {
                this.elementClick.emit({ type: 'wellbore', data: wellbore });
                return;
            }

            const casing = this.casings?.casings?.find(w => w.id === id);
            if (null != casing) {
                this.elementClick.emit({ type: 'casing', data: casing.id });
                return;
            }

            const risk = this.risks?.risks?.find(w => w.id === id);
            if (null != risk) {
                this.elementClick.emit({ type: 'risk', data: risk.id });
                return;
            }

            const infrastructure = this.structures?.infrastructures?.find(w => w.id === id);
            if (null != infrastructure) {
                this.elementClick.emit({ type: 'infrastructure', data: infrastructure.id });
                return;
            }

            console.warn(`No element found with id: ${id}`);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.geologiq3d?.hide();
    }

    private set centerPosition(value: Point | undefined) {
        this.position = value;
        this.render$.next();
    }

    private setWellbores(value: Wellbore[] | WellboreData): void {
        if (value instanceof Array) {
            this.wellbores = {
                wellbores: value ?? [],
                config: this.wellbores?.config
            };
        }
        else {
            this.wellbores = {
                wellbores: value?.wellbores ?? [],
                config: value?.config ?? this.wellbores?.config
            };
        }
    }

    private setCasings(value: Casing[] | CasingData): void {
        if (value instanceof Array) {
            this.casings = {
                casings: value ?? [],
                config: this.casings?.config
            };
        }
        else {
            this.casings = {
                casings: value?.casings ?? [],
                config: value?.config ?? this.casings?.config
            };
        }
    }

    private setRisks(value: Risk[] | RiskData): void {
        if (value instanceof Array) {
            this.risks = {
                risks: value ?? [],
                config: this.risks?.config
            };
        }
        else {
            this.risks = {
                risks: value?.risks ?? [],
                config: value?.config ?? this.risks?.config
            };
        }
    }

    private setSurfaces(value: Surface[] | SurfaceData): void {
        if (value instanceof Array) {
            this.surfaces = {
                surfaces: value ?? [],
                config: this.surfaces?.config
            };
        }
        else {
            this.surfaces = {
                surfaces: value?.surfaces ?? [],
                config: value?.config ?? this.surfaces?.config
            };
        }
    }


    private setInfrastructures(value: Infrastructure[] | InfrastructureData): void {
        if (value instanceof Array) {
            this.structures = {
                infrastructures: value ?? [],
                config: this.structures?.config
            };
        }
        else {
            this.structures = {
                infrastructures: value?.infrastructures ?? [],
                config: value?.config ?? this.structures?.config
            };
        }
    }

    private renderInfrastructures(): void {
        const structures = this.structures?.infrastructures || [];
        const models: Model3D[] = this.infrastructureRender.getInfrastructureModels(structures || [], this.structures?.config);
        models.forEach(model => {
            this.geologiq3d?.load3DModel(model);
        });
    }

    private async renderWellbores(): Promise<void> {
        const wellbores = this.wellbores?.wellbores || [];
        const tubes: Tube[] = await this.wellboreRender.getTubes(wellbores, this.wellbores?.config);
        tubes.forEach(tube => {
            this.geologiq3d?.drawTube(tube);
        });
    }

    private async renderCasings(): Promise<void> {
        const casings = this.casings?.casings || [];
        const models: Model3D[] = await this.casingRender.getCasingModels(casings || [], this.casings?.config);
        models.forEach(model => {
            this.geologiq3d?.load3DModel(model);
        });
    }

    private async renderRisks(): Promise<void> {
        const risks = this.risks?.risks || [];
        const models: Model3D[] = await this.riskRender.getRiskModels(risks || [], this.risks?.config);
        models.forEach(model => {
            this.geologiq3d?.load3DModel(model);
        });
    }

    private renderSurfaces(): void {
        const surfaces = this.surfaces?.surfaces || [];
        const models: SurfaceModel[] = this.surfaceRender.getSurfaceModels(surfaces || [], this.surfaces?.config);
        models.forEach(model => {
            this.geologiq3d?.loadSurface(model);
        });
    }

    private refreshView(): void {
        if (!this.geologiq3d) {
            throw new Error('GeologiQ component not properly initialized.');
        }

        this.renderWellbores();
        this.renderCasings();
        this.renderRisks();
        this.renderSurfaces();
        this.renderInfrastructures();
    }
}
