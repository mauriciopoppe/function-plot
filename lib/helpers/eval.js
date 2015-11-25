'use strict'
var samplers = {
  interval: require('interval-arithmetic-eval'),
  builtIn: require('built-in-math-eval')
}
var extend = require('extend')

window.math && (samplers.builtIn = window.math.compile)

function generateEvaluator (samplerName) {
  function check (meta, property) {
    /* eslint-disable */
    // compile the function using interval arithmetic, cache the result
    // so that multiple calls with the same argument don't trigger the
    // kinda expensive compilation process
    var compile = samplers[samplerName]
    var hiddenProperty = samplerName + '_Expression_' + '_' + property
    var hiddenPropertyCompiled = samplerName + '_ExpressionCompiled_' + property
    if (meta[property] !== meta[hiddenProperty]) {
      meta[hiddenProperty] = meta[property]
      meta[hiddenPropertyCompiled] = compile(meta[property])
    }
    meta.scope = meta.scope || {}
  /* eslint-enable */
  }

  function getCompiledExpression (meta, property) {
    return meta[samplerName + '_ExpressionCompiled_' + property]
  }

  /**
   * Evaluates meta[property] with `variables`, it does the compilation
   * of the expression if it's a string or just evaluates it if it's a function
   *
   * @param {Object} meta
   * @param {String|Function} property
   * @param {Object} variables
   */
  function evaluate (meta, property, variables) {
    // e.g.
    //  
    //  meta: {
    //    fn: 'x + 3',
    //    scope: { y: 3 }
    //  }
    //  property: 'fn'
    //  variables:  { x: 3 }
    //
    check(meta, property)

    var compiled = getCompiledExpression(meta, property)
    return compiled.eval(
      extend({}, meta.scope, variables)
    )
  }

  return evaluate
}

module.exports.builtIn = generateEvaluator('builtIn')
module.exports.interval = generateEvaluator('interval')
