"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileNgcTransformFactory = void 0;
const path = require("path");
const ts = require("typescript");
const ora = require("ora");
const transform_1 = require("../../graph/transform");
const compile_source_files_1 = require("../../ngc/compile-source-files");
const ngcc_processor_1 = require("../../ngc/ngcc-processor");
const ivy = require("../../ivy");
const tsconfig_1 = require("../../ts/tsconfig");
const nodes_1 = require("../nodes");
function isEnabled(variable) {
    return typeof variable === 'string' && (variable === '1' || variable.toLowerCase() === 'true');
}
const compileNgcTransformFactory = (StylesheetProcessor, options) => {
    return transform_1.transformFromPromise(async (graph) => {
        var _a, _b;
        var _c, _d;
        const spinner = ora({
            hideCursor: false,
            discardStdin: false,
        });
        try {
            const entryPoint = graph.find(nodes_1.isEntryPointInProgress());
            const entryPoints = graph.filter(nodes_1.isEntryPoint);
            // Add paths mappings for dependencies
            const tsConfig = tsconfig_1.setDependenciesTsConfigPaths(entryPoint.data.tsConfig, entryPoints);
            // Compile TypeScript sources
            const { esm2015, declarations } = entryPoint.data.destinationFiles;
            const { basePath, cssUrl, styleIncludePaths } = entryPoint.data.entryPoint;
            const { moduleResolutionCache, ngccProcessingCache } = entryPoint.cache;
            let ngccProcessor;
            if (tsConfig.options.enableIvy !== false) {
                spinner.start(`Compiling with Angular sources in Ivy ${tsConfig.options.compilationMode || 'full'} compilation mode.`);
                ngccProcessor = new ngcc_processor_1.NgccProcessor(ngccProcessingCache, tsConfig.project, tsConfig.options, entryPoints);
                if (!entryPoint.data.entryPoint.isSecondaryEntryPoint) {
                    // Only run the async version of NGCC during the primary entrypoint processing.
                    await ngccProcessor.process();
                }
            }
            else {
                spinner.start(`Compiling with Angular in legacy View Engine compilation mode.`);
            }
            if (tsConfig.options.enableIvy !== false && !isEnabled(process.env['NG_BUILD_LIB_LEGACY'])) {
                (_a = (_c = entryPoint.cache).stylesheetProcessor) !== null && _a !== void 0 ? _a : (_c.stylesheetProcessor = new ivy.StylesheetProcessor(basePath, cssUrl, styleIncludePaths));
                await ivy.compileSourceFiles(graph, tsConfig, moduleResolutionCache, {
                    outDir: path.dirname(esm2015),
                    declarationDir: path.dirname(declarations),
                    declaration: true,
                    target: ts.ScriptTarget.ES2015,
                }, entryPoint.cache.stylesheetProcessor, ngccProcessor, options.watch);
            }
            else {
                (_b = (_d = entryPoint.cache).stylesheetProcessor) !== null && _b !== void 0 ? _b : (_d.stylesheetProcessor = new StylesheetProcessor(basePath, cssUrl, styleIncludePaths));
                await compile_source_files_1.compileSourceFiles(graph, tsConfig, moduleResolutionCache, entryPoint.cache.stylesheetProcessor, {
                    outDir: path.dirname(esm2015),
                    declarationDir: path.dirname(declarations),
                    declaration: true,
                    target: ts.ScriptTarget.ES2015,
                }, ngccProcessor);
            }
        }
        catch (error) {
            spinner.fail();
            throw error;
        }
        spinner.succeed();
        return graph;
    });
};
exports.compileNgcTransformFactory = compileNgcTransformFactory;
//# sourceMappingURL=compile-ngc.transform.js.map