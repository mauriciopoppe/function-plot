/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var d3 = window.d3;
var extend = require('extend');
var utils = require('./utils');
var Const = require('./constants');

module.exports = function (config) {
  config = extend({
    xLine: false,
    yLine: false,
    renderer: function (x, y) {
      return '(' + x.toFixed(3) + ', ' + y.toFixed(3) + ')';
    },
    owner: null
  }, config);

  var MARGIN = 20;
  var root;
  var el;

  var line = d3.svg.line()
    .x(function (d) { return d[0]; })
    .y(function (d) { return d[1]; });

  function lineGenerator(el, data) {
    el.append('path')
      .datum(data)
      .attr('stroke', 'grey')
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.5)
      .attr('d', line);
    return el;
  }

  function tip(selection) {
    root = selection.append('g')
      .attr('class', 'tip')
      .attr('clip-path', 'url(#function-plot-clip-' + config.owner.id + ')');

    el = root.append('g')
      .style('display', 'none');

    if (config.xLine) {
      lineGenerator(el, [[0, -config.owner.meta.height - MARGIN], [0, config.owner.meta.height + MARGIN]])
        .attr('class', 'tip-x-line');
    }

    if (config.yLine) {
      lineGenerator(el, [[-config.owner.meta.width - MARGIN, 0], [config.owner.meta.width + MARGIN, 0]])
        .attr('class', 'tip-y-line');
    }

    el.append('circle')
      .attr('r', 3);

    el.append('text')
      .attr('transform', 'translate(5,-5)');
  }

  tip.move = function (x0, y0) {
    var i;
    var minDist = Infinity;
    var closestIndex = -1;
    var x, y;

    var inf = 1e8;
    var meta = config.owner.meta;
    var data = el.datum().data;
    var xScale = meta.xScale;
    var yScale = meta.yScale;
    var width = meta.width;
    var height = meta.height;

    for (i = 0; i < data.length; i += 1) {
      if (!data[i].skipTip) {
        var range = data[i].range || [-inf, inf];
        if (x0 > range[0] - Const.TIP_X_EPS && x0 < range[1] + Const.TIP_X_EPS) {
          var candidateY = data[i].fn(x0);
          if (utils.isValidNumber(candidateY)) {
            var tDist = Math.abs(candidateY - y0);
            if (tDist < minDist) {
              minDist = tDist;
              closestIndex = i;
            }
          }
        }
      }
    }

    if (closestIndex !== -1) {
      x = x0;
      if (data[closestIndex].range) {
        x = Math.max(x, data[closestIndex].range[0]);
        x = Math.min(x, data[closestIndex].range[1]);
      }
      y = data[closestIndex].fn(x);

      tip.show();
      config.owner.emit('tip:update', x, y, closestIndex);
      var clampX = utils.restrict(x, xScale.invert(-MARGIN), xScale.invert(width + MARGIN));
      var clampY = utils.restrict(y, yScale.invert(height + MARGIN), yScale.invert(-MARGIN));
      el.attr('transform', 'translate(' + xScale( clampX ) + ',' + yScale( clampY ) + ')');
      el.select('circle')
        .attr('fill', Const.COLORS[closestIndex]);
      el.select('text')
        .attr('fill', Const.COLORS[closestIndex])
        .text(config.renderer(x, y));
    } else {
      tip.hide();
    }
  };

  tip.show = function () {
    el.style('display', null);
  };

  tip.hide = function () {
    el.style('display', 'none');
  };
  // generations of getters/setters
  Object.keys(config).forEach(function (option) {
    utils.getterSetter.call(tip, config, option);
  });

  return tip;
};

