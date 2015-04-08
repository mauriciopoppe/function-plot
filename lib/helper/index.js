/**
 * Created by mauricio on 4/8/15.
 */
'use strict';
var d3 = window.d3;
var derivative = require('./derivative');
module.exports = function (options) {
  function helper(selection) {
    selection.each(function (d) {
      var el = d3.select(this);
      if (d.derivative) {
        el.call(derivative(options));
      }
    });
  }

  return helper;
};
