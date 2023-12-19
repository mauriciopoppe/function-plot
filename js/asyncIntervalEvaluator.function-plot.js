(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["functionPlot"] = factory();
	else
		root["functionPlot"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 4205:
/***/ ((__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ./node_modules/built-in-math-eval/index.js
var built_in_math_eval = __webpack_require__(5248);
// EXTERNAL MODULE: ./node_modules/interval-arithmetic-eval/index.js
var interval_arithmetic_eval = __webpack_require__(8867);
;// CONCATENATED MODULE: ./src/helpers/eval.mjs



const samplers = {
  interval: interval_arithmetic_eval,
  builtIn: built_in_math_eval
}

// getMathJS returns checks if mathjs is loaded.
function getMathJS() {
  if (typeof global === 'object' && 'math' in global) {
    // @ts-ignore
    return global.math
  }
  if (typeof window === 'object' && 'math' in window) {
    // @ts-ignore
    return window.math
  }
  return null
}

const mathJS = getMathJS()
if (mathJS) {
  // override the built-in module with mathjs's compile
  samplers.builtIn = mathJS.compile
}

function generateEvaluator(samplerName) {
  function doCompile(expression) {
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
    // otherwise throw an error
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

  function compileIfPossible(meta, property) {
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

  function getCompiledExpression(meta, property) {
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
   * @param meta
   * @param property
   * @param variables
   * @returns The builtIn evaluator returns a number, the interval evaluator an array
   */
  function evaluate(meta, property, variables) {
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



// EXTERNAL MODULE: ./node_modules/d3-color/src/color.js
var color = __webpack_require__(4447);
;// CONCATENATED MODULE: ./src/globals.mjs


const Globals = {
  COLORS: [
    'steelblue',
    'red',
    '#05b378', // green
    'orange',
    '#4040e8', // purple
    'yellow',
    'brown',
    'magenta',
    'cyan'
  ].map(function (v) {
    return (0,color/* hsl */.Ym)(v)
  }),
  DEFAULT_WIDTH: 550,
  DEFAULT_HEIGHT: 350,
  DEFAULT_ITERATIONS: null,
  TIP_X_EPS: 1,
  MAX_ITERATIONS: 0,
  graphTypes: {},

  hiddenWorkerPool: null,
  get workerPool() {
    if (!this.hiddenWorkerPool) {
      throw new Error('Failed to get web worker pool, did you forget to call withWebWorkers?')
    }
    return this.hiddenWorkerPool
  },

  set workerPool(workerPool) {
    this.hiddenWorkerPool = workerPool
  }
}

Globals.MAX_ITERATIONS = Globals.DEFAULT_WIDTH * 10

function registerGraphType(graphType, graphTypeBulder) {
  if (Object.hasOwn(Globals.graphTypes, graphType)) {
    throw new Error(`registerGraphType: graphType ${graphType} is already registered.`)
  }
  Globals.graphTypes[graphType] = graphTypeBulder
}


/* harmony default export */ const src_globals = ((/* unused pure expression or super */ null && (Globals)));

;// CONCATENATED MODULE: ./src/utils.mjs


function linspace(lo, hi, n) {
  const step = (hi - lo) / (n - 1)
  return Array.from({ length: n }, (_, i) => lo + step * i)
}

function logspace(lo, hi, n) {
  return linspace(lo, hi, n).map((x) => Math.pow(10, x))
}

function isValidNumber(v) {
  return typeof v === 'number' && !isNaN(v)
}

function space(axis, range, n) {
  const lo = range[0]
  const hi = range[1]
  if (axis.type === 'log') {
    return logspace(Math.log10(lo), Math.log10(hi), n)
  }
  // default is linear
  return linspace(lo, hi, n)
}

/**
 * Creates `n` number of samples between `lo` and `hi` where consecutive
 * numbers are bucketed in `nGroups` groups.
 */
function spaceWithGroups(axis, lo, hi, n, nGroups) {
  if (axis.type === 'log') {
    lo = Math.log10(lo)
    hi = Math.log10(hi)
  }
  const step = (hi - lo) / (n - 1)
  const groups = []
  const maxInGroup = Math.ceil(n / nGroups)
  let group = []
  groups.push(group)
  for (let i = 0; i < n; i += 1) {
    let v = lo + step * i
    if (axis.type === 'log') {
      v = Math.pow(10, v)
    }

    group.push(v)
    if (group.length === maxInGroup && groups.length < nGroups) {
      group = [v]
      groups.push(group)
    }
  }
  return groups
}

function interval2dTypedArray(n, nGroups) {
  const groups = []
  for (let i = 0; i < nGroups; i += 1) {
    groups.push(new Float32Array((n / nGroups) * 4))
  }
  return groups
}

function getterSetter(config, option) {
  const me = this
  this[option] = function (value) {
    if (!arguments.length) {
      return config[option]
    }
    config[option] = value
    return me
  }
}

function sgn(v) {
  if (v < 0) {
    return -1
  }
  if (v > 0) {
    return 1
  }
  return 0
}

function clamp(v, vMin, vMax) {
  if (v < vMin) return vMin
  if (v > vMax) return vMax
  return v
}

function utils_color(data, index) {
  const indexModLenColor = index % globals.COLORS.length
  return data.color || globals.COLORS[indexModLenColor].formatHex()
}

/**
 * Infinity is a value that is close to Infinity but not Infinity, it can fit in a JS number.
 */
function infinity() {
  return 9007199254740991
}

;// CONCATENATED MODULE: ./src/samplers/interval.worker.mjs
/* eslint-disable no-restricted-globals */



self.onmessage = ({ data }) => {
  const d = data.d
  const nTask = data.nTask
  const out = new Float32Array(data.interval2d)
  const xCoords = linspace(data.lo, data.hi, data.n)
  let outIdx = 0
  for (let i = 0; i < xCoords.length - 1; i += 1, outIdx += 4) {
    const x = { lo: xCoords[i], hi: xCoords[i + 1] }
    const y = interval(d, 'fn', { x })
    if (y.lo > y.hi) {
      // is empty
      continue
    }
    out[outIdx + 0] = xCoords[i]
    out[outIdx + 1] = xCoords[i + 1]
    // might return [-Infinity, Infinity] if the interval is a whole interval
    out[outIdx + 2] = y.lo
    out[outIdx + 3] = y.hi
  }
  for (; outIdx < out.length; outIdx += 4) {
    out[outIdx + 0] = Infinity
    out[outIdx + 1] = -Infinity
    out[outIdx + 2] = Infinity
    out[outIdx + 3] = -Infinity
  }
  self.postMessage({ interval2d: out, nTask }, [out.buffer])
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, [117], () => (__webpack_require__(4205)))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".function-plot.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			757: 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkfunctionPlot"] = self["webpackChunkfunctionPlot"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e(117).then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=asyncIntervalEvaluator.function-plot.js.map