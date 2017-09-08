var u = require('./lib/utility');
var main = require('./lib/main');
var coerce = require('./lib/coercion');
var program = require('commander');
var packageJson = require('./package.json');

program
.version(packageJson.version)
  .option('-s, --stop <n>', 'filter to a specic TriMet stop id (required)', coerce.myParseInt)
  .option('-r, --route [n]', 'filter to a specific set of routes (repeatable)', coerce.collectInts, [])
  .option('-n, --nickname [nickname]', 'a custom nickname for the location')
  .parse(process.argv);

// Perform mandatory validations, program will exit if anything fails
u.mandatory(
  program.stop,
  'Please provide a valid stop id with -s.'
);

main({
  stop: program.stop,
  route: program.route,
  nickname: program.nickname,
  threshold: program.threshold,
});

