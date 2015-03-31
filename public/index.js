/**
 * Created by mauricio on 3/28/15.
 */
'use strict';
var d3 = window.d3;
var functionPlot = require('../');
var instance = functionPlot({
  title: 'test',
  //description: 'hello world',
  //domain: {
  //  x: [-10, 10],
  //  y: [-10, 10]
  //},
  tip: {
    xLine: true,
    yLine: true
  },
  data: [{
    title: 'f(x)',
    fn: function (x) {
      return -x * x;
    },
    graphOptions: {
      type: 'line'
      //closed: true
    },
    range: [-5, 5]
  }, {
    fn: function (x) {
      return Math.sqrt(x);
    },
    graphOptions: {
      type: 'scatter'
    },
    range: [-5, 5]
  }, {
    fn: function (x) {
      return Math.abs(x);
    },
    range: [-5, 5]
  }, {
    title: 'point',
    fn: function () {
      return 3;
    },
    graphOptions: {
      type: 'scatter'
    },
    range: [1, 1]
    //}, {
  //  fn: function (x) {
  //    return x * x * x * x;
  //  },
  //  graphOptions: {
  //    closed: true
  //  },
  //  range: [-5, 5]
  }]
});

d3.select('#canvas')
  .call(instance);
