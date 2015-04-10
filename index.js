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

var mousetip = require('./lib/tip');
var utils = require('./lib/utils');
var helper = require('./lib/helper/');

var assert = utils.assert;

var Const;
var types;

module.exports = function (options) {
  options = options || {};
  options.data = options.data || [];

  var root;
  var xDomain, yDomain;
  var width;
  var height;
  var xScale, yScale;
  var xZoomScale, yZoomScale;
  var zoomBehavior = d3.behavior.zoom();
  var xAxis, yAxis;
  var id = Math.random().toString(16).substr(2);

  // graphs that will do stuff when an event happens (including this)
  var linkedGraphs = [chart];

  var limit = 10;
  var margin = {left: 30, right: 30, top: 20, bottom: 20};
  var line = d3.svg.line()
    .x(function (d) { return xScale(d[0]); })
    .y(function (d) { return yScale(d[1]); });
  var tip = mousetip(extend(options.tip, { owner: chart }));

  function updateBounds() {
    width = (options.width || Const.DEFAULT_WIDTH) - margin.left - margin.right;
    height = (options.height || Const.DEFAULT_HEIGHT) - margin.top - margin.bottom;
    xZoomScale = d3.scale.linear()
      .domain(xDomain)
      .range([0, width]);
    yZoomScale = d3.scale.linear()
      .domain(yDomain)
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
      .domain(xDomain)
      .range([0, width]);
    yScale = d3.scale.linear()
      .domain(yDomain)
      .range([height, 0]);
  }
  xDomain = options.xDomain || [-limit / 2, limit / 2];
  yDomain = options.yDomain || [-limit / 2, limit / 2];
  assert(xDomain[0] < xDomain[1]);
  assert(yDomain[0] < yDomain[1]);
  updateBounds();

  function getCanvas() {
    return root.select('#canvas');
  }

  function buildTitle() {
    var selection = root.selectAll('text.title')
      .data([options.title].filter(Boolean));

    selection
      .enter().append('text')
      .attr('class', 'title')
      .attr('y', margin.top / 2)
      .attr('x', margin.left + width / 2)
      .attr('font-size', 25)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(options.title);

    selection.exit().remove();
  }

  function buildAxisLabel() {
    // axis labeling
    var xLabel, yLabel;
    var canvas = getCanvas();

    xLabel = canvas.selectAll('text.x.label')
      .data([options.xLabel].filter(Boolean));
    xLabel.enter()
      .append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'end');
    xLabel
      .attr('x', width)
      .attr('y', height - 6)
      .text(function (d) { return d; });
    xLabel.exit().remove();

    yLabel = canvas.selectAll('text.y.label')
      .data([options.yLabel].filter(Boolean));
    yLabel.enter()
      .append('text')
      .attr('class', 'y label')
      .attr('y', 6)
      .attr('dy', '.75em')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)');
    yLabel
      .text(function (d) { return d; });
    yLabel.exit().remove();
  }

  function buildContent() {
    var canvas = getCanvas();
    // content
    var content = canvas.selectAll('g#content')
      .data(function (d) { return [d]; });

    var contentEnter = content.enter()
      .append('g')
      .attr('clip-path', 'url(#simple-function-plot-clip-dynamic-' + id + ')')
      .attr('id', 'content');

    // helper line, x = 0
    contentEnter.append('path')
      .datum([[0, Const.LIMIT], [0, -Const.LIMIT]])
      .attr('class', 'y origin')
      .attr('stroke', '#eee')
      .attr('d', line);

    // helper line y = 0
    contentEnter.append('path')
      .datum([[-Const.LIMIT, 0], [Const.LIMIT, 0]])
      .attr('class', 'x origin')
      .attr('stroke', '#eee')
      .attr('d', line);

    // content construction (based on graphOptions.type)
    content.selectAll('g.graph').data(function (d) { return d.data; })
      .enter()
        .append('g').attr('class', 'graph');
  }

  function buildCanvas() {
    root = d3.select(options.target).selectAll('svg')
      .data([options]);

    // enter
    var rootEnter = root.enter()
      .append('svg')
      .attr('class', 'simple-function-plot');

    buildTitle();
    rootEnter.append('text')
      .attr('class', 'top-right-legend')
      .attr('text-anchor', 'end');

    root
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
    root.select('.top-right-legend')
      .attr('y', margin.top / 2)
      .attr('x', width + margin.left);

    zoomBehavior
      .x(xZoomScale)
      .y(yZoomScale)
      .scaleExtent([0.1, 16])
      .on('zoom', function onZoom() {
        chart.emit('all:zoom', xZoomScale, yZoomScale);
      });
    var canvasEnter = rootEnter.append('g')
      .attr('id', 'canvas');
    var canvas = getCanvas();
    canvas
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoomBehavior)
      .each(function () {
        var el = d3.select(this);
        if (options.disableZoom) {
          // https://github.com/mbostock/d3/issues/894
          el.on('.zoom', null);
        }
      });

    // clips (so that the functions don't overflow on zoom or drag)
    var defs = canvasEnter.append('defs');
    defs.append('clipPath')
        .attr('id', 'simple-function-plot-clip-dynamic-' + id)
      .append('rect')
        .attr('class', 'clip dynamic-clip');
    defs.append('clipPath')
        .attr('id', 'simple-function-plot-clip-' + id)
      .append('rect')
        .attr('class', 'clip static-clip');
    canvas.selectAll('.clip')
      .attr('width', width)
      .attr('height', height);

    // axis creation
    canvasEnter.append('g')
      .attr('class', 'x axis')
      .call(xAxis);
    canvasEnter.append('g')
      .attr('class', 'y axis')
      .call(yAxis);
    // update
    canvas.select('.x.axis')
      .attr('transform', 'translate(0,' + height + ')');
    canvas.select('.y.axis');

    buildAxisLabel();

    buildContent();

    // helper to detect the closest fn to the mouse position
    canvasEnter.call(tip);

    // dummy rect (detects the zoom + drag)
    canvasEnter.append('rect')
      .attr('class', 'zoom-and-drag')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function () {
        chart.emit('all:mouseover');
      })
      .on('mouseout', function () {
        chart.emit('all:mouseout');
      })
      .on('mousemove', function () {
        chart.emit('all:mousemove');
      });
    canvas.select('.zoom-and-drag')
      .attr('width', width)
      .attr('height', height);

    chart.emit('redraw');
  }

  function chart() {
    if (options.title) {
      margin.top = 40;
      updateBounds();
    }
    buildCanvas();
    return chart;
  }

  extend(chart, events.prototype);

  chart.id = function () {
    return id;
  };

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

  chart.getScale = function () {
    return (d3.event && d3.event.scale) || zoomBehavior.scale() || 1;
  };

  chart.tip = function () {
    return tip;
  };

  chart.width = function () {
    return width;
  };

  chart.height = function () {
    return height;
  };

  chart.addLink = function (link) {
    linkedGraphs.push(link);
  };

  chart.canvas = getCanvas;

  function setUpEventListeners() {
    var events = {
      mousemove: function (x, y) {
        tip.move(x, y);
      },
      mouseover: function () {
        tip.show();
      },
      mouseout: function () {
        tip.hide();
      },
      redraw: function () {
        // update the stroke width of the origin lines
        var canvas = getCanvas();
        canvas.selectAll('.origin')
          .attr('stroke-width', 1 / ((d3.event && d3.event.scale) || 1));

        // content construction (based on graphOptions.type)
        canvas.selectAll('g.graph')
          .each(function (data, index) {
            var options = extend({
              owner: chart,
              index: index
            }, data.graphOptions);
            var type = options.type || 'line';
            d3.select(this)
              .call(types[type](options));
            d3.select(this)
              .call(helper(options));
          });
      },
      'zoom:scaleUpdate': function (xOther, yOther) {
        zoomBehavior
          .x(xZoomScale.domain( xOther.domain() ))
          .y(yZoomScale.domain( yOther.domain() ));
      },
      'tip:update': function (x, y, index) {
        var meta = root.datum().data[index];
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
      }
    };

    var all = {
      mousemove: function () {
        var mouse = d3.mouse(root.select('rect.zoom-and-drag').node());
        var x = xZoomScale.invert(mouse[0]);
        var y = yZoomScale.invert(mouse[1]);
        linkedGraphs.forEach(function (graph) {
          graph.emit('mousemove', x, y);
        });
      },

      zoom: function (xZoomScale, yZoomScale) {
        linkedGraphs.forEach(function (graph, i) {
          // - updates the position of the axes
          // - updates the position/scale of the clipping rectangle
          var t = d3.event.translate;
          var s = d3.event.scale;
          var canvas = graph.canvas();
          graph.root().select('.dynamic-clip')
            .attr('transform', 'scale(' + 1 / s + ')')
            .attr('x', -t[0])
            .attr('y', -t[1]);
          canvas.select('.x.axis').call(xAxis);
          canvas.select('.y.axis').call(yAxis);
          canvas.select('#content')
            .attr('transform', 'translate(' + t + ')scale(' + s + ')');
          if (i) {
            graph.emit('zoom:scaleUpdate', xZoomScale, yZoomScale);
          }

          // content redraw
          graph.emit('redraw');
        });

        linkedGraphs[0].emit('all:mousemove');
      }
    };

    Object.keys(events).forEach(function (e) {
      chart.on(e, events[e]);
      // create an event for each event existing on `events` in the form 'all:' event
      // e.g. all:mouseover all:mouseout
      // the objective is that all the linked graphs receive the same event as the current graph
      !all[e] && chart.on('all:' + e, function () {
        var args = Array.prototype.slice.call(arguments);
        linkedGraphs.forEach(function (graph) {
          var localArgs = args.slice();
          localArgs.unshift(e);
          graph.emit.apply(graph, localArgs);
        });
      });
    });

    Object.keys(all).forEach(function (e) {
      chart.on('all:' + e, all[e]);
    });
  }
  setUpEventListeners();

  return chart();
};
Const = module.exports.constants = require('./lib/constants');
types = module.exports.types = require('./lib/types/');
