/*
 * simple-function-plot
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */

'use strict';
var d3 = window.d3;

var events = require('events');
var extend = require('extend');

var Const = require('./lib/constants');
var Tip = require('./lib/tip');
var utils = require('./lib/utils');
var linePlot = require('./lib/type/line');
var scatterPlot = require('./lib/type/scatter');
var assert = utils.assert;

module.exports = function (options) {
  options = options || {};
  var domain = options.domain || {};

  var limit = 10;
  var margin = 20;
  var width = (options.width || 800) - 2 * margin;
  var height = (options.height || 400) - 2 * margin;

  domain.x = domain.x || [-limit / 2, limit / 2];
  domain.y = domain.y || [-limit / 2, limit / 2];
  assert(domain.x[0] < domain.x[1]);
  assert(domain.y[0] < domain.y[1]);

  var xScale = d3.scale.linear()
    .domain(domain.x)
    .range([0, width]);

  var yScale = d3.scale.linear()
    .domain(domain.y)
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickSize(-height);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(-width);

  var line = d3.svg.line()
    .x(function (d) { return xScale(d[0]); })
    .y(function (d) { return yScale(d[1]); });

  var root;
  var content;

  function chart(selection) {
    selection.each(function () {
      var data = options.data;
      root = d3.select(this)
        .datum(data)
        .append('svg')
        .attr('width', width + 2 * margin)
        .attr('height', height + 2 * margin);

      root.append('text')
        .attr('class', 'top-right-legend')
        .attr('y', margin / 2)
        .attr('x', width + margin)
        .attr('text-anchor', 'end');

      var svg = root.append('g')
        .attr('transform', 'translate(' + margin + ',' + margin + ')')
        .call(d3.behavior.zoom()
          .x(xScale)
          .y(yScale)
          .scaleExtent([0.5, 32])
          .on('zoom', zoomed)
        );

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

      // content
      content = svg.append('g')
        .attr('class', 'content');

      // origin line x = 0
      content.append('path')
        .datum([[0, Const.LIMIT], [0, -Const.LIMIT]])
        .attr('class', 'y origin')
        .attr('stroke-width', 0.5)
        .attr('stroke', 'black')
        .attr('d', line);

      // origin line y = 0
      content.append('path')
        .datum([[-Const.LIMIT, 0], [Const.LIMIT, 0]])
        .attr('class', 'x origin')
        .attr('stroke-width', 0.5)
        .attr('stroke', 'black')
        .attr('d', line);

      function zoomed() {
        svg.select('.x.axis').call(xAxis);
        svg.select('.y.axis').call(yAxis);
        content.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
      }

      var types = {
        line: linePlot,
        scatter: scatterPlot
      };

      // content construction
      content.selectAll('g')
        .data(data)
      .enter()
        .append('g')
        .each(function (data, index) {
          var options = extend({
            owner: chart,
            index: index
          }, data.graphOptions);
          var type = options.type || 'line';
          d3.select(this)
            .call(types[type](options));
        });

      // helper to detect the closest fn to the mouse position
      var tip = Tip(options.tip)
        .owner(chart);
      svg.call(tip);

      // dummy rect (detects the zoom + drag)
      svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mouseover', function () {
          tip.show();
        })
        .on('mouseout', function () {
          tip.hide();
        })
        .on('mousemove', function () {
          var mouse = d3.mouse(this);
          tip.move(mouse);
        });
    });
  }

  extend(chart, events.prototype);

  // public api
  chart.xScale = function (_) {
    if (!arguments.length) {
      return xScale;
    }
    xScale = _;
    return chart;
  };

  chart.yScale = function (_) {
    if (!arguments.length) {
      return yScale;
    }
    yScale = _;
    return chart;
  };

  chart.root = function () {
    return root;
  };

  chart.content = function () {
    return content;
  };

  chart.on('tip:update', function (x, y, index) {
    var meta = root.datum()[index];
    var title = meta.title || '';
    var format = meta.renderer || function (x, y) {
        return x.toFixed(3) + ', ' + y.toFixed(3);
      };

    var text = [];
    title && text.push(title);
    text.push(format(x, y));

    root.select('.top-right-legend')
      .attr('fill', Const.COLORS[index])
      //.text(x.toFixed(3) + ', ' + y.toFixed(3));
      .text(text.join(' '));
  });

  return chart;
};
