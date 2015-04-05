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
var mousetip = require('./lib/tip');
var utils = require('./lib/utils');
var linePlot = require('./lib/type/line');
var scatterPlot = require('./lib/type/scatter');
var assert = utils.assert;

module.exports = function (options) {
  options = options || {};

  var root;
  var content;
  var domainX, domainY;
  var width;
  var height;
  var xScale, yScale;
  var xZoomScale, yZoomScale;
  var xAxis, yAxis;

  var limit = 10;
  var margin = {left: 30, right: 30, top: 20, bottom: 20};
  var line = d3.svg.line()
    .x(function (d) { return xScale(d[0]); })
    .y(function (d) { return yScale(d[1]); });

  function updateBounds() {
    width = (options.width || Const.DEFAULT_WIDTH) - margin.left - margin.right;
    height = (options.height || Const.DEFAULT_HEIGHT) - margin.top - margin.bottom;
    xZoomScale = d3.scale.linear()
      .domain(domainX)
      .range([0, width]);
    yZoomScale = d3.scale.linear()
      .domain(domainY)
      .range([height, 0]);
    xAxis = d3.svg.axis()
      .scale(xZoomScale)
      .orient('bottom');
      //.tickSize(-height);
    yAxis = d3.svg.axis()
      .scale(yZoomScale)
      .orient('left');
      //.tickSize(-width);

    xScale = d3.scale.linear()
      .domain(domainX)
      .range([0, width]);
    yScale = d3.scale.linear()
      .domain(domainY)
      .range([height, 0]);
  }
  domainX = options.domainX || [-limit / 2, limit / 2];
  domainY = options.domainY || [-limit / 2, limit / 2];
  assert(domainX[0] < domainX[1]);
  assert(domainY[0] < domainY[1]);
  updateBounds();

  function chart(selection) {
    chart.id = Math.random().toString(16).substr(2);

    selection.each(function () {
      var dynamicClip;
      var zoomDragHelper;
      var data = options.data;
      var types;
      var tip;

      if (options.title) {
        margin.top = 40;
        updateBounds();
      }

      root = d3.select(this)
        .datum(data)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      root.append('text')
        .attr('class', 'title')
        .attr('y', margin.top / 2)
        .attr('x', margin.left + width / 2)
        .attr('font-size', 25)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text(options.title);

      root.append('text')
        .attr('class', 'top-right-legend')
        .attr('y', margin.top / 2)
        .attr('x', width + margin.left)
        .attr('text-anchor', 'end');

      function redraw() {
        // content construction (based on graphOptions.type)
        content.selectAll('g.graph')
          .each(function (data, index) {
            var options = extend({
              owner: chart,
              index: index
            }, data.graphOptions);
            var type = options.type || 'line';
            d3.select(this)
              .call(types[type](options));
          });
      }

      var svg = root.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(d3.behavior.zoom()
          .x(xZoomScale)
          .y(yZoomScale)
          .scaleExtent([0.1, 16])
          .on('zoom', function onZoom() {
            // - updates the position of the axes
            // - updates the position/scale of the clipping rectangle
            var t = d3.event.translate;
            var s = d3.event.scale;
            svg.select('.x.axis').call(xAxis);
            svg.select('.y.axis').call(yAxis);
            dynamicClip.attr('transform', 'scale(' + 1 / s + ')')
              .attr('x', -t[0])
              .attr('y', -t[1]);
            content.attr('transform', 'translate(' + t + ')scale(' + s + ')');
            tip.move( d3.mouse(zoomDragHelper.node()) );
            // content redraw
            redraw();
          })
        );

      // clip (so that the functions don't overflow on zoom or drag)
      var defs = svg.append('defs');
      dynamicClip = defs.append('clipPath')
          .attr('id', 'simple-function-plot-clip-dynamic-' + chart.id)
        .append('rect')
          .attr('width', width)
          .attr('height', height);

      // static clip on the content
      defs.append('clipPath')
          .attr('id', 'simple-function-plot-clip-' + chart.id)
        .append('rect')
          .attr('width', width)
          .attr('height', height);

      // axis creation
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
      // axis labeling
      options.labelX && svg.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('x', width)
        .attr('y', height - 6)
        .text(options.labelX);
      options.labelY && svg.append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'end')
        .attr('y', 6)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text(options.labelY);

      // content
      content = svg.append('g')
        .attr('clip-path', 'url(#simple-function-plot-clip-dynamic-' + chart.id + ')')
        .attr('class', 'content');

      // helper line, x = 0
      content.append('path')
        .datum([[0, Const.LIMIT], [0, -Const.LIMIT]])
        .attr('class', 'y origin')
        .attr('stroke', '#eee')
        .attr('d', line);

      // helper line y = 0
      content.append('path')
        .datum([[-Const.LIMIT, 0], [Const.LIMIT, 0]])
        .attr('class', 'x origin')
        .attr('stroke', '#eee')
        .attr('d', line);

      types = {
        line: linePlot,
        scatter: scatterPlot
      };

      // content construction (based on graphOptions.type)
      content.selectAll('g').data(data)
        .enter()
          .append('g')
          .attr('class', 'graph');
      redraw();

      // helper to detect the closest fn to the mouse position
      tip = mousetip(extend(options.tip, { owner: chart }));
      svg.call(tip);

      // dummy rect (detects the zoom + drag)
      zoomDragHelper = svg.append('rect')
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

  chart.xZoomScale = function () {
    return xZoomScale;
  };

  chart.yZoomScale = function () {
    return yZoomScale;
  };

  chart.root = function () {
    return root;
  };

  chart.content = function () {
    return content;
  };

  chart.width = function () {
    return width;
  };

  chart.height = function () {
    return height;
  };

  // change the title on the top on tip:update
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
