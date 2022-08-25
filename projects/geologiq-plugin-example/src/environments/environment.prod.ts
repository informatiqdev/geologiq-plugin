export const environment = {
  production: true,
  config: {
    geologiq: {
      loaderUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.loader.js',
      dataUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.data.gz',
      frameworkUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.framework.js.gz',
      codeUrl: 'https://cdn.informatiq.no/unity/geologiq/[version]/geologiq.wasm.gz',
      productVersion: '4.0.0-a.34' 
    },
    services: {
      fdp: {
        apiKey: 'las9812mnf329asjdsf812lkj',
        baseUrl: 'https://api.informatiq.no'
      }
    }
  }
};
