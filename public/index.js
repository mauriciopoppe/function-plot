/**
 * Created by mauricio on 3/28/15.
 */
'use strict';
var d3 = window.d3;
var simpleFunctionPlot = require('../');
var instance = simpleFunctionPlot({
  //title: 'A title!',
  domainX: [-5, 5],
  domainY: [-5, 5],
  labelX: 'x',
  labelY: 'y',
  tip: {
    xLine: true,
    yLine: true
  },
  data: [{
    title: 'f(x)',
    fn: function (x) {
      return x;
    }
  }, {
    fn: function (x) {
      return 1 / x;
    },
    graphOptions: {
      limits: [0],
      interpolate: 'linear'
    }
  }, {
    fn: function (x) {
      return Math.abs(x);
    }
  }, {
    fn: function (x) {
      return Math.sqrt(x);
    },
    graphOptions: {
      type: 'scatter'
    }
  }, {
    fn: function (x) {
      return x * x;
    }
  }]
});

d3.select('#canvas')
  .call(instance);
