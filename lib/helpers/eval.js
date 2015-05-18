'use strict';
var mathCompile = require('built-in-math-eval');
var extend = require('extend');

function compile(meta) {
  if (!meta.fn) {
    throw new Error('fn is required');
  }

  /* eslint-disable */
  if (meta._expression !== meta.fn) {
    meta._fn = mathCompile(meta.fn);
    meta._expression = meta.fn;
  }
  /* eslint-enable */

  // make sure that scope also exists for fn
  meta.scope = meta.scope || {};
}

module.exports = function (meta, x) {
  compile(meta);

  /* eslint-disable */
  return meta._fn.eval(
    extend({x: x}, meta.scope)
  );
  /* eslint-enable */
};

module.exports.compile = compile;
