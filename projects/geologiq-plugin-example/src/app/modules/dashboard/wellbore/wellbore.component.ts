import { Subject } from 'rxjs';
import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { GeologiqPluginComponent, DsisWellbore, GeologiqSurface, ElementClickvent, Ocean } from 'geologiq-plugin';


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
        const ocean: Ocean = {
            position: { x: 0, y: 0, z: 0 }, // x=easting, y=tvd, z=northing
            size: { x: 20000, y: 0, z: 15000 },
            rotation: 0
        };
        this.geologiq?.drawOcean(ocean);

        const wellbores: DsisWellbore[] = [
            {
                wellId: 'kWMQ399xmE',
                wellboreId: 'fS7kuW5ZYd',
                defSurveyHeaderId: 'C4PvR'
            },
            {
                wellId: "SOx23zlBXD",
                wellboreId: "yLkrrLMTAC",
                defSurveyHeaderId: "ctzzP"
            },
            {
                wellId: "l3u9AI3mPX",
                wellboreId: "bBfQsXDqbe",
                defSurveyHeaderId: "2NvTg"
            },
            {
                wellId: "Rnvz9u8huS",
                wellboreId: "ntDt4UrEXC",
                defSurveyHeaderId: "Fkv0k"
            }
        ];
        this.geologiq?.drawDsisWellbores(wellbores);

        const surfaces: GeologiqSurface[] = [
            {
                "id": "6da34026-722d-4a36-8ea7-806a02d7aa70",
                "name": "Seabed"
            },
            {
                "id": "32bb32a4-4990-4c2b-8fc5-bd260025406f",
                "name": "Top Alluvial fan depth surface"
            },
            {
                "id": "6b4271d9-4a00-43ca-8913-28d753508753",
                "name": "Top Vestland (top reservoir)_structural_surface"
            },
            {
                "id": "7a74aff0-4576-49d8-b1b9-8e41df3e62c6",
                "name": "Top Statfjord Gp"
            },
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
        if (!id) {
            return;
        }

        try {
            const el = JSON.parse(id);
            this.geologiq?.zoomToElement(el);
        }
        catch (e) {
            this.geologiq?.zoomToElement(id);
        }
    }
}
