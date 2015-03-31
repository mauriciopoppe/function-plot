/**
 * Created by mauricio on 3/29/15.
 */
var utils = require('./utils');
var assert = utils.assert;
module.exports = {
  eval: function (meta) {
    assert(typeof meta.fn === 'function');
    assert(typeof meta.range === 'object');
    var data = [];
    var start = meta.range[0];
    var end = meta.range[1];
    var inc = meta.range[2];

    var delta = inc || (end - start) / 100;
    var iterations = (end - start) / delta;

    // one iteration is the minimum
    iterations = iterations || 1;
    assert(iterations >= 0);

    for (var i = 0; i <= iterations; i += 1) {
      var x = start + delta * i;
      var y = meta.fn(x);
      if (utils.isValidNumber(x) && utils.isValidNumber(y)) {
        data.push([x, y]);
      }
    }
    return data;
  }
};
