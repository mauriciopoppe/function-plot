/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var d3 = window.d3;

var Const = require('../constants');
var dataBuilder = require('../data');

module.exports = function (options) {
  var minWidthHeight;
  var xScale = options.owner.meta.xScale;
  var yScale = options.owner.meta.yScale;

  var line = function (points) {
    var path = '';
    for (var i = 0, length = points.length; i < length; i += 1) {
      if (points[i]) {
        var x = points[i][0];
        var y = points[i][1];
        var yLo = y.lo;
        var yHi = y.hi;
        // if options.closed is set to true then one of the bounds must be zero
        if (options.closed) {
          yLo = Math.min(yLo, 0);
          yHi = Math.max(yHi, 0);
        }
        // points.scaledDX is added because of the stroke-width
        var moveX = xScale(x.lo) + points.scaledDx / 2;
        var moveY = yScale(yHi);
        var diffY = Math.max(yScale(yLo) - yScale(yHi), minWidthHeight);
        path += ' M ' + moveX + ' ' + moveY;
        path += ' v ' + diffY;
      }
    }
    return path;
  };

  function plotLine(selection) {
    var index = options.index;

    selection.each(function (data) {
      var el = plotLine.el = d3.select(this);
      var evaluatedData = dataBuilder.eval(options.owner, data);
      var innerSelection = el.selectAll(':scope > path.line')
        .data(evaluatedData);

      // the min height/width of the rects drawn by the path generator
      minWidthHeight = Math.max(evaluatedData[0].scaledDx, 1.5);

      innerSelection.enter()
        .append('path')
        .attr('class', 'line line-' + index)
        .attr('stroke', Const.COLORS[index])
        .attr('fill', 'none');

      // enter + update
      innerSelection
        .each(function () {
          var path = d3.select(this);
          path
            .attr('stroke-width', minWidthHeight)
            .attr('opacity', options.closed ? 0.5 : 1)
            .attr('d', line);
        });

      innerSelection.exit().remove();
    });
  }

  return plotLine;
};
