import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { GeologiqPluginComponent, Point, Wellbore } from 'geologiq-plugin';
import { Component, OnDestroy, ViewChild, AfterViewInit, OnInit } from '@angular/core';

import { CasingService, ExperienceService, TrajectoryService } from '../../../services';

@Component({
    selector: 'app-wellbore',
    templateUrl: './wellbore.component.html',
    styleUrls: ['./wellbore.component.scss']
})
export class WellboreComponent implements OnInit, OnDestroy {
    _displaySeabed: boolean = true;
    _displayOcean: boolean = true;

    center: Point = {
        x: 400000.000,
        y: 0,
        z: 6000000.000
    };
    wellbores: Wellbore[] = [];

    destroy$: Subject<boolean> = new Subject<boolean>();

    @ViewChild(GeologiqPluginComponent)
    _geologiqComponent?: GeologiqPluginComponent;

    constructor(
        // Remote APIs
        private _casingService: CasingService,
        private _experienceService: ExperienceService,
        private _trajectoryService: TrajectoryService,
    ) {
    }

    ngOnInit() {
        this._trajectoryService.get().pipe(
            take(1),
            tap((result) => {
                this.wellbores = result.map(traj => {
                    const wellbore: Wellbore = {
                        id: traj.id,
                        name: traj.name,
                        md: traj.md,
                        points: traj.points,
                        wellHeadPosition: traj.wellHeadPosition
                    };

                    return wellbore;
                });

                console.log('geo-3d: loaded data', { wellbore: this.wellbores })
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    /**
     * Toggle seabead on/off in 3D view
     */
    toggleSeabed() {
        this._displaySeabed = !this._displaySeabed;
        // this._geologiqComponent?.toggleSeabed(this._displaySeabed);
    }

    /**
     * Toggle ocean on/off in 3D view
     */
    toggleOcean() {
        this._displayOcean = !this._displayOcean;
        // this._geologiqComponent?.toggleOcean(this._displayOcean);
    }

    // private loadExperiences(trajectory: Trajectory) {
    //     if (!trajectory.id)
    //         return;

    //     this._experienceService.get(trajectory.id).pipe(
    //         take(1),
    //         tap((experiences) => {

    //             experiences.forEach(experience => {
    //                 this._geologiqComponent?.load3DModel({
    //                     id: experience.id,
    //                     name: experience.title,
    //                     type: 'sphere',
    //                     color:  { r:1, g:0, b:0, a: 0},
    //                     size: { x:100, y:100, z:100 },
    //                     parent: trajectory.id,
    //                     offset: experience.md
    //                 });
    //             });

    //         }),
    //         takeUntil(this.destroy$)
    //     ).subscribe();
    // }

    // private loadCasings(trajectory: Trajectory) {
    //     if (!trajectory.id)
    //         return;

    //     this._casingService.get(trajectory.id).pipe(
    //         take(1),
    //         tap((casings) => {

    //             casings.forEach(casing => {
    //                 this._geologiqComponent?.load3DModel({
    //                     id: casing.id,
    //                     name: casing.name,
    //                     type: 'cone',
    //                     color:  { r:0, g:1, b:0, a: 0},
    //                     size: { x:100, y:100, z:100 },
    //                     parent: trajectory.id,
    //                     offset: casing.shoeDepthMd,
    //                     direction: 'align'
    //                 });
    //             });

    //         }),
    //         takeUntil(this.destroy$)
    //     ).subscribe();
    // }
}
