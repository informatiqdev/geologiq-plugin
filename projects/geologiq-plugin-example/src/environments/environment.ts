// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  config: {
    geologiq: {
      loaderUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.loader.js',
      dataUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.data.gz',
      frameworkUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.framework.js.gz',
      codeUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.wasm.gz',
      productVersion: '4.0.0-a.35'
    },
    services: {
      fdp: {
        apiKey: 'las9812mnf329asjdsf812lkj',
        baseUrl: 'https://api.informatiq.no'
      }
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
