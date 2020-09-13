'use strict'
var samplers = {
  interval: require('interval-arithmetic-eval'),
  builtIn: require('built-in-math-eval')
}
var extend = require('extend')

window.math && (samplers.builtIn = window.math.compile)

function generateEvaluator (samplerName) {
  function doCompile (expression) {
    // compiles does the following
    //
    // when expression === string
    //
    //     gen = new require('math-codegen')
    //     return gen.parse(expression).compile(Interval|BultInMath)
    //
    //     which is an object with the form
    //
    //     {
    //       eval: function (scope) {
    //         // math-codegen magic
    //       }
    //     }
    //
    // when expression === function
    //
    //    {
    //      eval: expression
    //    }
    //
    // othewise throw an error
    if (typeof expression === 'string') {
      var compile = samplers[samplerName]
      return compile(expression)
    } else if (typeof expression === 'function') {
      return { eval: expression }
    } else {
      throw Error('expression must be a string or a function')
    }
  }

  function compileIfPossible (meta, property) {
    // compile the function using interval arithmetic, cache the result
    // so that multiple calls with the same argument don't trigger the
    // kinda expensive compilation process
    var expression = meta[property]
    var hiddenProperty = samplerName + '_Expression_' + property
    var hiddenCompiled = samplerName + '_Compiled_' + property
    if (expression !== meta[hiddenProperty]) {
      meta[hiddenProperty] = expression
      meta[hiddenCompiled] = doCompile(expression)
    }
  }

  function getCompiledExpression (meta, property) {
    return meta[samplerName + '_Compiled_' + property]
  }

  /**
   * Evaluates meta[property] with `variables`
   *
   * - Compiles meta[property] if it wasn't compiled already (also with cache
   *   check)
   * - Evaluates the resulting function with the merge of meta.scope and
   *   `variables`
   *
   * @param {Object} meta
   * @param {String} property
   * @param {Object} variables
   * @returns {Number|Array} The builtIn evaluator returns a number, the
   * interval evaluator an array
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
    compileIfPossible(meta, property)

    return getCompiledExpression(meta, property).eval(
      extend({}, meta.scope || {}, variables)
    )
  }

  return evaluate
}

module.exports.builtIn = generateEvaluator('builtIn')
module.exports.interval = generateEvaluator('interval')
