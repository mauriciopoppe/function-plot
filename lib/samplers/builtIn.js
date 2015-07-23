'use strict';
var utils = require('../utils');
var evaluate = require('../helpers/eval').builtIn;

var linear = function (chart, meta, range, n) {
  var allX = utils.linspace(range, n);
  var st = [];
  var samples = [];
  var i;
  for (i = 0; i < allX.length; i += 1) {
    var x = allX[i];
    var y = evaluate(meta, 'fn', {x: x});
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

function parametric(chart, meta, range, nSamples) {
  // range is mapped to canvas coordinates from the input
  // for parametric plots the range will tell the start/end points of the `t` param
  var parametricRange = meta.range || [0, 2 * Math.PI];
  var tCoords = utils.linspace(parametricRange, nSamples);
  var samples = [];
  for (var i = 0; i < tCoords.length; i += 1) {
    var t = tCoords[i];
    var x = evaluate(meta, 'x', {t: t});
    var y = evaluate(meta, 'y', {t: t});
    samples.push([x, y]);
  }
  samples.scaledDx = 1;
  return [samples];
}

var sampler = function (chart, meta, range, nSamples) {
  if (meta.parametric) {
    return parametric.apply(null, arguments);
  } else {
    return linear.apply(null, arguments);
  }
};

module.exports = sampler;
