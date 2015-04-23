/**
 * Created by mauricio on 3/29/15.
 */
'use strict';

module.exports = {
  isValidNumber: function (v) {
    return typeof v === 'number' && !isNaN(v) && isFinite(v);
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

  clamp: function (v, min, max) {
    if (min > max) {
      var t = min;
      min = max;
      max = t;
    }
    if (v < min) {
      v = min;
    }
    if (v > max) {
      v = max;
    }
    return v;
  },

  sgn: function (v) {
    if (v < 0) { return -1; }
    if (v > 0) { return 1; }
    return 0;
  },

  assert: function (v, message) {
    message = message || 'assertion failed';
    if (!v) {
      throw new Error(message);
    }
  }
};
