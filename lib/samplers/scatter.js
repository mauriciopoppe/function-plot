'use strict';
var utils = require('../utils');
var evaluate = require('../helpers/eval');

var sampler = function (chart, meta, range, n) {
  var allX = utils.linspace(range, n);
  var st = [];
  var samples = [];
  var i;
  for (i = 0; i < allX.length; i += 1) {
    var x = allX[i];
    var y = evaluate(meta, x);
    if (utils.isValidNumber(y)) {
      st.push([x, y]);
    } else {
      samples.push(st);
      st = [];
    }
  }
  if (st.length) {
    samples.push(st);
  }
  return samples;
};

module.exports = sampler;
