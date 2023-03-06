import * as ts from 'typescript';
import * as ng from '@angular/compiler-cli';
import { EntryPointNode } from '../ng-package/nodes';
import { BuildGraph } from '../graph/build-graph';
import { FileCache } from '../file-system/file-cache';
import { StylesheetProcessor } from './styles/stylesheet-processor';
export declare function cacheCompilerHost(graph: BuildGraph, entryPoint: EntryPointNode, compilerOptions: ng.CompilerOptions, moduleResolutionCache: ts.ModuleResolutionCache, stylesheetProcessor?: StylesheetProcessor, sourcesFileCache?: FileCache): ng.CompilerHost;
export declare function augmentProgramWithVersioning(program: ts.Program): void;
