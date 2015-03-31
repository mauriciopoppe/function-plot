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
    el = selection
      .append('g')
      .attr('class', 'tip')
      .style('display', 'none');

    if (config.xLine) {
      lineGenerator(el, [[0, -Const.LIMIT], [0, Const.LIMIT]])
        .attr('class', 'tip-x-line');
    }

    if (config.yLine) {
      lineGenerator(el, [[-Const.LIMIT, 0], [Const.LIMIT, 0]])
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
    var closest = -1;
    var closestIndex = -1;

    var data = el.datum();
    var xScale = config.owner.xScale();
    var yScale = config.owner.yScale();

    var x0 = xScale.invert(mouse[0]);
    var y0 = yScale.invert(mouse[1]);

    for (i = 0; i < data.length; i += 1) {
      var range = data[i].range;
      if (range[0] <= x0 && range[1] >= x0) {
        var candidateY = data[i].fn(x0);
        var tDist = Math.abs(candidateY - y0);
        if (utils.isValidNumber(candidateY) && tDist < minDist) {
          minDist = tDist;
          closest = candidateY;
          closestIndex = i;
        }
      }
    }
    if (minDist !== Infinity) {
      config.owner.emit('tip:update', x0, closest, closestIndex);
      el.attr('transform', 'translate(' + xScale(x0) + ',' + yScale(closest) + ')');
      el.select('circle')
        .attr('fill', Const.COLORS[closestIndex]);
      el.select('text')
        .attr('fill', Const.COLORS[closestIndex])
        .text(config.renderer(x0, closest));
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

