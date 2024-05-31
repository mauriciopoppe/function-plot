import builtInMathEval from 'built-in-math-eval'
import intervalArithmeticEval from 'interval-arithmetic-eval'

/**
 * @param expressionCompiler A function which when called must return an object
 * with the form \{ eval: function \}
 */
function registerEvaluator(samplerName, expressionCompiler) {
  function getCompiledExpression(meta, property) {
    const hiddenProperty = samplerName + '_Expression_' + property
    const hiddenCompiled = samplerName + '_Compiled_' + property
    if (meta[property] !== meta[hiddenProperty]) {
      meta[hiddenProperty] = meta[property]
      // compile the function once and cache the result so that multiple calls
      // with the same argument don't trigger the expensive compilation process
      meta[hiddenCompiled] = expressionCompiler(meta[property])
    }
    return meta[hiddenCompiled]
  }

  /**
   * Evaluates meta[property] with `variables`
   *
   * - Compiles meta[property] if it wasn't compiled already (also with cache
   *   check)
   * - Evaluates the resulting function with the merge of meta.scope and
   *   `variables`
   *
   * @example
   *
   * meta: {
   *   fn: 'x + 3',
   *   scope: { y: 3 }
   * }
   * property: 'fn'
   * variables:  { x: 3 }
   *
   * @param meta
   * @param property
   * @param variables
   * @returns The builtIn evaluator returns a number, the interval evaluator an array
   */
  function evaluate(meta, property, variables) {
    return getCompiledExpression(meta, property).eval(Object.assign({}, meta.scope || {}, variables))
  }

  return evaluate
}

function builtInExpressionCompiler(expression) {
  if (typeof expression === 'string') {
    return builtInMathEval(expression)
  } else if (typeof expression === 'function') {
    return { eval: expression }
  } else {
    throw Error('expression must be a string or a function')
  }
}

const builtIn = registerEvaluator('builtIn', builtInExpressionCompiler)

function intervalExpressionCompiler(expression) {
  if (typeof expression === 'string') {
    return intervalArithmeticEval(expression)
  } else if (typeof expression === 'function') {
    return { eval: expression }
  } else {
    throw Error('expression must be a string or a function')
  }
}

const interval = registerEvaluator('interval', intervalExpressionCompiler)

export { builtIn, interval, registerEvaluator }
