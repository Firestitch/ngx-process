const fs = require('fs');
const execSync = require('child_process').execSync;

let exec = function(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

fs.rmSync('node_modules', { recursive: true, force: true });
fs.rmSync('package-lock.json', {  force: true });

exec('npm install @firestitch/component-tools@^13.0.2');
exec('npm install');

exec('git add .');
exec('git commit --message="Angular 13 Clean repo"');

exec('node node_modules/@angular/cli/bin/ng update @angular/core@13 @angular/cli@13 --force');

const package = JSON.parse(fs.readFileSync('package.json').toString());
package.version = '13.0.0';
package.scripts['npm-update'] = 'npx npm-check-updates -u \"/@firestitch/\" --target semver';
fs.writeFileSync('package.json', JSON.stringify(package, undefined, 2));

const ngPackage = JSON.parse(fs.readFileSync('src/ng-package.json').toString());
if(ngPackage.whitelistedNonPeerDependencies) {
  ngPackage.allowedNonPeerDependencies = ngPackage.whitelistedNonPeerDependencies;
  delete ngPackage.whitelistedNonPeerDependencies;
  fs.writeFileSync('src/ng-package.json', JSON.stringify(ngPackage, undefined, 2));
}


exec('npm install @angular/cli@13 --force');
exec('git add .');
exec('git commit --message="Angular 13 Upgrade"');
exec('node node_modules/@angular/cli/bin/ng update @angular/material@13 --force');
exec('git add .');
exec('git commit --message="Angular Material 13 Upgrade"');
exec('npm run package');
exec('git push -u origin HEAD');