export declare enum CssUrl {
    inline = "inline",
    none = "none"
}
export interface WorkerOptions {
    filePath: string;
    basePath: string;
    targets: string[];
    browserslistData: string[];
    cssUrl?: CssUrl;
    styleIncludePaths?: string[];
    cachePath: string;
    alwaysUseWasm: boolean;
}
export interface WorkerResult {
    css: string;
    warnings: string[];
    error?: string;
}
export declare class StylesheetProcessor {
    private readonly basePath;
    private readonly cssUrl?;
    private readonly styleIncludePaths?;
    private browserslistData;
    private worker;
    private readonly cachePath;
    private targets;
    private alwaysUseWasm;
    constructor(basePath: string, cssUrl?: CssUrl, styleIncludePaths?: string[]);
    process(filePath: string): any;
}
