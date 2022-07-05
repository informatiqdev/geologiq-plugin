import { Inject, Injectable } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';


@Injectable()
export class AppLoadingService {

    constructor(
        @Inject(DOCUMENT) private _document: any,
        private _router: Router
    )
    {
        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                this.hide();
            })
    }

    display(): void {
        this._document.body.classList.remove('app-loading-hidden');
    }
    
    hide(): void {
        var body = this._document.body;
        this._document.body.classList.add('app-loading-hidden');
    }
}