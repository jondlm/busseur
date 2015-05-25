var Rx = require('rx');
var assert = require('assert');

function observableEqual(actual, expected) {
  var comparer = Rx.Internals.isEqual;
  var isOk = true;

  if (actual.length !== expected.length) {
    throw new Error('Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
  }

  for(var i = 0; i < expected.length; i++) {
    isOk = comparer(expected[i], actual[i]);
    if(!isOk) {
      throw new Error('Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']');
    }
  }
}

module.exports = {
  observableEqual: observableEqual
};


