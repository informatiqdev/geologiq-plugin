import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { GeologiqConfig, GeologiqService } from 'geologiq-plugin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  constructor(
    private _geologiqService: GeologiqService
  ) {    
  }

  ngOnInit(): void {
    console.log('Application starting...');    

    this.loadGeologiq();
  }

  ngOnDestroy(): void { 
  }

  private loadGeologiq() {
    // Load Geologiq configuration
    const config = environment.config.geologiq as GeologiqConfig;   
    if (!config)
      throw new Error('Geologiq configuration not loaded.');

    // Load Geologiq plugin 
    this._geologiqService.init('geologiq-3d', config, this.onLoaded, this.onProgress);   
  }

  /**
   * Callback when Geoglogiq plugin has been loaded
   */
  private onLoaded() {
    console.log('GeologiQ plugin runtime loaded.');
  }

  /**
   * Callback to report progress of GeologiQ plugin loading
   * @param progress Progress of loading
   */
  private onProgress(progress: number) {    
  }
}
