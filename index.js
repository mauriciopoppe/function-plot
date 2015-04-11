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

  // globals
  var width, height;
  var margin;
  var zoomBehavior;

  function Chart() {
    if (!(this instanceof Chart)) {
      return new Chart();
    }

    this.id = Math.random().toString(16).substr(2);
    this.linkedGraphs = [this];

    this.setVars();
    this.build();
    setUpEventListeners(this);
    this.emit('draw');
  }

  Chart.prototype = Object.create(events.prototype);

  Chart.prototype.updateBounds = function () {
    width = this.meta.width = (options.width || Const.DEFAULT_WIDTH)
      - margin.left - margin.right;
    height = this.meta.height = (options.height || Const.DEFAULT_HEIGHT)
      - margin.top - margin.bottom;

    var xDomain = this.meta.xDomain;
    var yDomain = this.meta.yDomain;

    this.meta.xZoomScale = d3.scale.linear()
      .domain(xDomain)
      .range([0, width]);
    this.meta.yZoomScale = d3.scale.linear()
      .domain(yDomain)
      .range([height, 0]);
    this.meta.xAxis = d3.svg.axis()
      .scale(this.meta.xZoomScale)
      .orient('bottom');
    //.tickSize(-height);
    this.meta.yAxis = d3.svg.axis()
      .scale(this.meta.yZoomScale)
      .orient('left');
    //.tickSize(-width);

    this.meta.xScale = d3.scale.linear()
      .domain(xDomain)
      .range([0, width]);
    this.meta.yScale = d3.scale.linear()
      .domain(yDomain)
      .range([height, 0]);
  };

  Chart.prototype.setVars = function () {
    var limit = 10;

    this.meta = {};
    margin = this.meta.margin = {left: 30, right: 30, top: 20, bottom: 20};
    zoomBehavior = this.meta.zoomBehavior = d3.behavior.zoom();

    var xDomain = this.meta.xDomain = options.xDomain || [-limit / 2, limit / 2];
    var yDomain = this.meta.yDomain = options.yDomain || [-limit / 2, limit / 2];

    assert(xDomain[0] < xDomain[1]);
    assert(yDomain[0] < yDomain[1]);

    if (options.title) {
      this.meta.margin.top = 40;
    }

    this.updateBounds();
  };

  Chart.prototype.build = function () {
    var root = this.root = d3.select(options.target).selectAll('svg')
      .data([options]);

    // enter
    this.root.enter = root.enter()
      .append('svg')
        .attr('class', 'simple-function-plot')
        .attr('font-size', this.getFontSize());

    // merge
    root
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
    root.select('.top-right-legend')
      .attr('y', margin.top / 2)
      .attr('x', width + margin.left);

    this.buildTitle();
    this.buildLegend();
    this.buildCanvas();
    this.buildClip();
    this.buildAxis();
    this.buildAxisLabel();
    this.buildContent();

    // helper to detect the closest fn to the mouse position
    var tip = this.tip = mousetip(extend(options.tip, { owner: this }));
    this.canvas.enter.call(tip);

    this.buildZoomHelper();
  };

  Chart.prototype.buildTitle = function () {
    // join
    var selection = this.root.selectAll('text.title')
      .data(function (d) {
        return [d.title].filter(Boolean);
      });

    // enter
    selection.enter()
      .append('text')
      .attr('class', 'title')
      .attr('y', margin.top / 2)
      .attr('x', margin.left + width / 2)
      .attr('font-size', 25)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(options.title);

    // exit
    selection.exit().remove();
  };

  Chart.prototype.buildLegend = function () {
    // enter
    this.root.enter
      .append('text')
      .attr('class', 'top-right-legend')
      .attr('text-anchor', 'end');

    // update + enter
    this.root.select('.top-right-legend')
      .attr('y', margin.top / 2)
      .attr('x', width + margin.left);
  };

  Chart.prototype.buildCanvas = function () {
    var self = this;
    var xZoomScale = this.meta.xZoomScale;
    var yZoomScale = this.meta.yZoomScale;

    this.meta.zoomBehavior
      .x(xZoomScale)
      .y(yZoomScale)
      .scaleExtent([0.1, 16])
      .on('zoom', function onZoom() {
        self.emit('all:zoom', xZoomScale, yZoomScale);
      });

    // enter
    var canvas = this.canvas = this.root
      .selectAll('#canvas')
      .data(function (d) { return [d]; });

    this.canvas.enter = canvas.enter()
      .append('g')
        .attr('id', 'canvas');

    // enter + update
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
  };

  Chart.prototype.buildClip = function () {
    // clips (so that the functions don't overflow on zoom or drag)
    // enter
    var id = this.id;
    var defs = this.canvas.enter.append('defs');
    defs.append('clipPath')
      .attr('id', 'simple-function-plot-clip-dynamic-' + id)
      .append('rect')
      .attr('class', 'clip dynamic-clip');
    defs.append('clipPath')
      .attr('id', 'simple-function-plot-clip-' + id)
      .append('rect')
      .attr('class', 'clip static-clip');

    // enter + update
    this.canvas.selectAll('.clip')
      .attr('width', width)
      .attr('height', height);
  };

  Chart.prototype.buildAxis = function () {
    // axis creation
    var canvasEnter = this.canvas.enter;
    canvasEnter.append('g')
      .attr('class', 'x axis');
    canvasEnter.append('g')
      .attr('class', 'y axis');

    // update
    this.canvas.select('.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(this.meta.xAxis);
    this.canvas.select('.y.axis')
      .call(this.meta.yAxis);
  };

  Chart.prototype.buildAxisLabel = function () {
    // axis labeling
    var xLabel, yLabel;
    var canvas = this.canvas;

    xLabel = canvas.selectAll('text.x.label')
      .data(function (d) {
        return [d.xLabel].filter(Boolean);
      });
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
      .data(function (d) {
        return [d.yLabel].filter(Boolean)
      });
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
  };

  Chart.prototype.buildContent = function () {
    var self = this;
    var canvas = this.canvas;
    var content = canvas.selectAll('g#content')
      .data(function (d) { return [d]; });

    var contentEnter = content.enter()
      .append('g')
      .attr('clip-path', 'url(#simple-function-plot-clip-dynamic-' + this.id + ')')
      .attr('id', 'content');

    var line = d3.svg.line()
      .x(function (d) { return self.meta.xScale(d[0]); })
      .y(function (d) { return self.meta.yScale(d[1]); });

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
  };

  Chart.prototype.buildZoomHelper = function () {
    // dummy rect (detects the zoom + drag)
    var self = this;

    // enter
    this.canvas.enter
      .append('rect')
      .attr('class', 'zoom-and-drag')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function () {
        self.emit('all:mouseover');
      })
      .on('mouseout', function () {
        self.emit('all:mouseout');
      })
      .on('mousemove', function () {
        self.emit('all:mousemove');
      });

    // update
    this.canvas.select('.zoom-and-drag')
      .attr('width', width)
      .attr('height', height);
  };

  Chart.prototype.addLink = function (link) {
    this.linkedGraphs.push(link);
  };

  Chart.prototype.getScale = function () {
    return (d3.event && d3.event.scale) || zoomBehavior.scale() || 1;
  };

  Chart.prototype.getFontSize = function () {
    return Math.max(Math.max(width, height) / 50, 8);
  };

  function setUpEventListeners(instance) {
    var events = {
      mousemove: function (x, y) {
        instance.tip.move(x, y);
      },
      mouseover: function () {
        instance.tip.show();
      },
      mouseout: function () {
        instance.tip.hide();
      },
      draw: function () {
        // update the stroke width of the origin lines
        var canvas = instance.canvas;
        canvas.selectAll('.origin')
          .attr('stroke-width', 1 / ((d3.event && d3.event.scale) || 1));

        // content construction (based on graphOptions.type)
        canvas.selectAll('g.graph')
          .each(function (data, index) {
            var options = extend({
              owner: instance,
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
          .x(instance.meta.xZoomScale.domain( xOther.domain() ))
          .y(instance.meta.yZoomScale.domain( yOther.domain() ));
      },
      'tip:update': function (x, y, index) {
        var meta = instance.root.datum().data[index];
        var title = meta.title || '';
        var format = meta.renderer || function (x, y) {
            return x.toFixed(3) + ', ' + y.toFixed(3);
          };

        var text = [];
        title && text.push(title);
        text.push(format(x, y));

        instance.root.select('.top-right-legend')
          .attr('fill', Const.COLORS[index])
          //.text(x.toFixed(3) + ', ' + y.toFixed(3));
          .text(text.join(' '));
      }
    };

    var all = {
      mousemove: function () {
        var mouse = d3.mouse(instance.root.select('rect.zoom-and-drag').node());
        var x = instance.meta.xZoomScale.invert(mouse[0]);
        var y = instance.meta.yZoomScale.invert(mouse[1]);
        instance.linkedGraphs.forEach(function (graph) {
          graph.emit('mousemove', x, y);
        });
      },

      zoom: function (xZoomScale, yZoomScale) {
        instance.linkedGraphs.forEach(function (graph, i) {
          // - updates the position of the axes
          // - updates the position/scale of the clipping rectangle
          var t = d3.event.translate;
          var s = d3.event.scale;
          var canvas = graph.canvas;
          graph.root.select('.dynamic-clip')
            .attr('transform', 'scale(' + 1 / s + ')')
            .attr('x', -t[0])
            .attr('y', -t[1]);
          canvas.select('.x.axis').call(graph.meta.xAxis);
          canvas.select('.y.axis').call(graph.meta.yAxis);
          canvas.select('#content')
            .attr('transform', 'translate(' + t + ')scale(' + s + ')');
          if (i) {
            graph.emit('zoom:scaleUpdate', xZoomScale, yZoomScale);
          }

          // content draw
          graph.emit('draw');
        });

        instance.emit('all:mousemove');
      }
    };

    Object.keys(events).forEach(function (e) {
      instance.on(e, events[e]);
      // create an event for each event existing on `events` in the form 'all:' event
      // e.g. all:mouseover all:mouseout
      // the objective is that all the linked graphs receive the same event as the current graph
      !all[e] && instance.on('all:' + e, function () {
        var args = Array.prototype.slice.call(arguments);
        instance.linkedGraphs.forEach(function (graph) {
          var localArgs = args.slice();
          localArgs.unshift(e);
          graph.emit.apply(graph, localArgs);
        });
      });
    });

    Object.keys(all).forEach(function (e) {
      instance.on('all:' + e, all[e]);
    });
  }

  return Chart();
};
Const = module.exports.constants = require('./lib/constants');
types = module.exports.types = require('./lib/types/');
