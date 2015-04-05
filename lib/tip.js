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
      .attr('clip-path', 'url(#simple-function-plot-clip-' + config.owner.id + ')');

    el = root
      .append('g')
      .attr('class', 'tip')
      .style('display', 'none');

    if (config.xLine) {
      lineGenerator(el, [[0, -config.owner.height() - MARGIN], [0, config.owner.height() + MARGIN]])
        .attr('class', 'tip-x-line');
    }

    if (config.yLine) {
      lineGenerator(el, [[-config.owner.width() - MARGIN, 0], [config.owner.width() + MARGIN, 0]])
        .attr('class', 'tip-y-line');
    }

    el.append('circle')
      .attr('r', 3);

    el.append('text')
      .attr('transform', 'translate(5,-5)');
  }

  tip.move = function (mouse) {
    var i;
    var minDist = Infinity;
    var closestIndex = -1;
    var x, y;

    var data = el.datum();
    var xScale = config.owner.xZoomScale();
    var yScale = config.owner.yZoomScale();

    var x0 = xScale.invert(mouse[0]);
    var y0 = yScale.invert(mouse[1]);
    var selected;

    for (i = 0; i < data.length; i += 1) {
      if (!data[i].skipTip) {
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

    if (closestIndex !== -1) {
      selected = data[closestIndex];
      x = x0;
      y = selected.fn(x0);

      config.owner.emit('tip:update', x, y, closestIndex);
      var clampX = utils.restrict(x, xScale.invert(-MARGIN), xScale.invert(config.owner.width() + MARGIN));
      var clampY = utils.restrict(y, yScale.invert(config.owner.height() + MARGIN), yScale.invert(-MARGIN));
      el.attr('transform', 'translate(' + xScale( clampX ) + ',' + yScale( clampY ) + ')');
      el.select('circle')
        .attr('fill', Const.COLORS[closestIndex]);
      el.select('text')
        .attr('fill', Const.COLORS[closestIndex])
        .text(config.renderer(x, y));
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

