/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var d3 = window.d3;

var line = require('../types/line');

module.exports = function (options) {
  var annotations;
  var xScale = options.owner.meta.xScale;
  var yScale = options.owner.meta.yScale;

  var line = d3.svg.line()
    .x(function (d) { return d[0]; })
    .y(function (d) { return d[1]; });

  annotations = function (parentSelection) {
    parentSelection.each(function (d) {
      // join
      var current = d3.select(this);
      var selection = current.selectAll('g.annotations')
        .data(function (d) { return d.annotations || []; });

      // enter
      var enter = selection.enter()
        .append('g')
        .attr('class', 'annotations');

      // enter + update
      // - path
      var yRange = yScale.range();
      var path = enter.selectAll('path')
        .data([ [[0, yRange[0]], [0, yRange[1]]] ]);
      path.enter()
        .append('path')
        .attr('stroke', '#eee')
        .attr('d', line);
      path.exit().remove();

      // enter + update
      // - text
      var text = enter.selectAll('text')
        .data(function (d) { return [d.text || '']; });
      text.enter()
        .append('text')
        .attr('y', 6)
        .attr('dy', '.75em')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .text(function (d) { return d; });
      text.exit().remove();

      // enter + update
      // move group
      selection
        .attr('transform', function (d) {
          return 'translate(' + xScale(d.x) + ', 0)';
        });

      selection.exit().remove();
    });
  };

  return annotations;
};
