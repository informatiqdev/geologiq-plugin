import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Casing, Point, Risk, Wellbore, Surface, GeologiqPluginComponent, DsisWellbore, GeologiqSurface } from 'geologiq-plugin';

import { CasingService, ExperienceService, Trajectory, TrajectoryService, SurfaceService } from '../../../services';

@Component({
    selector: 'app-wellbore',
    templateUrl: './wellbore.component.html',
    styleUrls: ['./wellbore.component.scss']
})
export class WellboreComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    displaySeabed: boolean = true;
    displayOcean: boolean = true;

    center?: Point;

    wellbores: Wellbore[] = [];
    casings: Casing[] = [];
    risks: Risk[] = [];
    surfaces: Surface[] = [];

    @ViewChild('plugin', { static: false })
    geologiq?: GeologiqPluginComponent;

    constructor(
        // Remote APIs
        private surfaceService: SurfaceService,
        private casingService: CasingService,
        private experienceService: ExperienceService,
        private trajectoryService: TrajectoryService,
    ) {
    }

    ngOnInit() {
        // this.surfaceService.get().pipe(
        //     tap(surfaces => {
        //         this.surfaces = surfaces.map(sur => {
        //             const surface: Surface = {
        //                 id: sur.id,
        //                 url: sur.url
        //             };

        //             return surface;
        //         });
        //     }),
        //     takeUntil(this.destroy$)
        // ).subscribe();

        // this.trajectoryService.get().pipe(
        //     take(1),
        //     tap((trajectories) => {
        //         this.wellbores = trajectories.map(trajectory => {
        //             const wellbore: Wellbore = {
        //                 id: trajectory.id,
        //                 name: trajectory.name,
        //                 md: trajectory.md,
        //                 points: trajectory.points,
        //                 wellHeadPosition: trajectory.wellHeadPosition
        //             };

        //             return wellbore;
        //         });

        //         trajectories.forEach(trajectory => {
        //             this.loadCasings(trajectory);
        //             this.loadRisks(trajectory);
        //         });
        //     }),
        //     takeUntil(this.destroy$)
        // ).subscribe();
    }

    ngAfterViewInit(): void {
        const wellbores: DsisWellbore[] = [{
            wellId: 'kWMQ399xmE',
            wellboreId: 'fS7kuW5ZYd',
            defSurveyHeaderId: 'C4PvR'
        }];
        this.geologiq?.drawDsisWellbores(wellbores);

        const surfaces: GeologiqSurface[] = [
            {
                id: "03aa12e4-5d73-4b79-baa8-0fee806327bf",
                name: "TUtsira"
            },
            {
                id: "0af82424-8e22-4e08-a898-34158a7ced89",
                name: "Top_Skagerrak 1_structural_surface"
            },
            {
                id: "32bb32a4-4990-4c2b-8fc5-bd260025406f",
                name: "Top Alluvial fan depth surface"
            },
            {
                id: "38f9f06b-dbd7-4c9a-abf6-dc074cfffc15",
                name: "TSkade"
            }
        ];
        this.geologiq?.drawSurfaces(surfaces);

        const structures = [
            '332a1795-8ca6-440c-8975-543c671cd21c'
        ];
        this.geologiq?.drawInfrastructures(structures);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    /**
     * Toggle seabead on/off in 3D view
     */
    toggleSeabed() {
        this.displaySeabed = !this.displaySeabed;
    }

    /**
     * Toggle ocean on/off in 3D view
     */
    toggleOcean() {
        this.displayOcean = !this.displayOcean;
    }

    private loadRisks(trajectory: Trajectory) {
        if (!trajectory.id)
            return;

        this.experienceService.get(trajectory.id).pipe(
            take(1),
            tap((experiences) => {
                const risks = experiences.map(exp => {
                    const risk: Risk = {
                        id: exp.id ?? '',
                        title: exp.title,
                        parent: { id: trajectory.id },
                        depth: exp.md
                    };

                    return risk;
                });

                this.risks = this.risks.concat(risks);
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    private loadCasings(trajectory: Trajectory) {
        if (!trajectory.id)
            return;

        this.casingService.get(trajectory.id).pipe(
            take(1),
            tap((items) => {
                const casings = items.map(current => {
                    const casing: Casing = {
                        id: current.id ?? '',
                        name: current.name,
                        parent: { id: trajectory.id },
                        shoeDepthMd: current.shoeDepthMd ?? 0
                    };

                    return casing;
                });

                this.casings = this.casings.concat(casings);
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    onElementClicked(element: DsisWellbore | GeologiqSurface | string) {
        console.log(`clicked element`, element);
    }

    zoom(id: string) {
        if (id) {
            this.geologiq?.zoomToElement(id);
        }
    }
}
