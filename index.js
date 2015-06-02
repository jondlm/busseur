'use strict';

var r = require('__base');
var main = require(r + 'lib/main');
var coerce = require(r + 'lib/coercion');
var program = require('commander');
var packageJson = require(r + 'package.json');

program
.version(packageJson.version)
  .option('-s, --stop <n>', 'filter to a specic trimet stop id', coerce.myParseInt)
  .option('-r, --route <n>', 'filter to a specific route number', coerce.myParseInt)
  .option('-n, --nickname [nickname]', 'a custom nickname for the location')
  .option('-t, --threshold <mins>', 'number of minutes for the notification threshold', coerce.myParseInt, 5)
  .option('--disable-notifications', 'turn off notifications')
  .parse(process.argv);

// Perform validations
if (!program.stop) { console.error('Please provide a valid stop id with -s.'); process.exit(1); }
if (!program.route) { console.error('Please provide a route number with -r.'); process.exit(1); }
if (program.threshold > 30 || program.threshold < 0) { console.error('Threshold must be between 0 and 30 inclusive'); }

main({
  stop: program.stop,
  route: program.route,
  nickname: program.nickname
});

