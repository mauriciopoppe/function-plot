/**
 * Created by mauricio on 3/28/15.
 */
'use strict';
var d3 = window.d3;
var functionPlot = require('../');
var instance = functionPlot({
  //title: 'test',
  //description: 'hello world',
  //domain: {
  //  x: [-10, 10],
  //  y: [-10, 10]
  //},
  tip: {
    xLine: true,
    yLine: true
  }
});

var data = [{
  fn: function (x) {
    return x * x;
  },
  range: [-5, 5]
}, {
  fn: function (x) {
    return Math.sqrt(x);
  },
  type: 'scatter',
  range: [-5, 5, 0.1]
}];

d3.select('#canvas')
  .datum(data)
  .call(instance);
