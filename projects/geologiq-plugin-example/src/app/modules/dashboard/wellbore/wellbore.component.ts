import { Subject } from 'rxjs';
import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { GeologiqPluginComponent, DsisWellbore, GeologiqSurface, ElementClickvent } from 'geologiq-plugin';


@Component({
    selector: 'app-wellbore',
    templateUrl: './wellbore.component.html',
    styleUrls: ['./wellbore.component.scss']
})
export class WellboreComponent implements AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @ViewChild('plugin')
    geologiq?: GeologiqPluginComponent;

    constructor() { }

    ngAfterViewInit(): void {
        const wellbores: DsisWellbore[] = [
            {
                wellId: 'kWMQ399xmE',
                wellboreId: 'fS7kuW5ZYd',
                defSurveyHeaderId: 'C4PvR'
            }
        ];
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
            '332a1795-8ca6-440c-8975-543c671cd21c' // ivar aasen platform
        ];
        this.geologiq?.drawInfrastructures(structures);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    onElementClick(event: ElementClickvent) {
        console.log(`clicked element`, event);
    }

    zoom(id: string) {
        if (id) {
            this.geologiq?.zoomToElement(id);
        }
    }
}
