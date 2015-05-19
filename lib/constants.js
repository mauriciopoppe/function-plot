/**
 * Created by mauricio on 3/29/15.
 */
'use strict';

var d3 = window.d3;
var Constants = {
  COLORS: [
    'steelblue',
    'red',
    '#05b378',      // green
    'orange',
    '#4040e8',      // purple
    'yellow',
    'black',
    'magenta',
    'cyan'
  ].map(function (v) {
    return d3.hsl(v);
  }),
  DEFAULT_WIDTH: 550,
  DEFAULT_HEIGHT: 350,
  TIP_X_EPS: 1
};

Constants.DEFAULT_ITERATIONS = null;
Constants.MAX_ITERATIONS = Constants.DEFAULT_WIDTH * 4;

module.exports = Constants;
