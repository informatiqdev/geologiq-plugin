import {
    AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter,
    HostListener, OnChanges, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { forkJoin, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, filter, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { Geologiq3dComponent } from '../3d/geologiq-3d.component';
import { CasingRenderService } from '../../services/render/casing-render.service';
import { GeologiqService } from '../../services/3d/geologiq.service';
import { Model3D, Point, SurfaceModel, Tube } from '../../services/3d';
import { RiskRenderService } from '../../services/render/risk-render.service';
import { WellboreRenderService } from '../../services/render/wellbore-render.service';
import { WellboreService } from '../../services/data/wellbore.service';
import { RiskService } from '../../services/data/risk.service';
import { CasingService } from '../../services/data/casing.service';
import { SurfaceRenderService } from '../../services/render/surface-render.service';
import { SurfaceService } from '../../services/data/surface.service';
import { InfrastructureService } from '../../services/data/infrastructure.service';
import { InfrastructureRenderService } from '../../services/render/infrastrucure-render.service';
import {
    CasingData, RiskData, SurfaceData, GeologiqSurface, WellboreData, DsisWellbore, InfrastructureData, Ocean, SurfaceTubeData
} from '../../services/render/models/geologiq-data';
import { Casing, Risk, Wellbore, Surface, Infrastructure, ElementClickEvent, SurfaceTube } from '../../services/render';
import { SurfaceTubeService } from '../../services/data/surface-tube.service';
import { SurfaceTubeRenderService } from '../../services/render/surface-tube-render.service';

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
    private rendered = false;

    private position?: Point | null;
    private wellbores?: WellboreData;
    private casings?: CasingData;
    private risks?: RiskData;
    private surfaces?: SurfaceData;
    private structures?: InfrastructureData;
    private surfaceTubes?: SurfaceTubeData;

    private loadWellboreData$ = new BehaviorSubject<{ wellbores: DsisWellbore[], casings?: boolean; risks?: boolean }>({ wellbores: [] });
    private loadSurfaces$ = new BehaviorSubject<GeologiqSurface[]>([]);
    private loadInfrastructures$ = new BehaviorSubject<string[]>([]);
    private loadSurfaceTubes$ = new BehaviorSubject<string[]>([]);

    @ViewChild(Geologiq3dComponent)
    geologiq3d?: Geologiq3dComponent;

    @Output()
    elementClick = new EventEmitter<ElementClickEvent>();

    private loaded$ = new BehaviorSubject<boolean>(false);

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
        private surfaceTubeService: SurfaceTubeService,
        private surfaceTubeRender: SurfaceTubeRenderService,
    ) { }

    ngOnInit(): void {
        this.destroy$.pipe(
            take(1),
            tap(() => {
                this.geologiq3d?.hide();
            })
        ).subscribe();

        this.render$.pipe(
            filter(() => null != this.geologiq3d && null != this.position && !this.rendered),
            tap(() => {
                this.geologiq3d?.show();
                this.geologiq3d?.createView(this.position ?? new Point);
                this.rendered = true;

                this.refreshView();
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        const loaded$ = this.loaded$.pipe(
            filter(loaded => loaded === true),
            shareReplay({ refCount: true, bufferSize: 1 }),
            take(1),
        );

        this.loadWellboreData$.pipe(
            switchMap(data => {
                const ids = data.wellbores.map(DsisWellbore.getId);
                const wellbores$ = ids.length
                    ? ids.map(id => this.wellboreService.getWellbore(id))
                    : of([] as Wellbore[]);

                const casings$ = data.casings
                    ? ids.map(id => this.casingService.getCasingsByWellboreId(id).pipe(
                        catchError(() => of([] as Casing[]))
                    ))
                    : [of([] as Casing[])];

                const risks$ = data.risks
                    ? ids.map(id => this.riskService.getRisksByWellboreId(id).pipe(
                        catchError(() => of([] as Risk[]))
                    ))
                    : [of([] as Risk[])];

                return forkJoin([
                    forkJoin(wellbores$),
                    forkJoin(casings$),
                    forkJoin(risks$),
                    loaded$
                ]);
            }),
            tap({
                next: ([wbs, casings, risks]) => {
                    const wellbores: Wellbore[] = (wbs as any).flat();
                    if (null == this.centerPosition) {
                        const head = wellbores[0]?.wellHeadPosition;
                        this.centerPosition = Point.getPoint(head);
                    }

                    this.setWellbores(wellbores);
                    this.setCasings((casings as any).flat());
                    this.setRisks((risks as any).flat());

                    if (this.isReady()) {
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
                    loaded$
                ]);
            }),
            tap({
                next: ([surfaces]) => {
                    this.setSurfaces(surfaces);

                    if (this.isReady()) {
                        this.renderSurfaces();

                        // NOTE: temporariliy do home fly with a timeout after surface rendering instructions are sent to unity
                        // ideally it should be done after all the contents are loaded but that
                        // requires unity to callback when the surfaces and infrastructures are loaded
                        // until Petter add the support for callback use this workaround
                        setTimeout(() => {
                            this.geologiq3d?.lookEast();
                        }, 1 * 1000);
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
                    loaded$
                ]);
            }),
            tap({
                next: ([structures]) => {
                    this.setInfrastructures(structures);

                    if (this.isReady()) {
                        this.renderInfrastructures();
                    }
                }
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        this.loadSurfaceTubes$.pipe(
            switchMap(tubes => {
                const surfaceTubes$ = tubes.map(tube => this.surfaceTubeService.getSurfaceTubes(tube));

                return forkJoin([
                    forkJoin(surfaceTubes$),
                    loaded$
                ]);
            }),
            tap({
                next: ([tubes]) => {
                    this.setSurfaceTubes(tubes);

                    if (this.isReady()) {
                        this.renderSurfaceTubes();
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

    private isReady(): boolean {
        return null != this.geologiq3d && this.rendered;
    }

    ngAfterViewInit(): void {
        this.geologiq.activated$.pipe(
            take(1),
            tap(() => {
                this.reset();
                this.render$.next();
                this.loaded$.next(true);
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    drawSurfaceTubes(surfaceTubes: string[]): void {
        this.loadSurfaceTubes$.next(surfaceTubes);
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

    zoomToElement(elements: (DsisWellbore | GeologiqSurface | string)[]): void {
        const ids: string[] = this.parseElementId(elements);
        this.geologiq3d?.lookAtContent(ids);
    }

    highlightElement(elements: (DsisWellbore | GeologiqSurface | string)[]): void {
        const ids: string[] = this.parseElementId(elements);

        this.geologiq3d?.highlightElement(ids);
    }

    removeAllHighlights(): void {
        this.geologiq3d?.removeAllHighlights();
    }

    private parseElementId(elements: (DsisWellbore | GeologiqSurface | string)[]): string[] {
        const ids: string[] = elements.map(el => {
            if (DsisWellbore.isDsisWellbore(el)) {
                return DsisWellbore.getId(el);
            } else if (GeologiqSurface.isGeologiqSurface(el)) {
                return el.id;
            } else {
                return el;
            }
        });

        return ids;
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
        this.surfaceTubeRender.clear();
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
            this.onContentClicked(id);
        }
    }

    private onContentClicked(id: string): void {
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

        const surfaceTube = this.surfaceTubes?.surfaceTubes?.find(w => w.id === id);
        if (null != surfaceTube) {
            this.elementClick.emit({ type: 'surface-tube', data: surfaceTube.id });
            return;
        }

        console.warn(`No element found with id: ${id}`);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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


    private setSurfaceTubes(value: SurfaceTube[] | SurfaceTubeData): void {
        if (value instanceof Array) {
            this.surfaceTubes = {
                surfaceTubes: value ?? [],
                config: this.surfaceTubes?.config
            };
        }
        else {
            this.surfaceTubes = {
                surfaceTubes: value?.surfaceTubes ?? [],
                config: value?.config ?? this.surfaceTubes?.config
            };
        }
    }

    private async renderSurfaceTubes(): Promise<void> {
        const surfaceTubes = this.surfaceTubes?.surfaceTubes || [];
        const tubes: Tube[] = await this.surfaceTubeRender.getTubes(surfaceTubes, this.surfaceTubes?.config);
        tubes.forEach(tube => {
            this.geologiq3d?.drawTube(tube);
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
        this.renderSurfaceTubes();
        this.renderInfrastructures();
    }
}
