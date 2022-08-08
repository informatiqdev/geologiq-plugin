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
            }
        ];
        this.geologiq?.drawDsisWellbores(wellbores);

        const surfaces: GeologiqSurface[] = [
            {
                "id": "03aa12e4-5d73-4b79-baa8-0fee806327bf",
                "name": "TUtsira"
            },
            {
                "id": "0af82424-8e22-4e08-a898-34158a7ced89",
                "name": "Top_Skagerrak 1_structural_surface"
            },
            {
                "id": "32bb32a4-4990-4c2b-8fc5-bd260025406f",
                "name": "Top Alluvial fan depth surface"
            },
            {
                "id": "38f9f06b-dbd7-4c9a-abf6-dc074cfffc15",
                "name": "TSkade"
            },
            {
                "id": "3efe63b0-c906-4d34-9a10-b31e17a5d264",
                "name": "Tvaale"
            },
            {
                "id": "52b1adf6-34a4-4047-9252-6a9b253b65fe",
                "name": "Tgrid"
            },
            {
                "id": "603997e9-4ea1-4a8c-8179-d28f8e048b29",
                "name": "GOC_base_case"
            },
            {
                "id": "6b4271d9-4a00-43ca-8913-28d753508753",
                "name": "Top Vestland (top reservoir)_structural_surface"
            },
            {
                "id": "6da34026-722d-4a36-8ea7-806a02d7aa70",
                "name": "Seabed"
            },
            {
                "id": "7a74aff0-4576-49d8-b1b9-8e41df3e62c6",
                "name": "Top Statfjord Gp"
            },
            {
                "id": "94f9446c-ae4c-4896-b9a2-2e67692c872d",
                "name": "OWC_base_case"
            },
            {
                "id": "a36aa11f-ef0f-4ae8-a5c9-a3dcf6518c99",
                "name": "Ekofisk_top (Z)"
            },
            {
                "id": "d78fc0b3-f48e-4739-8625-39f5db476bf6",
                "name": "base_S1 (Depth 1)"
            },
            {
                "id": "ea7eb465-a48c-4fc8-8df4-5116ffcfea47",
                "name": "base_S1 (Depth 1)"
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
