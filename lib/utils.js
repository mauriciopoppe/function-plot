/**
 * Created by mauricio on 3/29/15.
 */
'use strict';

module.exports = {
  isValidNumber: function (v) {
    return typeof v === 'number' && !isNaN(v);
  },

  getterSetter: function (config, option) {
    var me = this;
    this[option] = function (value) {
      if (!arguments.length) {
        return config[option];
      }
      config[option] = value;
      return me;
    };
  },

  restrict: function (v, min, max) {
    if (min > max) {
      var t = min;
      min = max;
      max = t;
    }
    v = Math.max(v, min);
    v = Math.min(v, max);
    return v;
  },

  assert: function (v, message) {
    message = message || 'assertion failed';
    if (!v) {
      throw new Error(message);
    }
  }
};
