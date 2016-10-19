var MILLISECONDS = 1000;

var HEADER_MARK = 3502 / MILLISECONDS;
var HEADER_SPACE = 1750  / MILLISECONDS;

var BIT_MARK = 502 / MILLISECONDS;
var ONE_SPACE = 1244 / MILLISECONDS;
var ZERO_SPACE = 400 / MILLISECONDS;

var ADDRESS_MASK_BIT_SIZE = 16;
var CODE_MASK_BIT_SIZE = 32;

exports.encode = function(address, code) {
  var payload = header()
    .concat(generateData(address, ADDRESS_MASK_BIT_SIZE))
    .concat(generateData(code, CODE_MASK_BIT_SIZE))
    .concat(footer());
  return new Float32Array(payload);
}

function header() {
  return [HEADER_MARK, HEADER_SPACE];
}

function generateData(input, maskBitSize) {
  return iterateMask(input, maskBitSize, mark, space);
}

var mark = function() {
  return BIT_MARK;
}

var space = function(masked) {
  return masked ? ONE_SPACE : ZERO_SPACE;
}

function iterateMask(input, maskBitSize, markCallback, spaceCallback) {
  var index;
  var mask;
  var output = [];
  for (index = maskBitSize; index > 0; index--) {
    mask = 1 << (index - 1);
    output.push(markCallback());
    output.push(spaceCallback(input & mask));
  }
  return output;
}

function footer() {
  return [BIT_MARK, 0];
}
