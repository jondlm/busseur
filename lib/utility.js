'use strict';

var util = require('util');

function replaceAt(str, index, toInsert) {
  toInsert = String(toInsert);

  if(index > str.length - 1 || index < 0) return str;
  return str.slice(0, index) + toInsert + str.substr(index + toInsert.length);
}

function log() {
  console.log.apply(null, arguments);
}

function write(x) {
  process.stdout.write(x);
}

function die(code) {
  process.exit(code);
}

module.exports = {
  log: log,
  replaceAt: replaceAt,
  write: write,
  die: die
};

