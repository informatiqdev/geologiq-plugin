import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { GeologiqPluginModule } from 'geologiq-plugin';

import { DashboardComponent } from './dashboard.component';
import { WellboreComponent } from './wellbore/wellbore.component';

const routes: Route[] = [
    {
        path     : '',
        component: DashboardComponent
    }
];

@NgModule({    
    declarations: [
        DashboardComponent,
        WellboreComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        GeologiqPluginModule
    ]
})
export class DashboardModule
{
}
