import builtInMathEval from 'built-in-math-eval'
import intervalArithmeticEval from 'interval-arithmetic-eval'

const samplers = {
  interval: intervalArithmeticEval,
  builtIn: builtInMathEval
}

// getMathJS returns checks if mathjs is loaded.
function getMathJS(): { compile: any } | null {
  if (typeof global === 'object' && 'math' in global) {
    // @ts-ignore
    return global['math'] as any
  }
  if (typeof window === 'object' && 'math' in window) {
    // @ts-ignore
    return window['math']
  }
  return null
}

let mathJS = getMathJS()
if (mathJS) {
  // override the built-in module with mathjs's compile
  samplers.builtIn = mathJS.compile
}

function generateEvaluator(samplerName: 'interval' | 'builtIn') {
  function doCompile(expression: string | { eval: (scope: any) => any }) {
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
      const compiled = samplers[samplerName](expression)
      if (mathJS && samplerName === 'builtIn') {
        // if mathjs is included use its evaluate method instead
        return { eval: compiled.evaluate || compiled.eval }
      }
      return compiled
    } else if (typeof expression === 'function') {
      return { eval: expression }
    } else {
      throw Error('expression must be a string or a function')
    }
  }

  function compileIfPossible(meta: any, property: string) {
    // compile the function using interval arithmetic, cache the result
    // so that multiple calls with the same argument don't trigger the
    // kinda expensive compilation process
    const expression = meta[property]
    const hiddenProperty = samplerName + '_Expression_' + property
    const hiddenCompiled = samplerName + '_Compiled_' + property
    if (expression !== meta[hiddenProperty]) {
      meta[hiddenProperty] = expression
      meta[hiddenCompiled] = doCompile(expression)
    }
  }

  function getCompiledExpression(meta: any, property: string) {
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
  function evaluate(meta: any, property: string, variables: any) {
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

    return getCompiledExpression(meta, property).eval(Object.assign({}, meta.scope || {}, variables))
  }

  return evaluate
}

const builtIn = generateEvaluator('builtIn')
const interval = generateEvaluator('interval')

export { builtIn, interval }
