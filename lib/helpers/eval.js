'use strict';
var mathCompile = require('built-in-math-eval');
var extend = require('extend');

function compile(meta) {
  if (!meta.fn) {
    throw new Error('fn is required');
  }

  if (meta._expression !== meta.fn) {
    meta._fn = mathCompile(meta.fn);
    meta._expression = meta.fn;
  }

  // make sure that scope also exists for fn
  meta.scope = meta.scope || {};
}

module.exports = function (meta, x) {
  compile(meta);
  return meta._fn.eval(
    extend({x: x}, meta.scope)
  );
};

module.exports.compile = compile;
