'use strict';

function intList(string) {
  return string.split(',').map(function(x) {
    var parsed = parseInt(x, 10);
    if (isNaN(parsed)) {
      return new Error('Unable to parse integer. Original value: ' + x);
    }
    return parsed;
  });
}

function myParseInt(string, defaultValue) {
  var parsed = parseInt(string, 10);

  if (typeof parsed === 'number') {
    return parsed;
  } else {
    return defaultValue;
  }
}

function collectInts(val, acc) {
  acc.push(parseInt(val, 10));
  return acc;
}

module.exports = {
  collectInts: collectInts,
  intList: intList,
  myParseInt: myParseInt
};
