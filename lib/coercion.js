function intList(string) {
  return string.split(',').map(function(x) {
    var parsed = parseInt(x, 10);
    if (isNaN(parsed)) return new Error('Unable to parse integer. Original value: ' + x);
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

module.exports = {
  intList: intList,
  myParseInt: myParseInt
};
