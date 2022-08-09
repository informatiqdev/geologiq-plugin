# InformatiQ GeologiQ 3D Engine (Release 4)

InformatiQ GeologiQ 3D Engine provides a 3D engine tailored for render 3D models of offshore oil fields.

> This is a commercial product and requires a paid license for possession or use. InformatiQ's licensed software, including GeologiQ 3D Engine, is subject to the terms and conditions of InformatiQ's EULA. To acquire a license, contact InformatiQ (https://informatiq.no).

## Getting started
This repository contains a Angular wrapper library for InformatiQ GeologiQ 3D Engine, a 3D engine based on Unity3D. The 3D engine itself is distributed as binary Web Assembly files via InformatiQ CDN. 

This source code is structured as an Angular workspace with two projects:

* geologiq-plugin
* geologiq-plugin-example

### geologiq-plugin
This project contains the Angular wrapper library for InformatiQ GeologiQ 3D Engine.

If you want to use geologiq-plugin in your project, you should import the plugin using npm:

```js
npm i @informatiq/geologiq-plugin
```

If you want to compile and publish geologiq-plugin by yourself, for instance, when using your private npm feed, build and publish the geologiq-plugin package using the following steps:

```js
npm run build geologiq-plugin
```

Next publish package to your private npm feed from folder dist/geologiq-plugin.

### geologiq-plugin-example
This project contains an example Angular application illustrating the features supported by InformatiQ GeologiQ 3D Engine and geologiq-plugin.

## Supported platforms
InformatiQ GeologiQ 3D Engine is built using [Unity](https://unity.com/), which currently requires a modern browser with HTML5, WebGL and 64-bit WebAssembly support. Unity WebGL doesn’t support mobile devices. It might work on high-end devices, but current devices are often not powerful enough and don’t have enough memory to support Unity WebGL content.

For more details about browser support, read [here](https://docs.unity3d.com/Manual/webgl-browsercompatibility.html)

geologiq-plugin supports Angular 11.x or later.

## How to build source
In order to build the source code, Angular CLI targeting the correct Angular version must be installed. Follow setup guide provided by Angular [here](https://angular.io/docs).

1) Clone source code repository
2) Go to workspace root folder
3) Install dependencies:  

   `npm install`

4) Build geologiq-plugin:

   `npm run build geologiq-plugin`

5) Build geologiq-plugin-example application

   `npm run start`

## How to integrate into own application
In order to integrate geologiq-plugin into own application, use the following steps:

### 1) Install npm package

```js
npm i @informatiq/geologiq-plugin
```

### 2) Initialize GeologiQ 3D engine (Unity)

Initializing Unity 3D engine typically takes around 1-2 seconds after the webassembly binary files has been downloaded. To avoid waiting 1-2 seconds every time a 3D model should be displayed to the user, the 3D engine should be initialized when initializing the application or the lazy-loaded module, not in the component where the model is rendered.

In geologiq-plugin-example application, the 3D engine is initialized in app.component as following:

```typescript
// app.component.ts

constructor(private _geologiqService: GeologiqService) {}

ngOnInit(): void {
    this.loadGeologiq();
}

private loadGeologiq() {
    // Load Geologiq configuration
    const config = environment.config.geologiq as GeologiqConfig;   
    if (!config)
        throw new Error('Geologiq configuration not loaded.');

    // Load Geologiq plugin 
    this._geologiqService.init('geologiq-3d', config, this.onLoaded, this.onProgress);   
}
```

The geologiqService.init() method expects following arguments:

* ID of HTML canvas element which will be created by geologiq-plugin
* Configuration of geologiq-plugin
* Optional:
    * Callback methods used to monitor progress of loading process

### 3) geologiq-plugin configuration

The following configuration is required by geologiq-plugin:

```json
{
    loaderUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.loader.js',
    dataUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.data.gz',
    frameworkUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.framework.js.gz',
    codeUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.wasm.gz',
    productVersion: '4.0.0-a.22'
}
```

* loaderUrl
    * GeologiQ 3D engine loader script url. This script will be injected as script tag into head section of page. The script is configured to be loaded asynchronously
* dataUrl
    * GeologiQ 3D engine data url
* frameworkUrl
    * GeologiQ 3D engine Javascript bridge
* codeUrl
    * GeologiQ 3D engine webassembly binary files

Note that configuration uses [version] to indicate where version number should be injected into URL. 

In geologiq-plugin-example, the configuration is provided using Angular environment settings (see enviroment.ts)

### 4) Add geologiq-plugin to Angular component
The rendering of 3D model is controlled by adding geologin-plugin component to the desired application component as following:

```html
<geologiq-plugin ...></geologiq-plugin>
```

In order to render a 3D model, data about the model must be provided. The data can either be provided using data binding or calling methods on the component directly.

Example: Render wellbores by data binding

```html
<geologiq-plugin  [wellbores]="wellbores"...></geologiq-plugin>
```

```typescript
/// your.component.ts

 wellbores: Wellbore[] = [];

 ngOnInit() {
    this.remoteService.get().pipe(
        take(1),
        tap((data) => {
            this.wellbores = data.map(d => {
                const wellbore: Wellbore = {
                    id: d.id,
                    name: d.name,
                    md: d.md,
                    points: d.points,
                    wellHeadPosition: d.wellHeadPosition
                };

                return wellbore;
            });         
        }),
        takeUntil(this.destroy$)
    ).subscribe();
}
```

geologiq-plugin uses the following data model for wellbores:

```typescript
export class Wellbore {
    id: string = '';
    name?: string;
    md?: number[];
    points?: (Point | number[])[];
    wellHeadPosition?: Point | number[];
}
```
* id - some unique identifier of a wellbore
* name - name of wellbore
* md - measured depth
* points - 3D coordinates of the wellbore trajectory
* wellHeadPosition - 3D coordinates of well head position

In geologiq-plugin-example application, some sample wellbore trajectory data is included in following folder:

`projects\geologiq-plugin-example\src\app\services\samples\trajectory-sample.ts`


### 5) Supported data models
Current version of geologiq-plugin supports following data models:

#### Wellbore trajectory
```typescript
export class Wellbore {
    id: string = '';
    name?: string;
    md?: number[];
    points?: (Point | number[])[];
    wellHeadPosition?: Point | number[];
}
```
#### Casing
```typescript
export class Casing {
    id: string = '';
    name?: string;
    shoeDepthMd: number = 0;
    parent?: ModelRef;
}
```
#### Risk
```typescript
export class Risk {
    id: string = '';
    title?: string;
    depth?: number;
    parent?: ModelRef;
}
```


## License
While the InformatiQ GeologiQ 3D Engine Angular wrapper library, as contained in this repository, is licensed using MIT license, the GeologiQ 3D Engine requires a commercial license. 

Check the license detail [here](https://github.com/informatiqdev/geologiq-plugin/LICENSE)
