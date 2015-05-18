/**
 * Created by mauricio on 3/29/15.
 */
'use strict';

module.exports = {
  isValidNumber: function (v) {
    return typeof v === 'number' && !isNaN(v);
  },

  linspace: function (range, n) {
    var samples = [];
    var delta = (range[1] - range[0]) / (n - 1);
    for (var i = 0; i < n; i += 1) {
      samples.push(range[0] + i * delta);
    }
    return samples;
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

  bySign: function (v, min, max) {
    if (v < 0) {
      if (v < min) {
        return v;
      }
      return min;
    } else {
      if (v > max) {
        return v;
      }
      return max;
    }
  },

  assert: function (v, message) {
    message = message || 'assertion failed';
    if (!v) {
      throw new Error(message);
    }
  }
};
