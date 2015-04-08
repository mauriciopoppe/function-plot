/**
 * Created by mauricio on 3/28/15.
 */
'use strict';
var d3 = window.d3;
//var width = 400, height = 300;
var width = 740, height = 450;
var simpleFunctionPlot = require('../');
var graphs = {};

graphs.linear = simpleFunctionPlot({
  title: 'linear',
  width: width,
  height: height,
  data: [{
    title: 'f(x) = x',
    fn: function (x) {
      return x;
    }
  }]
});

graphs.multiple = simpleFunctionPlot({
  title: 'multiple',
  width: width,
  height: height,
  data: [
    { fn: function (x) { return x; }},
    { fn: function (x) { return -x; }},
    { fn: function (x) { return x * x; }},
    { fn: function (x) { return x * x * x; }},
    { fn: function (x) { return x * x * x * x; }}
  ]
});

graphs.withLimits = simpleFunctionPlot({
  title: 'With limits',
  width: width,
  height: height,
  data: [{
    title: 'f(x) = 1/x',
    fn: function (x) {
      return 1 / x;
    },
    graphOptions: {
      limits: [0],
      interpolate: 'linear'
    }
  }]
});

// scatter
graphs.scatter = simpleFunctionPlot({
  title: 'scatter',
  width: width,
  height: height,
  domainY: [-1, 7],
  data: [{
    fn: function (x) {
      return Math.sqrt(x);
    },
    graphOptions: {
      type: 'scatter'
    }
  }]
});

// tip option
graphs.tip = simpleFunctionPlot({
  title: 'tip',
  width: width,
  height: height,
  tip: {
    xLine: true,
    yLine: true
  },
  domainY: [-1, 7],
  data: [
    { fn: function (x) { return x * x; }}
  ]
});

// derivative option
graphs.derivative = simpleFunctionPlot({
  title: 'derivative',
  width: width,
  height: height,
  domainY: [-1, 7],
  data: [{
    fn: function (x) {
      return x * x;
    },
    derivative: {
      fn: function (x) {
        return 2 * x;
      },
      x0: 2,
      updateOnMouseOver: true
    }
  }]
});

Object.keys(graphs).forEach(function (graph) {
  d3.select('#' + graph)
    .call(graphs[graph]);
});
