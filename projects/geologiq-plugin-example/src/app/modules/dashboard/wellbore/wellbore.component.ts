import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import { GeologiqService, GeologiqPluginComponent } from 'geologiq-plugin';

@Component({
    selector: 'app-wellbore',
    templateUrl: './wellbore.component.html',
    styleUrls: ['./wellbore.component.scss']
})
export class WellboreComponent implements OnInit, AfterViewInit, OnDestroy
{
    destroy$: Subject<boolean> = new Subject<boolean>();

    @ViewChild(GeologiqPluginComponent)
    _geologiqComponent?: GeologiqPluginComponent;

    constructor(
        private _geologiqService: GeologiqService)
    {        
    }

    ngOnInit(): void {        
    }

    ngAfterViewInit(): void {
        // Wait until GeologiQ runtime has been activated
        this._geologiqService.activated$.pipe(
            take(1),
            tap(() => {
                console.log('GeologiQ engine activated.');
                this.loadView();         
            }),
            takeUntil(this.destroy$)
        )
        .subscribe();
    }

    private loadView(): void {
        // Display GeologiQ 3D view
        if (this._geologiqComponent)
            this._geologiqComponent.show();
    }

    ngOnDestroy(): void {    
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
