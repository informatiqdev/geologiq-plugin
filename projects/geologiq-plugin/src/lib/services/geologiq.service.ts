import { DOCUMENT } from '@angular/common';
import { Observable, Subscription, Subject } from 'rxjs';
import { first, switchMap, takeUntil } from 'rxjs/operators';
import { Injectable, Inject, NgZone, OnDestroy } from '@angular/core';

import { GeologiqConfig } from '../config/geologiq-config';

/**
 * Unity Javascript interface
 */
export declare function createUnityInstance(elementId: Element, config: Object, progress: (n: number) => void): Promise<UnityInstance>;

export declare class UnityInstance {
  constructor();

  public SetFullscreen(fullscreen: number): void;
  public SendMessage(gameObjectName: string, methodName: string, parameter?: any): void;
}

/**
 * GeologiQ service
 */
@Injectable({
  providedIn: 'root'
})
export class GeologiqService implements OnDestroy {

  private destroy$ = new Subject<boolean>();

  private _loaded = false; 

  private _unityActivated = new Subject<boolean>();
  public activated$ = this._unityActivated.asObservable();

  private _canvas?: HTMLCanvasElement;
  private _unityInstance?: UnityInstance;

  constructor(
      private zone: NgZone,
      @Inject(DOCUMENT) private document: Document) {
  }

  ngOnDestroy(): void {
      console.log("Geologiq service is destroyed.");     
      
      this.destroy$.next(true);
      this.destroy$.complete();
  }

  /**
   * Injects Unity3D loader script to page and loads script for remote URL
   * @param source Script source URL 
   */
  private loadScript(source: string): Observable<Event> {
    return new Observable(observer => {
      const head = this.document.getElementsByTagName('head')[0];

      let unityLoaderScript = this.document.createElement('script');
      unityLoaderScript.type = 'text/javascript';
      unityLoaderScript.async = true;
      unityLoaderScript.src = source;
      unityLoaderScript.onload = (e) => {
        observer.next(e);
      };
      head.appendChild(unityLoaderScript);
    });
  }

  /**
   * Initializes HTML canvas element with GeologiQ 3D engine
   * @param elementId Canvas element ID
   * @param opts Geolg
   * @param onProgress 
   */
  private async load(elementId: string, opts: GeologiqConfig, onProgress?: (number: number) => void) {
    this.loadScript(opts.loaderUrl).pipe(
      switchMap(async () => {
        const config = {
          ...opts,
          showBanner: (msg: string, type: any) => {
            console.error('GeologiQ failed to load: ', { type, msg });
          }        
        };

        this._canvas = this.document.createElement('canvas');
        this._canvas.id = elementId;
        this._canvas.classList.add("unity", "hidden");
        this._canvas.style.width = 800 + 'px';
        this._canvas.style.height = 600 + 'px'; 
        this._canvas.width = 800;
        this._canvas.height = 600;
     
        // Create new Unity 3D engine instance
        this._unityInstance = await createUnityInstance(this._canvas, config, (progress: number): void => {
            if (onProgress)
                onProgress(progress);
        });

        // Indicate that Unity3D Engine is loaded
        this._loaded = true;       

        // Indicate that Unity3D Engine is activated
        this._unityActivated.next(true);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  /**
   * Indicates whether Unity3D engine is loaded or not
   * @returns True if Unity3D engine is loaded
   */
  isLoaded(): boolean {
    return this._unityInstance !== null && this._loaded;
  }
 
  /**
   * Initialize GeologiQ 3D plugin
   * @param elementId HTML canvas element identifier
   * @param opts GeologiQ plugin configuration
   * @param onLoaded Callback when GeologiQ 3D engine has been loaded
   * @param onProgress Callback indicating progress of GeologiQ 3D engine loading process
   */
  init(elementId: string, opts: GeologiqConfig, onLoaded?: () => void, onProgress?: (number: number) => void) {
    const config: GeologiqConfig = {
      ...opts,
      loaderUrl: opts.loaderUrl.replace('[version]', opts.productVersion),
      dataUrl: opts.dataUrl.replace('[version]', opts.productVersion),
      frameworkUrl: opts.frameworkUrl.replace('[version]', opts.productVersion),
      codeUrl: opts.codeUrl.replace('[version]', opts.productVersion),
      onRuntimeInitialized: () => {
        if (onLoaded)
          onLoaded();     
      }   
    };

    this.zone.onStable.pipe(
        first(), 
        takeUntil(this.destroy$)
    ).subscribe(() => {
        // If Unity instance has not been loaded before, then load the Unity engine
        if (!this._unityInstance) {       
            this.zone.runOutsideAngular(() => {
                this.load(elementId, config, onProgress);
            });
        } else {
            if (this._unityInstance)
                this._unityActivated.next(true);
        }
    });
  }

  /**
   * GeologiQ 3D engine HTML canvas element reference
   */
  public get canvasElement(): HTMLCanvasElement | null {
    return this._canvas ?? null;
  }

  /**
   * Toggle fullscreen mode
   * @param fullscreen Enable (true) or disable (false) fullscreen mode
   */
  toggleFullscreen(fullscreen: boolean): void {
    if (!this.isLoaded())
      return;

    this.zone.runOutsideAngular(() => {
      this._unityInstance?.SetFullscreen(fullscreen === true ? 1 : 0);
    });
  }

  /**
   * Send command to GeologiQ 3D engine
   * @param objectName 3D engine API object name
   * @param methodName 3D engine API object method name
   * @param parameter  3D engine API object method parameters
   */
  send(objectName: string, methodName: string, parameter?: any) : void {
    
    this.zone.runOutsideAngular(() => {
        if (!this._unityInstance)
            throw new Error("send() cannot be called before GeologiQ 3D engine has been loaded.");

        if (!parameter) {
            this._unityInstance.SendMessage(objectName, methodName);
        } else {
            this._unityInstance.SendMessage(objectName, methodName, parameter);
        }
    });
  }
}
