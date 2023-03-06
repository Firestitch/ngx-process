import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import * as ivy from '../ivy';
import { BuildGraph } from '../graph/build-graph';
import { NgccProcessor } from '../ngc/ngcc-processor';
export declare function compileSourceFiles(graph: BuildGraph, tsConfig: ng.ParsedConfiguration, moduleResolutionCache: ts.ModuleResolutionCache, extraOptions?: Partial<ng.CompilerOptions>, stylesheetProcessor?: ivy.StylesheetProcessor, ngccProcessor?: NgccProcessor, watch?: boolean): Promise<void>;
