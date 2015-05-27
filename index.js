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
  .parse(process.argv);

// Check for required arguments
if (!program.stop) { console.error('Please provide a valid stop id with -s.'); process.exit(1); }
if (!program.route) { console.error('Please provide a route number with -r.'); process.exit(1); }

main({
  stop: program.stop,
  route: program.route,
  nickname: program.nickname
});

