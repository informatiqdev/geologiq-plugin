import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';


@Injectable()
export class AppLoadingService {

    constructor(
        @Inject(DOCUMENT) private document: any,
        private router: Router
    )
    {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                this.hide();
            });
    }

    display(): void {
        this.document.body.classList.remove('app-loading-hidden');
    }

    hide(): void {
        this.document.body.classList.add('app-loading-hidden');
    }
}
