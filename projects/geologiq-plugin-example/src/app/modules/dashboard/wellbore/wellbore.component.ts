import { Component, OnDestroy, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { GeologiqData, GeologiqPluginComponent, GeologiqService, Point, Wellbore } from 'geologiq-plugin';
import { forkJoin, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

// import { Point, Color, GeologiqPluginComponent } from 'geologiq-plugin';
import { Casing, Experience, Trajectory, CasingService, ExperienceService, TrajectoryService } from '../../../services';

@Component({
    selector: 'app-wellbore',
    templateUrl: './wellbore.component.html',
    styleUrls: ['./wellbore.component.scss']
})
export class WellboreComponent implements OnInit, OnDestroy {
    _displaySeabed: boolean = true;
    _displayOcean: boolean = true;

    // _trajectories?: Trajectory[];

    models: GeologiqData[] = [];
    center: Point = {
        x: 400000.000,
        y: 0,
        z: 6000000.000
    };

    destroy$: Subject<boolean> = new Subject<boolean>();

    @ViewChild(GeologiqPluginComponent)
    _geologiqComponent?: GeologiqPluginComponent;

    constructor(
        // Remote APIs
        private _casingService: CasingService,
        private _experienceService: ExperienceService,
        private _trajectoryService: TrajectoryService,
        private geologiqService: GeologiqService
    ) {
    }

    ngOnInit() {
        this._trajectoryService.get().pipe(
            take(1),
            tap((result) => {
                this.models = result.map(traj => {
                    const wellbore: Wellbore = {
                        id: traj.id,
                        name: traj.name,
                        md: traj.md,
                        points: traj.points,
                        wellHeadPosition: traj.wellHeadPosition
                    };

                    return {
                        wellbore
                    };
                });

                console.log('geo-3d: loaded data', { models: this.models})
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    // ngAfterViewInit(): void {
    //     // Wait until GeologiQ runtime has been activated
    //     this.geologiqService.activated$.pipe(
    //         take(1),
    //         tap(() => {
    //             console.log('GeologiQ engine activated.');
    //             this.loadView();         
    //         }),
    //         takeUntil(this.destroy$)
    //     )
    //     .subscribe();
    // }

    // private loadView(): void {
    //     if (!this._geologiqComponent)
    //         throw new Error('GeologiQ component not properly initialized.');

    //     // Display GeologiQ 3D engine
    //     this._geologiqComponent.show();

    //     // Initialize 3D view model
    //     this._geologiqComponent?.createView({
    //         "x": 400000.000,
    //         "y": 0,
    //         "z": 6000000.000
    //     });


    //     // Load trajectories from backend API
    //     this._trajectoryService.get().pipe(
    //         take(1),
    //         tap((result) => {
    //             this._trajectories = result;

    //             // Draw trajectories in 3D model
    //             this._trajectories.forEach(trajectory => {
    //                 // Draw trajectory
    //                 this.drawTrajectory(trajectory); 

    //                 // Load experiences
    //                 this.loadExperiences(trajectory);

    //                 // Load casings
    //                 this.loadCasings(trajectory);
    //             });
    //         }),
    //         takeUntil(this.destroy$)
    //     ).subscribe();
    // }

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

    /**
     * Converts and draws a 3D tube based on backend trajectory model
     * @param trajectory The trajectory
     */
    // private drawTrajectory(trajectory: Trajectory) {
    //     if (!trajectory.points || !trajectory.id || !trajectory.md || !trajectory.wellHeadPosition)
    //         return;

    //     // Convert from trajectory data model to 3D view tube model
    //     var points = trajectory.points.map(p => {
    //         return {
    //             x: p.x,
    //             y: p.y,
    //             z: p.z
    //         } as Point;
    //     })

    //     // Draw tube in 3D view
    //     this._geologiqComponent?.drawTube({
    //         id: trajectory.id,
    //         name: trajectory.name,
    //         points: points,
    //         lengths: trajectory.md,
    //         startPosition: trajectory.wellHeadPosition,
    //         radius: 10,          
    //         color: this.getWellboreColor(trajectory.wellCategory)
    //     });
    // }

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

    // private getWellboreColor(category: string | undefined): Color {
    //     switch(category) {
    //         case 'oilproducer': 
    //             return { r:46/255, g:204/255, b:64/255, a:0 };           
    //         default:
    //             return { r:170/255, g:170/255, b:170/255, a:0 };
    //     }
    // }
}
