'use strict';
var mathjs = require('mathjs');
var samplers = {
  interval: require('interval-arithmetic-eval'),
  mathjs: mathjs.compile
};
var extend = require('extend');

function generateEvaluator(samplerName) {
  function check(meta, property) {
    /* eslint-disable */
    // compile the function using interval arithmetic, cache the result
    // so that multiple calls with the same argument don't trigger the
    // kinda expensive compilation process
    var compile = samplers[samplerName];
    var hiddenProperty = samplerName + '_Expression_' + '_' + property;
    var hiddenPropertyCompiled = samplerName + '_ExpressionCompiled_' + property;
    if (meta[property] !== meta[hiddenProperty]) {
      meta[hiddenProperty] = meta[property];
      meta[hiddenPropertyCompiled] = compile(meta[property]);
    }
    meta.scope = meta.scope || {};
    /* eslint-enable */
  }

  function getCompiledExpression(meta, property) {
    return meta[samplerName + '_ExpressionCompiled_' + property];
  }

  function evaluate(meta, property, variables) {
    check(meta, property);
    /* eslint-disable */
    var compiled = getCompiledExpression(meta, property);
    /* eslint-enable */
    return compiled.eval(
      extend({}, meta.scope, variables)
    );
  }

  return evaluate;
}

module.exports.mathjs = generateEvaluator('mathjs');
module.exports.interval = generateEvaluator('interval');
