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

npm i @informatiq/geologiq-plugin

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
3) Install dependencies

    npm install

4) Build geologiq-plugin

    npm run build geologiq-plugin

5) Build geologiq-plugin-example application

    npm run start

## License
While the InformatiQ GeologiQ 3D Engine Angular wrapper library, as contained in this repository, is licensed using MIT license, the GeologiQ 3D Engine requires a commercial license. 

Check the license detail [here](https://github.com/informatiqdev/geologiq-plugin/LICENSE)