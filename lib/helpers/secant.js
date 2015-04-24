/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var d3 = window.d3;

var extend = require('extend');
var line = require('../types/line');
var assert = require('../utils').assert;

module.exports = function (options) {
  var secantDefaults = {
    skipTip: true
  };
  var secant;

  function computeSlope(config) {
    config.m = (config.y1 - config.y0) / (config.x1 - config.x0);
  }

  function updateLine(d, config) {
    assert(config.x0);
    config.y0 = d.fn(config.x0);
    config.y1 = d.fn(config.x1);
    computeSlope(config);
  }

  function setFn(d, config) {
    updateLine(d, config);
    config.fn = function (x) {
      return config.m * (x - config.x0) + config.y0;
    };
  }

  function setMouseListener(d, config) {
    var self = this;
    if (config.updateOnMouseMove && !config.$$mouseListener) {
      config.$$mouseListener = function (x1) {
        config.x1 = x1;
        updateLine(d, config);
        secant(self);
      };
      options.owner.on('tip:update', config.$$mouseListener);
    }
  }

  function computeLines(d) {
    var self = this;
    var data = [];
    for (var i = 0; i < d.secants.length; i += 1) {
      var secant = d.secants[i] = extend({}, secantDefaults, d.secants[i]);
      if (!secant.fn) {
        setFn.call(self, d, secant);
        setMouseListener.call(self, d, secant);
      }
      data.push(secant);
    }
    return data;
  }

  secant = function (selection) {
    selection.each(function (d) {
      var el = d3.select(this);
      var data = computeLines.call(selection, d);
      var innerSelection = el.selectAll('g.secant')
          .data(data);

      innerSelection.enter()
          .append('g')
          .attr('class', 'secant');

      // enter + update
      innerSelection
          .call(line(options));

      // change the opacity of the secants
      innerSelection.selectAll('path')
        .attr('opacity', 0.5);

      // exit
      innerSelection.exit().remove();
    });
  };

  return secant;
};
