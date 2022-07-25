import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { Casing, Point, Risk, Wellbore } from 'geologiq-plugin';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { CasingService, ExperienceService, Trajectory, TrajectoryService } from '../../../services';

@Component({
    selector: 'app-wellbore',
    templateUrl: './wellbore.component.html',
    styleUrls: ['./wellbore.component.scss']
})
export class WellboreComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    displaySeabed: boolean = true;
    displayOcean: boolean = true;

    center: Point = {
        x: 400000.000,
        y: 0,
        z: 6000000.000
    };

    wellbores: Wellbore[] = [];
    casings: Casing[] = [];
    risks: Risk[] = [];

    constructor(
        // Remote APIs
        private casingService: CasingService,
        private experienceService: ExperienceService,
        private trajectoryService: TrajectoryService,
    ) {
    }

    ngOnInit() {
        this.trajectoryService.get().pipe(
            take(1),
            tap((trajectories) => {
                this.wellbores = trajectories.map(trajectory => {
                    const wellbore: Wellbore = {
                        id: trajectory.id,
                        name: trajectory.name,
                        md: trajectory.md,
                        points: trajectory.points,
                        wellHeadPosition: trajectory.wellHeadPosition
                    };

                    return wellbore;
                });

                trajectories.forEach(trajectory => {
                    this.loadCasings(trajectory);
                    this.loadRisks(trajectory);
                });
            }),
            takeUntil(this.destroy$)
        ).subscribe();
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
}
