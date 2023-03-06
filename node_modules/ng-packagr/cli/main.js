#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path = require("path");
const log_1 = require("../lib/utils/log");
const public_api_1 = require("../public_api");
const DEFAULT_PROJECT_PATH = path.resolve(process.cwd(), 'ng-package.json');
function parseProjectPath(parsed) {
    return parsed || DEFAULT_PROJECT_PATH;
}
commander_1.program
    .name('ng-packagr')
    .storeOptionsAsProperties(false)
    .option('-v, --version', 'Prints version info')
    .option('-w, --watch', 'Watch for file changes')
    .option('-p, --project [path]', "Path to the 'ng-package.json' or 'package.json' file.", parseProjectPath, DEFAULT_PROJECT_PATH)
    .option('-c, --config [config]', 'Path to a tsconfig file.', (value) => value ? path.resolve(value) : undefined);
commander_1.program.on('option:version', () => {
    public_api_1.version();
    process.exit(0);
});
commander_1.program.parse(process.argv);
const { config, project, watch } = commander_1.program.opts();
public_api_1.execute(public_api_1.build, { config, project, watch: !!watch }).catch(err => {
    log_1.error(err.message);
    process.exit(1);
});
//# sourceMappingURL=main.js.map