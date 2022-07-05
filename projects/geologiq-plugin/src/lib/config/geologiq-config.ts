export interface GeologiqConfig {
    loaderUrl: string;
    dataUrl: string;
    frameworkUrl: string;
    codeUrl: string;
    streamingAssetsUrl?: string;
    companyName?: string;
    productName?: string;
    productVersion: string;

    onProgress?: (number: number) => void;
    onRuntimeInitialized?: () => void;
    onLoaded?: () => void;   
}
  