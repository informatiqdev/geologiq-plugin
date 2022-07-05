import { NgModule } from '@angular/core';
import { AppLoadingService } from './app-loading.service';

@NgModule({
    providers: [
        AppLoadingService
    ]
})
export class AppLoadingModule
{   
    /**
     * Constructor
     */
     constructor(private _appLoadingService: AppLoadingService)
     {
     }
}
