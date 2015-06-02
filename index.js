'use strict';

var r = require('__base');
var u = require(r + 'lib/utility');
var main = require(r + 'lib/main');
var coerce = require(r + 'lib/coercion');
var program = require('commander');
var packageJson = require(r + 'package.json');

program
.version(packageJson.version)
  .option('-s, --stop <n>', 'filter to a specic TriMet stop id (required)', coerce.myParseInt)
  .option('-r, --route [n]', 'filter to a specific set of routes (repeatable)', coerce.collectInts, [])
  .option('-n, --nickname [nickname]', 'a custom nickname for the location')
  .option('-t, --threshold [minutes]', 'number of minutes for the notification threshold (0 >= t >= 30)', coerce.myParseInt, 10)
  .option('--disable-notifications', 'turn off notifications')
  .parse(process.argv);

// Perform mandatory validations, program will exit if anything fails
u.mandatory(
  program.stop,
  'Please provide a valid stop id with -s.'
);
u.mandatory(
  program.threshold > 0 && program.threshold < 30,
  'Threshold must be between 0 and 30 inclusive'
);

main({
  stop: program.stop,
  route: program.route,
  nickname: program.nickname,
  threshold: program.threshold,
  disableNotifications: program.disableNotifications
});

