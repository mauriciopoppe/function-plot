/**
 * Created by mauricio on 3/29/15.
 */
'use strict';

var utils = require('./utils');
var Const = require('./constants');
var assert = utils.assert;
module.exports = {
  range: function (chart, meta) {
    var range = meta.range || [-Infinity, Infinity];
    var scale = chart.meta.xScale;
    var start = Math.max(scale.domain()[0], range[0]);
    var end = Math.min(scale.domain()[1], range[1]);
    return [start, end];
  },

  eval: function (chart, meta) {
    assert(typeof meta.fn === 'function');
    var data = [];
    var yDomain = chart.meta.yScale.domain();
    var yDomainMargin = (yDomain[1] - yDomain[0]);
    var yMin = yDomain[0] - yDomainMargin;
    var yMax = yDomain[1] + yDomainMargin;

    if (meta._disableYBoundConstraint) {
      yMin = -Infinity;
      yMax = Infinity;
    }

    var range = this.range(chart, meta);
    var start = range[0];
    var end = range[1];

    var samples = meta.samples || chart.meta.width;
    var delta = meta.deltaX;
    if (!delta) {
      delta = (end - start) / samples;
    }

    var iterations = ((end - start) / delta)|0;

    // one iteration is the minimum
    iterations = iterations || 1;
    assert(iterations >= 0);

    // limit delta to avoid struggling
    if (iterations > Const.MAX_ITERATIONS) {
      //console.warn('too many iterations, limited to Const.MAX_ITERATIONS =', Const.MAX_ITERATIONS);
      iterations = Const.MAX_ITERATIONS;
      delta = (end - start) / iterations;
    }

    for (var i = 0; i <= iterations + 1; i += 1) {
      var x = start + delta * i;
      var y = meta.fn(x);
      if (utils.isValidNumber(y)) {
        data.push([x, utils.clamp(y, yMin, yMax)]);
      }
    }

    data = this.split(chart, data, meta.graphOptions);
    return data;
  },

  /**
   * Splits the evaluated data into arrays, each array is separated by any asymptote found
   * through the process of detecting slope/sign brusque changes
   * @param chart
   * @param data
   * @returns {Array[]}
   */
  split: function (chart, data) {
    var i, oldSign;
    var deltaX;
    var st = [];
    var sets = [];
    var domain = chart.meta.yScale.domain();
    var zoomScale = chart.meta.zoomBehavior.scale();
    var yMin = domain[0];
    var yMax = domain[1];

    if (data[0]) {
      st.push(data[0]);
      deltaX = data[1][0] - data[0][0];
      oldSign = utils.sgn(data[1][1] - data[0][1]);
    }

    i = 1;
    while (i < data.length) {
      var x0 = data[i - 1][0];
      var y0 = data[i - 1][1];
      var x1 = data[i][0];
      var y1 = data[i][1];
      var deltaY = y1 - y0;
      var newSign = utils.sgn(deltaY);
      // make a new set if
      if (utils.sgn(y1) * utils.sgn(y0) < 0 && // there's a change in the evaluated values sign
          // there's a change in the slope sign
          oldSign !== newSign &&
          // the slope is bigger to some value (according to the current zoom scale)
          Math.abs(deltaY / deltaX) > 1 / zoomScale) {
        // make a new point in one of the y-bounds according to the sign of y0
        st.push([x0, utils.bySign(y0, yMin, yMax)]);
        sets.push(st);
        st = [];
        // make a new point in one of the y-bounds according to the sign of y1
        st.push([x1, utils.bySign(y1, yMin, yMax)]);
      }
      oldSign = newSign;
      st.push(data[i]);
      ++i;
    }

    if (st.length) {
      sets.push(st);
    }

    return sets;
  }
};
