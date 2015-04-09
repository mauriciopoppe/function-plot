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
var types = require('./lib/types/');
var helper = require('./lib/helper/');

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
  var zoomBehavior;
  var xAxis, yAxis;

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
      var data = options.data;

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

            d3.select(this)
              .call(helper(options));
          });
      }

      zoomBehavior = d3.behavior.zoom()
        .x(xZoomScale)
        .y(yZoomScale)
        .scaleExtent([0.1, 16])
        .on('zoom', function onZoom() {
          chart.emit('all:zoom', xZoomScale, yZoomScale);
        });
      var wrap = root.append('g')
        .attr('class', 'transform-helper')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoomBehavior);

      // clip (so that the functions don't overflow on zoom or drag)
      var defs = wrap.append('defs');
      defs.append('clipPath')
          .attr('id', 'simple-function-plot-clip-dynamic-' + chart.id)
        .append('rect')
          .attr('class', 'dynamic-clip')
          .attr('width', width)
          .attr('height', height);

      // static clip on the content
      defs.append('clipPath')
          .attr('id', 'simple-function-plot-clip-' + chart.id)
        .append('rect')
          .attr('class', 'static-clip')
          .attr('width', width)
          .attr('height', height);

      // axis creation
      wrap.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);
      wrap.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
      // axis labeling
      options.labelX && wrap.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('x', width)
        .attr('y', height - 6)
        .text(options.labelX);
      options.labelY && wrap.append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'end')
        .attr('y', 6)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text(options.labelY);

      // content
      content = wrap.append('g')
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

      // content construction (based on graphOptions.type)
      content.selectAll('g.graph').data(data)
        .enter()
          .append('g')
          .attr('class', 'graph');
      content.redraw = redraw;
      content.redraw();

      // helper to detect the closest fn to the mouse position
      wrap.call(tip);

      // dummy rect (detects the zoom + drag)
      wrap.append('rect')
        .attr('class', 'zoom-and-drag')
        .attr('width', width)
        .attr('height', height)
        .style('display', options.disableZoom ? 'none' : null)
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

  chart.getScale = function () {
    return (d3.event && d3.event.scale) || zoomBehavior.scale() || 1;
  };

  chart.content = function () {
    return content;
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
        content.selectAll('.origin')
          .attr('stroke-width', 1 / ((d3.event && d3.event.scale) || 1));

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
          var wrap = graph.root().select('g.transform-helper');
          wrap.select('.x.axis').call(xAxis);
          wrap.select('.y.axis').call(yAxis);
          graph.root().select('.dynamic-clip')
            .attr('transform', 'scale(' + 1 / s + ')')
            .attr('x', -t[0])
            .attr('y', -t[1]);
          graph.content().attr('transform', 'translate(' + t + ')scale(' + s + ')');

          // content redraw
          graph.emit('redraw');
          if (i) {
            graph.emit('zoom:scaleUpdate', xZoomScale, yZoomScale);
          }
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

  return chart;
};

module.exports.types = types;
