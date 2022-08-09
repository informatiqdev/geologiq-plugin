export interface GeologiqConfig {
    loaderUrl: string;
    dataUrl: string;
    frameworkUrl: string;
    codeUrl: string;
    streamingAssetsUrl?: string;
    companyName?: string;
    productName?: string;
    productVersion: string;

    fdp?: {
        apiKey: string;
        baseUrl: string;
    };
    maintainAspectRatio?: boolean;

    onProgress?: (progress: number) => void;
    onRuntimeInitialized?: () => void;
    onLoaded?: () => void;
}
