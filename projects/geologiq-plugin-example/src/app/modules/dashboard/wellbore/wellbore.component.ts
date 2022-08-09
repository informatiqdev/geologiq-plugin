import { Subject } from 'rxjs';
import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { GeologiqPluginComponent, DsisWellbore, GeologiqSurface, ElementClickEvent, Ocean } from 'geologiq-plugin';


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
                "wellId": "SOx23zlBXD",
                "wellboreId": "yLkrrLMTAC",
                "defSurveyHeaderId": "ctzzP"
            },
            {
                "wellId": "l3u9AI3mPX",
                "wellboreId": "bBfQsXDqbe",
                "defSurveyHeaderId": "2NvTg"
            },
            {
                "wellId": "Rnvz9u8huS",
                "wellboreId": "ntDt4UrEXC",
                "defSurveyHeaderId": "5sD1M"
            },
            {
                "wellId": "Rnvz9u8huS",
                "wellboreId": "iF2cDtofZ5",
                "defSurveyHeaderId": "J6Hmn"
            },
            {
                "wellId": "9WTnyg0t3b",
                "wellboreId": "U1sJgRoDhZ",
                "defSurveyHeaderId": "kA4a0"
            },
            {
                "wellId": "tMHMeexb83",
                "wellboreId": "NRgLVDxbSZ",
                "defSurveyHeaderId": "hdNZq"
            },
            {
                "wellId": "hOGu6c0gx1",
                "wellboreId": "N0bAz3TMpS",
                "defSurveyHeaderId": "EDwYQ"
            },
            {
                "wellId": "hOGu6c0gx1",
                "wellboreId": "EWfhYHaCmG",
                "defSurveyHeaderId": "WKBwI"
            },
            {
                "wellId": "hOGu6c0gx1",
                "wellboreId": "HH5eEDqL4w",
                "defSurveyHeaderId": "VMYhK"
            },
            {
                "wellId": "kEdtxFs0YL",
                "wellboreId": "CBxFc7OuAL",
                "defSurveyHeaderId": "nl8IJ"
            },
            {
                "wellId": "kEdtxFs0YL",
                "wellboreId": "7y7Vdrm7Y6",
                "defSurveyHeaderId": "6fhSu"
            },
            {
                "wellId": "kEdtxFs0YL",
                "wellboreId": "KEwxLDPK6w",
                "defSurveyHeaderId": "vIDPG"
            },
            {
                "wellId": "DOZbW1SCmX",
                "wellboreId": "eg01a9F9eq",
                "defSurveyHeaderId": "SApsV"
            },
            {
                "wellId": "kWMQ399xmE",
                "wellboreId": "fS7kuW5ZYd",
                "defSurveyHeaderId": "C4PvR"
            },
            {
                "wellId": "kWMQ399xmE",
                "wellboreId": "CC2gA76ag0",
                "defSurveyHeaderId": "dRvKU"
            },
            {
                "wellId": "kWMQ399xmE",
                "wellboreId": "CC2gA76ag0",
                "defSurveyHeaderId": "rFJ9q"
            },
            {
                "wellId": "kWMQ399xmE",
                "wellboreId": "CC2gA76ag0",
                "defSurveyHeaderId": "grnd4"
            },
            {
                "wellId": "kWMQ399xmE",
                "wellboreId": "ACfGGNMb05",
                "defSurveyHeaderId": "eRnmK"
            },
            {
                "wellId": "kWMQ399xmE",
                "wellboreId": "wGp7a8ZfLP",
                "defSurveyHeaderId": "0hJdd"
            },
            {
                "wellId": "kWMQ399xmE",
                "wellboreId": "wGp7a8ZfLP",
                "defSurveyHeaderId": "goF5d"
            },
            {
                "wellId": "kWMQ399xmE",
                "wellboreId": "y4PO94KsSG",
                "defSurveyHeaderId": "dq74M"
            },
            {
                "wellId": "f3EiKcoKP9",
                "wellboreId": "z4xMFhadgZ",
                "defSurveyHeaderId": "PFUlm"
            },
            {
                "wellId": "f3EiKcoKP9",
                "wellboreId": "z4xMFhadgZ",
                "defSurveyHeaderId": "Q2BVj"
            },
            {
                "wellId": "f3EiKcoKP9",
                "wellboreId": "z4xMFhadgZ",
                "defSurveyHeaderId": "mBWjC"
            },
            {
                "wellId": "f3EiKcoKP9",
                "wellboreId": "NrfqPPkuyU",
                "defSurveyHeaderId": "Rokhh"
            },
            {
                "wellId": "EzS1a8Ej5B",
                "wellboreId": "H1KMUGzzx6",
                "defSurveyHeaderId": "6oGUU"
            },
            {
                "wellId": "Ty6R6cztqB",
                "wellboreId": "yQ8YTsWnjh",
                "defSurveyHeaderId": "HftID"
            },
            {
                "wellId": "Ty6R6cztqB",
                "wellboreId": "7M6FGiMvSl",
                "defSurveyHeaderId": "RJPZi"
            },
            {
                "wellId": "vuqR4vHQj2",
                "wellboreId": "7n0X0JEsiB",
                "defSurveyHeaderId": "4yKSE"
            },
            {
                "wellId": "vuqR4vHQj2",
                "wellboreId": "Jy2G5hGV9Z",
                "defSurveyHeaderId": "IDSEh"
            },
            {
                "wellId": "vuqR4vHQj2",
                "wellboreId": "SWkttSG1oN",
                "defSurveyHeaderId": "q9MLO"
            },
            {
                "wellId": "vuqR4vHQj2",
                "wellboreId": "SWkttSG1oN",
                "defSurveyHeaderId": "pjLup"
            },
            {
                "wellId": "vuqR4vHQj2",
                "wellboreId": "SWkttSG1oN",
                "defSurveyHeaderId": "QK0BB"
            },
            {
                "wellId": "vuqR4vHQj2",
                "wellboreId": "eUm2HNCpxz",
                "defSurveyHeaderId": "7Vs4c"
            },
            {
                "wellId": "vuqR4vHQj2",
                "wellboreId": "eUm2HNCpxz",
                "defSurveyHeaderId": "U7orV"
            },
            {
                "wellId": "ki0ioupDx5",
                "wellboreId": "JBQuKD054m",
                "defSurveyHeaderId": "VVqDj"
            },
            {
                "wellId": "SwmNKFcwLa",
                "wellboreId": "f2OLZBEsS1",
                "defSurveyHeaderId": "NH274"
            },
            {
                "wellId": "KyirjdQ579",
                "wellboreId": "mTRa0YK34t",
                "defSurveyHeaderId": "Aw68V"
            },
            {
                "wellId": "3T6XWtsElg",
                "wellboreId": "0CYNSRlD0z",
                "defSurveyHeaderId": "0l2bn"
            },
            {
                "wellId": "3T6XWtsElg",
                "wellboreId": "rdYnYMfvUl",
                "defSurveyHeaderId": "6eW3M"
            },
            {
                "wellId": "3T6XWtsElg",
                "wellboreId": "VnkujtMLW0",
                "defSurveyHeaderId": "zbMA7"
            },
            {
                "wellId": "IYVqZNojWk",
                "wellboreId": "aCKEiuvuRN",
                "defSurveyHeaderId": "g2nBo"
            },
            {
                "wellId": "XlNzAPZzDq",
                "wellboreId": "jHGwwCqWNC",
                "defSurveyHeaderId": "HZFFI"
            },
            {
                "wellId": "8nNsuWiBsv",
                "wellboreId": "qKW6rPf4Di",
                "defSurveyHeaderId": "ZyQdL"
            },
            {
                "wellId": "8nNsuWiBsv",
                "wellboreId": "kSjBjllMCr",
                "defSurveyHeaderId": "fh9fH"
            },
            {
                "wellId": "8nNsuWiBsv",
                "wellboreId": "srV2KgHHMI",
                "defSurveyHeaderId": "jpSRM"
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

    onElementClick(event: ElementClickEvent) {
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
