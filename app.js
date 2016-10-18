var MILLISECONDS = 1000;

var HEADER_MARK = 3502 / MILLISECONDS;
var HEADER_SPACE = 1750  / MILLISECONDS;

var PANASONIC_BIT_MARK = 502 / MILLISECONDS;
var PANASONIC_ONE_SPACE = 1244 / MILLISECONDS;
var PANASONIC_ZERO_SPACE = 400 / MILLISECONDS;

exports.generate = function(address, code) {
  var pwmData = header()
    .concat(generateData(address))
    .concat(generateData(code))
    .concat(footer());
  return new Float32Array(pwmData);
}

function header() {
  return [HEADER_MARK, HEADER_SPACE];
}

function generateData(input) {
  var output = [];
  var index;
  var mask;
  var bitLength = data.toString(2).length;
  for (index = bitLength; index > 0; index--) {
    mask = 1 << (index - 1);
    output.push(PANASONIC_BIT_MARK);
    if (input & mask) {
      output.push(PANASONIC_ONE_SPACE);
    } else {
      output.push(PANASONIC_ZERO_SPACE);
    }
  }
  return output;
}

function footer() {
  return [PANASONIC_BIT_MARK, 0];
}
