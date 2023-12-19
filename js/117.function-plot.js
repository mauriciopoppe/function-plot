(self["webpackChunkfunctionPlot"] = self["webpackChunkfunctionPlot"] || []).push([[117],{

/***/ 5248:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * built-in-math-eval
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */



module.exports = __webpack_require__(9976)


/***/ }),

/***/ 517:
/***/ ((module) => {

"use strict";

module.exports = function () {
  var math = Object.create(Math)

  math.factory = function (a) {
    if (typeof a !== 'number') {
      throw new TypeError('built-in math factory only accepts numbers')
    }
    return Number(a)
  }

  math.add = function (a, b) {
    return a + b
  }
  math.sub = function (a, b) {
    return a - b
  }
  math.mul = function (a, b) {
    return a * b
  }
  math.div = function (a, b) {
    return a / b
  }
  math.mod = function (a, b) {
    return a % b
  }
  math.factorial = function (a) {
    var res = 1
    for (var i = 2; i <= a; i += 1) {
      res *= i
    }
    return res
  }

  // taken from https://github.com/josdejong/mathjs/blob/master/lib/function/arithmetic/nthRoot.js
  math.nthRoot = function (a, root) {
    var inv = root < 0
    if (inv) {
      root = -root
    }

    if (root === 0) {
      throw new Error('Root must be non-zero')
    }
    if (a < 0 && (Math.abs(root) % 2 !== 1)) {
      throw new Error('Root must be odd when a is negative.')
    }

    // edge cases zero and infinity
    if (a === 0) {
      return 0
    }
    if (!isFinite(a)) {
      return inv ? 0 : a
    }

    var x = Math.pow(Math.abs(a), 1 / root)
    // If a < 0, we require that root is an odd integer,
    // so (-1) ^ (1/root) = -1
    x = a < 0 ? -x : x
    return inv ? 1 / x : x
  }

  // logical
  math.logicalOR = function (a, b) {
    return a || b
  }
  math.logicalXOR = function (a, b) {
    /* eslint-disable */
    return a != b
    /* eslint-enable*/
  }
  math.logicalAND = function (a, b) {
    return a && b
  }

  // bitwise
  math.bitwiseOR = function (a, b) {
    /* eslint-disable */
    return a | b
    /* eslint-enable*/
  }
  math.bitwiseXOR = function (a, b) {
    /* eslint-disable */
    return a ^ b
    /* eslint-enable*/
  }
  math.bitwiseAND = function (a, b) {
    /* eslint-disable */
    return a & b
    /* eslint-enable*/
  }

  // relational
  math.lessThan = function (a, b) {
    return a < b
  }
  math.lessEqualThan = function (a, b) {
    return a <= b
  }
  math.greaterThan = function (a, b) {
    return a > b
  }
  math.greaterEqualThan = function (a, b) {
    return a >= b
  }
  math.equal = function (a, b) {
    /* eslint-disable */
    return a == b
  /* eslint-enable*/
  }
  math.strictlyEqual = function (a, b) {
    return a === b
  }
  math.notEqual = function (a, b) {
    /* eslint-disable */
    return a != b
  /* eslint-enable*/
  }
  math.strictlyNotEqual = function (a, b) {
    return a !== b
  }

  // shift
  math.shiftRight = function (a, b) {
    return (a >> b)
  }
  math.shiftLeft = function (a, b) {
    return (a << b)
  }
  math.unsignedRightShift = function (a, b) {
    return (a >>> b)
  }

  // unary
  math.negative = function (a) {
    return -a
  }
  math.positive = function (a) {
    return a
  }

  return math
}


/***/ }),

/***/ 9976:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var CodeGenerator = __webpack_require__(2223)
var math = __webpack_require__(517)()

function processScope (scope) {
  Object.keys(scope).forEach(function (k) {
    var value = scope[k]
    scope[k] = math.factory(value)
  })
}

module.exports = function (expression) {
  return new CodeGenerator()
    .setDefs({
      $$processScope: processScope
    })
    .parse(expression)
    .compile(math)
}

module.exports.math = math


/***/ }),

/***/ 4635:
/***/ ((module) => {

var hasTypedArrays = false
if(typeof Float64Array !== "undefined") {
  var DOUBLE_VIEW = new Float64Array(1)
    , UINT_VIEW   = new Uint32Array(DOUBLE_VIEW.buffer)
  DOUBLE_VIEW[0] = 1.0
  hasTypedArrays = true
  if(UINT_VIEW[1] === 0x3ff00000) {
    //Use little endian
    module.exports = function doubleBitsLE(n) {
      DOUBLE_VIEW[0] = n
      return [ UINT_VIEW[0], UINT_VIEW[1] ]
    }
    function toDoubleLE(lo, hi) {
      UINT_VIEW[0] = lo
      UINT_VIEW[1] = hi
      return DOUBLE_VIEW[0]
    }
    module.exports.pack = toDoubleLE
    function lowUintLE(n) {
      DOUBLE_VIEW[0] = n
      return UINT_VIEW[0]
    }
    module.exports.lo = lowUintLE
    function highUintLE(n) {
      DOUBLE_VIEW[0] = n
      return UINT_VIEW[1]
    }
    module.exports.hi = highUintLE
  } else if(UINT_VIEW[0] === 0x3ff00000) {
    //Use big endian
    module.exports = function doubleBitsBE(n) {
      DOUBLE_VIEW[0] = n
      return [ UINT_VIEW[1], UINT_VIEW[0] ]
    }
    function toDoubleBE(lo, hi) {
      UINT_VIEW[1] = lo
      UINT_VIEW[0] = hi
      return DOUBLE_VIEW[0]
    }
    module.exports.pack = toDoubleBE
    function lowUintBE(n) {
      DOUBLE_VIEW[0] = n
      return UINT_VIEW[1]
    }
    module.exports.lo = lowUintBE
    function highUintBE(n) {
      DOUBLE_VIEW[0] = n
      return UINT_VIEW[0]
    }
    module.exports.hi = highUintBE
  } else {
    hasTypedArrays = false
  }
}
if(!hasTypedArrays) {
  var buffer = new Buffer(8)
  module.exports = function doubleBits(n) {
    buffer.writeDoubleLE(n, 0, true)
    return [ buffer.readUInt32LE(0, true), buffer.readUInt32LE(4, true) ]
  }
  function toDouble(lo, hi) {
    buffer.writeUInt32LE(lo, 0, true)
    buffer.writeUInt32LE(hi, 4, true)
    return buffer.readDoubleLE(0, true)
  }
  module.exports.pack = toDouble  
  function lowUint(n) {
    buffer.writeDoubleLE(n, 0, true)
    return buffer.readUInt32LE(0, true)
  }
  module.exports.lo = lowUint
  function highUint(n) {
    buffer.writeDoubleLE(n, 0, true)
    return buffer.readUInt32LE(4, true)
  }
  module.exports.hi = highUint
}

module.exports.sign = function(n) {
  return module.exports.hi(n) >>> 31
}

module.exports.exponent = function(n) {
  var b = module.exports.hi(n)
  return ((b<<1) >>> 21) - 1023
}

module.exports.fraction = function(n) {
  var lo = module.exports.lo(n)
  var hi = module.exports.hi(n)
  var b = hi & ((1<<20) - 1)
  if(hi & 0x7ff00000) {
    b += (1<<20)
  }
  return [lo, b]
}

module.exports.denormalized = function(n) {
  var hi = module.exports.hi(n)
  return !(hi & 0x7ff00000)
}

/***/ }),

/***/ 4470:
/***/ ((module) => {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


/***/ }),

/***/ 8867:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * interval-arithmetic-eval
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */

module.exports = __webpack_require__(2320)


/***/ }),

/***/ 3380:
/***/ ((module) => {

"use strict";

module.exports = function (ns) {
  // mod
  ns.mod = ns.fmod

  // relational
  ns.lessThan = ns.lt
  ns.lessEqualThan = ns.leq
  ns.greaterThan = ns.gt
  ns.greaterEqualThan = ns.geq

  ns.strictlyEqual = ns.equal
  ns.strictlyNotEqual = ns.notEqual

  ns.logicalAND = function (a, b) {
    return a && b
  }
  ns.logicalXOR = function (a, b) {
    return a ^ b
  }
  ns.logicalOR = function (a, b) {
    return a || b
  }
}


/***/ }),

/***/ 2320:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Created by mauricio on 5/12/15.
 */


const CodeGenerator = __webpack_require__(813)
const Interval = (__webpack_require__(9851)/* ["default"] */ .ZP)
__webpack_require__(3380)(Interval)

function processScope (scope) {
  Object.keys(scope).forEach(function (k) {
    const value = scope[k]
    if (typeof value === 'number' || Array.isArray(value)) {
      scope[k] = Interval.factory(value)
    } else if (typeof value === 'object' && 'lo' in value && 'hi' in value) {
      scope[k] = Interval.factory(value.lo, value.hi)
    }
  })
}

module.exports = function (expression) {
  return new CodeGenerator()
    .setDefs({
      $$processScope: processScope
    })
    .parse(expression)
    .compile(Interval)
}

module.exports.policies = __webpack_require__(4186)(Interval)
module.exports.Interval = Interval


/***/ }),

/***/ 4186:
/***/ ((module) => {

"use strict";
/**
 * Created by mauricio on 5/12/15.
 */

module.exports = function (Interval) {
  return {
    disableRounding: function () {
      Interval.round.disable()
    },

    enableRounding: function () {
      Interval.round.enable()
    }
  }
}


/***/ }),

/***/ 813:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * math-codegen
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */

module.exports = __webpack_require__(7076)


/***/ }),

/***/ 7076:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Parser = (__webpack_require__(9213).Parser)
var Interpreter = __webpack_require__(1046)
var extend = __webpack_require__(4470)

function CodeGenerator (options, defs) {
  this.statements = []
  this.defs = defs || {}
  this.interpreter = new Interpreter(this, options)
}

CodeGenerator.prototype.setDefs = function (defs) {
  this.defs = extend(this.defs, defs)
  return this
}

CodeGenerator.prototype.compile = function (namespace) {
  var self = this
  if (!namespace || !(typeof namespace === 'object' || typeof namespace === 'function')) {
    throw TypeError('namespace must be an object')
  }
  if (typeof namespace.factory !== 'function') {
    throw TypeError('namespace.factory must be a function')
  }

  // definitions available in the function
  // each property under this.defs is mapped to local variables
  // e.g
  //
  //  function (defs) {
  //    var ns = defs['ns']
  //    // code generated for the expression
  //  }
  this.defs.ns = namespace
  this.defs.$$mathCodegen = {
    getProperty: function (symbol, scope, ns) {
      function applyFactoryIfNeeded (value) {
        if (self.interpreter.options.applyFactoryToScope && typeof value !== 'function') {
          return ns.factory(value)
        }
        return value
      }

      if (symbol in scope) {
        return applyFactoryIfNeeded(scope[symbol])
      }
      if (symbol in ns) {
        return applyFactoryIfNeeded(ns[symbol])
      }
      throw SyntaxError('symbol "' + symbol + '" is undefined')
    },
    functionProxy: function (fn, name) {
      if (typeof fn !== 'function') {
        throw SyntaxError('symbol "' + name + '" must be a function')
      }
      return fn
    }
  }
  this.defs.$$processScope = this.defs.$$processScope || function () {}

  var defsCode = Object.keys(this.defs).map(function (name) {
    return 'var ' + name + ' = defs["' + name + '"]'
  })

  // statement join
  if (!this.statements.length) {
    throw Error('there are no statements saved in this generator, make sure you parse an expression before compiling it')
  }

  // last statement is always a return statement
  this.statements[this.statements.length - 1] = 'return ' + this.statements[this.statements.length - 1]

  var code = this.statements.join(';')
  var factoryCode = defsCode.join('\n') + '\n' + [
    'return {',
    '  eval: function (scope) {',
    '    scope = scope || {}',
    '    $$processScope(scope)',
    '    ' + code,
    '  },',
    "  code: '" + code + "'",
    '}'
  ].join('\n')

  /* eslint-disable */
  var factory = new Function('defs', factoryCode)
  return factory(this.defs)
  /* eslint-enable */
}

CodeGenerator.prototype.parse = function (code) {
  var self = this
  var program = new Parser().parse(code)
  this.statements = program.blocks.map(function (statement) {
    return self.interpreter.next(statement)
  })
  return this
}

module.exports = CodeGenerator


/***/ }),

/***/ 1046:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var extend = __webpack_require__(4470)

var types = {
  ArrayNode: __webpack_require__(5483),
  AssignmentNode: __webpack_require__(446),
  ConditionalNode: __webpack_require__(3865),
  ConstantNode: __webpack_require__(9094),
  FunctionNode: __webpack_require__(73),
  OperatorNode: __webpack_require__(1715),
  SymbolNode: __webpack_require__(5835),
  UnaryNode: __webpack_require__(74)
}

var Interpreter = function (owner, options) {
  this.owner = owner
  this.options = extend({
    factory: 'ns.factory',
    raw: false,
    rawArrayExpressionElements: true,
    rawCallExpressionElements: false,
    applyFactoryToScope: false
  }, options)
}

extend(Interpreter.prototype, types)

// main method which decides which expression to call
Interpreter.prototype.next = function (node) {
  if (!(node.type in this)) {
    throw new TypeError('the node type ' + node.type + ' is not implemented')
  }
  return this[node.type](node)
}

Interpreter.prototype.rawify = function (test, fn) {
  var oldRaw = this.options.raw
  if (test) {
    this.options.raw = true
  }
  fn()
  if (test) {
    this.options.raw = oldRaw
  }
}

module.exports = Interpreter


/***/ }),

/***/ 8684:
/***/ ((module) => {

"use strict";


module.exports = {
  // arithmetic
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div',
  '^': 'pow',
  '%': 'mod',
  '!': 'factorial',

  // misc operators
  '|': 'bitwiseOR',       // bitwise or
  '^|': 'bitwiseXOR',     // bitwise xor
  '&': 'bitwiseAND',      // bitwise and

  '||': 'logicalOR',      // logical or
  'xor': 'logicalXOR',    // logical xor
  '&&': 'logicalAND',     // logical and

  // comparison
  '<': 'lessThan',
  '>': 'greaterThan',
  '<=': 'lessEqualThan',
  '>=': 'greaterEqualThan',
  '===': 'strictlyEqual',
  '==': 'equal',
  '!==': 'strictlyNotEqual',
  '!=': 'notEqual',

  // shift
  '>>': 'shiftRight',
  '<<': 'shiftLeft',
  '>>>': 'unsignedRightShift'
}


/***/ }),

/***/ 1681:
/***/ ((module) => {

"use strict";


module.exports = {
  '+': 'positive',
  '-': 'negative',
  '~': 'oneComplement'
}


/***/ }),

/***/ 5483:
/***/ ((module) => {

"use strict";

module.exports = function (node) {
  var self = this
  var arr = []
  this.rawify(this.options.rawArrayExpressionElements, function () {
    arr = node.nodes.map(function (el) {
      return self.next(el)
    })
  })
  var arrString = '[' + arr.join(',') + ']'

  if (this.options.raw) {
    return arrString
  }
  return this.options.factory + '(' + arrString + ')'
}


/***/ }),

/***/ 446:
/***/ ((module) => {

"use strict";


module.exports = function (node) {
  return 'scope["' + node.name + '"] = ' + this.next(node.expr)
}


/***/ }),

/***/ 3865:
/***/ ((module) => {

"use strict";


module.exports = function (node) {
  var condition = '!!(' + this.next(node.condition) + ')'
  var trueExpr = this.next(node.trueExpr)
  var falseExpr = this.next(node.falseExpr)
  return '(' + condition + ' ? (' + trueExpr + ') : (' + falseExpr + ') )'
}


/***/ }),

/***/ 9094:
/***/ ((module) => {

"use strict";

module.exports = function (node) {
  if (this.options.raw) {
    return node.value
  }
  return this.options.factory + '(' + node.value + ')'
}


/***/ }),

/***/ 73:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var SymbolNode = (__webpack_require__(9213).nodeTypes.SymbolNode)

var functionProxy = function (node) {
  return '$$mathCodegen.functionProxy(' + this.next(new SymbolNode(node.name)) + ', "' + node.name + '")'
}

module.exports = function (node) {
  var self = this
  // wrap in a helper function to detect the type of symbol it must be a function
  // NOTE: if successful the wrapper returns the function itself
  // NOTE: node.name should be a symbol so that it's correctly represented as a string in SymbolNode
  var method = functionProxy.call(this, node)
  var args = []
  this.rawify(this.options.rawCallExpressionElements, function () {
    args = node.args.map(function (arg) {
      return self.next(arg)
    })
  })
  return method + '(' + args.join(', ') + ')'
}

module.exports.functionProxy = functionProxy


/***/ }),

/***/ 1715:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Operators = __webpack_require__(8684)

module.exports = function (node) {
  if (this.options.raw) {
    return ['(' + this.next(node.args[0]), node.op, this.next(node.args[1]) + ')'].join(' ')
  }

  var namedOperator = Operators[node.op]

  if (!namedOperator) {
    throw TypeError('unidentified operator')
  }

  /* eslint-disable new-cap */
  return this.FunctionNode({
    name: namedOperator,
    args: node.args
  })
  /* eslint-enable new-cap */
}


/***/ }),

/***/ 5835:
/***/ ((module) => {

"use strict";


module.exports = function (node) {
  var id = node.name
  return '$$mathCodegen.getProperty("' + id + '", scope, ns)'
}


/***/ }),

/***/ 74:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var UnaryOperators = __webpack_require__(1681)

module.exports = function (node) {
  if (this.options.raw) {
    return node.op + this.next(node.argument)
  }

  if (!(node.op in UnaryOperators)) {
    throw new SyntaxError(node.op + ' not implemented')
  }

  var namedOperator = UnaryOperators[node.op]
  /* eslint-disable new-cap */
  return this.FunctionNode({
    name: namedOperator,
    args: [node.argument]
  })
  /* eslint-enable new-cap */
}


/***/ }),

/***/ 9851:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ZP: () => (/* binding */ lib_esm)
});

// UNUSED EXPORTS: Interval, LOG_EXP_10, LOG_EXP_2, abs, acos, add, almostEqual, asin, assertIncludes, atan, clone, constants, cos, cosh, difference, div, divide, equal, exp, fmod, geq, greaterEqualThan, greaterThan, gt, hasInterval, hasValue, hull, intersection, intervalsOverlap, isEmpty, isInterval, isSingleton, isWhole, leq, lessEqualThan, lessThan, ln, log, log10, log2, lt, max, min, mul, multiplicativeInverse, multiply, negative, notEqual, nthRoot, positive, pow, round, sin, sinh, sqrt, sub, subtract, tan, tanh, union, wid, width, zeroIn

// NAMESPACE OBJECT: ./node_modules/interval-arithmetic/lib-esm/operations/utils.js
var utils_namespaceObject = {};
__webpack_require__.r(utils_namespaceObject);
__webpack_require__.d(utils_namespaceObject, {
  hasInterval: () => (hasInterval),
  hasValue: () => (hasValue),
  intervalsOverlap: () => (intervalsOverlap),
  isEmpty: () => (isEmpty),
  isInterval: () => (isInterval),
  isSingleton: () => (isSingleton),
  isWhole: () => (isWhole),
  zeroIn: () => (zeroIn)
});

// NAMESPACE OBJECT: ./node_modules/interval-arithmetic/lib-esm/operations/relational.js
var relational_namespaceObject = {};
__webpack_require__.r(relational_namespaceObject);
__webpack_require__.d(relational_namespaceObject, {
  almostEqual: () => (almostEqual),
  assertIncludes: () => (assertIncludes),
  equal: () => (equal),
  geq: () => (geq),
  greaterEqualThan: () => (greaterEqualThan),
  greaterThan: () => (greaterThan),
  gt: () => (gt),
  leq: () => (leq),
  lessEqualThan: () => (lessEqualThan),
  lessThan: () => (lessThan),
  lt: () => (lt),
  notEqual: () => (notEqual)
});

// NAMESPACE OBJECT: ./node_modules/interval-arithmetic/lib-esm/operations/arithmetic.js
var arithmetic_namespaceObject = {};
__webpack_require__.r(arithmetic_namespaceObject);
__webpack_require__.d(arithmetic_namespaceObject, {
  add: () => (add),
  div: () => (div),
  divide: () => (divide),
  mul: () => (mul),
  multiply: () => (multiply),
  negative: () => (arithmetic_negative),
  positive: () => (arithmetic_positive),
  sub: () => (sub),
  subtract: () => (subtract)
});

// NAMESPACE OBJECT: ./node_modules/interval-arithmetic/lib-esm/operations/algebra.js
var algebra_namespaceObject = {};
__webpack_require__.r(algebra_namespaceObject);
__webpack_require__.d(algebra_namespaceObject, {
  fmod: () => (fmod),
  multiplicativeInverse: () => (multiplicativeInverse),
  nthRoot: () => (nthRoot),
  pow: () => (pow),
  sqrt: () => (sqrt)
});

// NAMESPACE OBJECT: ./node_modules/interval-arithmetic/lib-esm/operations/misc.js
var misc_namespaceObject = {};
__webpack_require__.r(misc_namespaceObject);
__webpack_require__.d(misc_namespaceObject, {
  LOG_EXP_10: () => (LOG_EXP_10),
  LOG_EXP_2: () => (LOG_EXP_2),
  abs: () => (abs),
  clone: () => (clone),
  difference: () => (difference),
  exp: () => (exp),
  hull: () => (hull),
  intersection: () => (intersection),
  ln: () => (ln),
  log: () => (log),
  log10: () => (log10),
  log2: () => (log2),
  max: () => (max),
  min: () => (min),
  union: () => (union),
  wid: () => (wid),
  width: () => (width)
});

// NAMESPACE OBJECT: ./node_modules/interval-arithmetic/lib-esm/operations/trigonometric.js
var trigonometric_namespaceObject = {};
__webpack_require__.r(trigonometric_namespaceObject);
__webpack_require__.d(trigonometric_namespaceObject, {
  acos: () => (acos),
  asin: () => (asin),
  atan: () => (atan),
  cos: () => (cos),
  cosh: () => (cosh),
  sin: () => (sin),
  sinh: () => (sinh),
  tan: () => (tan),
  tanh: () => (tanh)
});

;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/operations/utils.js
/**
 * @mixin utils
 */
/**
 * Checks if `x` is an interval, `x` is an interval if it's an object which has
 * `x.lo` and `x.hi` defined and both are numbers
 *
 * @example
 * ```typescript
 * Interval.isInterval(
 *   Interval()
 * ) // true
 * Interval.isInterval(
 *   undefined
 * ) // false
 * Interval.isInterval(
 *   {lo: 1, hi: 2}
 * ) // true
 * ```
 *
 * @param  {*} x
 * @return {boolean} true if `x` is an interval
 */
function isInterval(x) {
    return typeof x === 'object' && typeof x.lo === 'number' && typeof x.hi === 'number';
}
/**
 * Checks if `x` is empty, it's empty when `x.lo > x.hi`
 *
 * @example
 * ```typescript
 * Interval.isEmpty(
 *   Interval.EMPTY
 * ) // true
 * Interval.isEmpty(
 *   Interval.WHOLE
 * ) // false
 * Interval.isEmpty(
 *   // bypass empty interval check
 *   Interval().set(1, -1)
 * ) // true
 * ```
 *
 * @param {Interval} i
 * @returns {boolean}
 */
function isEmpty(i) {
    return i.lo > i.hi;
}
/**
 * Checks if an interval is a whole interval, that is an interval which covers
 * all the real numbers i.e. when `x.lo === -Infinity` and `x.hi === Infinity`
 *
 * @example
 * ```typescript
 * Interval.isWhole(
 *   Interval.WHOLE
 * ) // true
 * ```
 *
 * @param {Interval} i
 * @returns {boolean}
 */
function isWhole(i) {
    return i.lo === -Infinity && i.hi === Infinity;
}
/**
 * Checks if the intervals `x` is a singleton (an interval representing a single
 * value) i.e. when `x.lo === x.hi`
 *
 * @example
 * ```typescript
 * Interval.isSingleton(
 *  Interval(2, 2)
 * ) // true
 * Interval.isSingleton(
 *  Interval(2)
 * ) // true
 * ```
 *
 * @param {Interval} i
 * @returns {boolean}
 */
function isSingleton(i) {
    return i.lo === i.hi;
}
/**
 * Checks if zero is included in the interval `x`
 *
 * @example
 * ```typescript
 * Interval.zeroIn(
 *   Interval(-1, 1)
 * ) // true
 * ```
 *
 * @param {Interval} i
 * @returns {boolean}
 */
function zeroIn(i) {
    return hasValue(i, 0);
}
/**
 * Checks if `value` is included in the interval `x`
 *
 * @example
 * ```typescript
 * Interval.hasValue(
 *   Interval(-1, 1),
 *   0
 * ) // true
 * Interval.hasValue(
 *   Interval(-1, 1),
 *   10
 * ) // false
 * ```
 *
 * @param {Interval} i
 * @param {number} value
 * @returns {boolean}
 */
function hasValue(i, value) {
    if (isEmpty(i)) {
        return false;
    }
    return i.lo <= value && value <= i.hi;
}
/**
 * Checks if `x` is a subset of `y`
 *
 * @example
 * ```typescript
 * Interval.hasInteravl(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * ) // true
 * Interval.hasInteravl(
 *   Interval(0, 3),
 *   Interval(1, 4)
 * ) // false
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
function hasInterval(x, y) {
    if (isEmpty(x)) {
        return true;
    }
    return !isEmpty(y) && y.lo <= x.lo && x.hi <= y.hi;
}
/**
 * Checks if the intervals `x`, `y` overlap i.e. if they share at least one value
 *
 * @example
 * ```typescript
 * Interval.intervalsOverlap(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * ) // true
 * Interval.intervalsOverlap(
 *   Interval(0, 2),
 *   Interval(1, 3)
 * ) // true
 * Interval.intervalsOverlap(
 *   Interval(0, 2),
 *   Interval(2, 3)
 * ) // true
 * Interval.intervalsOverlap(
 *   Interval(0, 1),
 *   Interval(2, 3)
 * ) // false
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
function intervalsOverlap(x, y) {
    if (isEmpty(x) || isEmpty(y)) {
        return false;
    }
    return (x.lo <= y.lo && y.lo <= x.hi) || (y.lo <= x.lo && x.lo <= y.hi);
}
//# sourceMappingURL=utils.js.map
// EXTERNAL MODULE: ./node_modules/nextafter/nextafter.js
var nextafter = __webpack_require__(3093);
var nextafter_default = /*#__PURE__*/__webpack_require__.n(nextafter);
;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/round.js

/**
 * @module interval-arithmetic/round-math
 */
function identity(v) {
    return v;
}
function prev(v) {
    if (v === Infinity) {
        return v;
    }
    return nextafter_default()(v, -Infinity);
}
function next(v) {
    if (v === -Infinity) {
        return v;
    }
    return nextafter_default()(v, Infinity);
}
function toInteger(x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
}
const cache = {
    prev: prev,
    next: next
};
/**
 * @alias module:interval-arithmetic/round-math
 */
const round = {
    /**
     * Computes the previous IEEE floating point representation of `v`
     * @example
     * Interval.round.safePrev(1)          // 0.9999999999999999
     * Interval.round.safePrev(3)          // 2.9999999999999996
     * Interval.round.safePrev(Infinity)   // Infinity
     * @param {number} v
     * @return {number}
     * @function
     */
    safePrev: prev,
    /**
     * Computes the next IEEE floating point representation of `v`
     * @example
     * Interval.round.safeNext(1)          // 1.0000000000000002
     * Interval.round.safeNext(3)          // 3.0000000000000004
     * Interval.round.safeNext(-Infinity)  // -Infinity
     * @param {number} v
     * @return {number}
     * @function
     */
    safeNext: next,
    prev(x) {
        return cache.prev(x);
    },
    next(x) {
        return cache.next(x);
    },
    // prettier-ignore
    addLo(x, y) { return round.prev(x + y); },
    // prettier-ignore
    addHi(x, y) { return round.next(x + y); },
    // prettier-ignore
    subLo(x, y) { return round.prev(x - y); },
    // prettier-ignore
    subHi(x, y) { return round.next(x - y); },
    // prettier-ignore
    mulLo(x, y) { return round.prev(x * y); },
    // prettier-ignore
    mulHi(x, y) { return round.next(x * y); },
    // prettier-ignore
    divLo(x, y) { return round.prev(x / y); },
    // prettier-ignore
    divHi(x, y) { return round.next(x / y); },
    // prettier-ignore
    intLo(x) { return toInteger(round.prev(x)); },
    // prettier-ignore
    intHi(x) { return toInteger(round.next(x)); },
    // prettier-ignore
    logLo(x) { return round.prev(Math.log(x)); },
    // prettier-ignore
    logHi(x) { return round.next(Math.log(x)); },
    // prettier-ignore
    expLo(x) { return round.prev(Math.exp(x)); },
    // prettier-ignore
    expHi(x) { return round.next(Math.exp(x)); },
    // prettier-ignore
    sinLo(x) { return round.prev(Math.sin(x)); },
    // prettier-ignore
    sinHi(x) { return round.next(Math.sin(x)); },
    // prettier-ignore
    cosLo(x) { return round.prev(Math.cos(x)); },
    // prettier-ignore
    cosHi(x) { return round.next(Math.cos(x)); },
    // prettier-ignore
    tanLo(x) { return round.prev(Math.tan(x)); },
    // prettier-ignore
    tanHi(x) { return round.next(Math.tan(x)); },
    // prettier-ignore
    asinLo(x) { return round.prev(Math.asin(x)); },
    // prettier-ignore
    asinHi(x) { return round.next(Math.asin(x)); },
    // prettier-ignore
    acosLo(x) { return round.prev(Math.acos(x)); },
    // prettier-ignore
    acosHi(x) { return round.next(Math.acos(x)); },
    // prettier-ignore
    atanLo(x) { return round.prev(Math.atan(x)); },
    // prettier-ignore
    atanHi(x) { return round.next(Math.atan(x)); },
    // polyfill required for hyperbolic functions
    // prettier-ignore
    sinhLo(x) { return round.prev(Math.sinh(x)); },
    // prettier-ignore
    sinhHi(x) { return round.next(Math.sinh(x)); },
    // prettier-ignore
    coshLo(x) { return round.prev(Math.cosh(x)); },
    // prettier-ignore
    coshHi(x) { return round.next(Math.cosh(x)); },
    // prettier-ignore
    tanhLo(x) { return round.prev(Math.tanh(x)); },
    // prettier-ignore
    tanhHi(x) { return round.next(Math.tanh(x)); },
    /**
     * @ignore
     * ln(power) exponentiation of x
     * @param {number} x
     * @param {number} power
     * @returns {number}
     */
    powLo(x, power) {
        if (power % 1 !== 0) {
            // power has decimals
            return round.prev(Math.pow(x, power));
        }
        let y = (power & 1) === 1 ? x : 1;
        power >>= 1;
        while (power > 0) {
            x = round.mulLo(x, x);
            if ((power & 1) === 1) {
                y = round.mulLo(x, y);
            }
            power >>= 1;
        }
        return y;
    },
    /**
     * @ignore
     * ln(power) exponentiation of x
     * @param {number} x
     * @param {number} power
     * @returns {number}
     */
    powHi(x, power) {
        if (power % 1 !== 0) {
            // power has decimals
            return round.next(Math.pow(x, power));
        }
        let y = (power & 1) === 1 ? x : 1;
        power >>= 1;
        while (power > 0) {
            x = round.mulHi(x, x);
            if ((power & 1) === 1) {
                y = round.mulHi(x, y);
            }
            power >>= 1;
        }
        return y;
    },
    // prettier-ignore
    sqrtLo(x) { return round.prev(Math.sqrt(x)); },
    // prettier-ignore
    sqrtHi(x) { return round.next(Math.sqrt(x)); },
    /**
     * Most operations on intervals will cary the rounding error so that the
     * resulting interval correctly represents all the possible values, this feature
     * can be disabled by calling this method allowing a little boost in the
     * performance while operating on intervals
     *
     * @see module:interval-arithmetic/round-math.enable
     * @example
     * var x = Interval.add(
     *   Interval(1),
     *   Interval(1)
     * )
     * x // equal to {lo: 1.9999999999999998, hi: 2.0000000000000004}
     *
     * Interval.round.disable()
     * var y = Interval.add(
     *   Interval(1),
     *   Interval(1)
     * )
     * y // equal to {lo: 2, hi: 2}
     * @function
     */
    disable() {
        cache.next = cache.prev = identity;
    },
    /**
     * Enables IEEE previous/next floating point wrapping of values (enabled by
     * default)
     * @see module:interval-arithmetic/round-math.disable
     * @example
     * var x = Interval.add(
     *   Interval(1),
     *   Interval(1)
     * )
     * x // equal to {lo: 1.9999999999999998, hi: 2.0000000000000004}
     *
     * Interval.round.disable()
     * var y = Interval.add(
     *   Interval(1),
     *   Interval(1)
     * )
     * y // equal to {lo: 2, hi: 2}
     *
     * Interval.round.enable()
     * var z = Interval.add(
     *   Interval(1),
     *   Interval(1)
     * )
     * z // equal to {lo: 1.9999999999999998, hi: 2.0000000000000004}
     * @function
     */
    enable() {
        cache.next = next;
        cache.prev = prev;
    }
};
/* harmony default export */ const lib_esm_round = (round);
//# sourceMappingURL=round.js.map
;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/interval.js


/**
 * Constructor for closed intervals representing all the values inside (and
 * including) `lo` and `hi` e.g. `[lo, hi]`
 *
 * NOTE: If `lo > hi` then the constructor will return an empty interval
 *
 * @mixes arithmetic
 * @mixes algebra
 * @mixes misc
 * @mixes relational
 * @mixes trigonometric
 * @mixes utils
 * @mixes constants
 *
 * @link #bounded
 * @link #boundedSingleton
 *
 * @example
 * ```typescript
 * new Interval(1, 2)  // {lo: 1, hi: 2}
 * // function invocation without new is also supported
 * Interval(1, 2)   // {lo: 1, hi: 2}
 * // with numbers
 * Interval(1, 2)   // {lo: 1, hi: 2}
 * Interval(1)      // {lo: 1, hi: 1}
 * // with an array
 * Interval([1, 2]) // {lo: 1, hi: 2}
 * // singleton intervals
 * var x = Interval(1)
 * var y = Interval(2)
 * Interval(x, y)   // {lo: 1, hi: 2}
 * // when `lo > hi` it returns an empty interval
 * Interval(2, 1)   // {lo: Infinity, hi: -Infinity}
 * // bounded interval
 * Interval().bounded(1, 2)  // { lo: 0.9999999999999999, hi: 2.0000000000000004 }
 * // singleton bounded interval
 * Interval().boundedSingleton(2)  // {lo: 1.9999999999999998, hi: 2.0000000000000004}
 * // half open and open intervals
 * // [2, 3]
 * Interval(2, 3)                     // {lo: 2, hi: 3}
 * // (2, 3]
 * Interval().halfOpenLeft(2, 3)      // {lo: 2.0000000000000004, hi: 3}
 * // [2, 3)
 * Interval().halfOpenRight(2, 3)     // {lo: 2, hi: 2.9999999999999996}
 * // (2, 3)
 * Interval().open(2, 3)              // {lo: 2.0000000000000004, hi: 2.9999999999999996}
 * ```
 *
 * @param {number|array|Interval} lo The left endpoint of the interval if it's a
 * number or a singleton interval, if it's an array then an interval will be
 * built out of the elements of the array
 * @param {number|Interval} [hi] The right endpoint of the interval if it's a
 * number or a singleton interval, if omitted then a singleton interval will be
 * built out of `lo`
 */
class _Interval {
    constructor(lo, hi) {
        /**
         * The left endpoint of the interval
         * @type {number}
         */
        this.lo = 0;
        /**
         * The right endpoint of the interval
         * @type {number}
         */
        this.hi = 0;
        if (!(this instanceof _Interval)) {
            console.log('calling with new');
            console.log(lo, hi);
            return new _Interval(lo, hi);
        }
        if (typeof lo !== 'undefined' && typeof hi !== 'undefined') {
            // possible cases:
            // - Interval(1, 2)
            // - Interval(Interval(1, 1), Interval(2, 2))     // singletons are required
            if (isInterval(lo)) {
                if (!isSingleton(lo)) {
                    throw new TypeError('Interval: interval `lo` must be a singleton');
                }
                lo = lo.lo;
            }
            if (isInterval(hi)) {
                if (!isSingleton(hi)) {
                    throw TypeError('Interval: interval `hi` must be a singleton');
                }
                hi = hi.hi;
            }
        }
        else if (typeof lo !== 'undefined') {
            // possible cases:
            // - Interval([1, 2])
            // - Interval([Interval(1, 1), Interval(2, 2)])
            if (Array.isArray(lo)) {
                return new Interval(lo[0], lo[1]);
            }
            // - Interval(1)
            return new Interval(lo, lo);
        }
        else {
            // possible cases:
            // - Interval()
            lo = hi = 0;
        }
        this.assign(lo, hi);
    }
    /**
     * Sets `this.lo` and `this.hi` to a single value `v`
     *
     * @param {number} v
     * @return {Interval} The calling interval i.e. `this`
     */
    singleton(v) {
        return this.set(v, v);
    }
    /**
     * Sets new endpoints to this interval, the left endpoint is equal to the
     * previous IEEE floating point value of `lo` and the right endpoint
     * is equal to the next IEEE floating point
     * value of `hi`, it's assumed that `lo <= hi`
     *
     * @example
     * ```typescript
     * const x = Interval().bounded(1, 2)
     * x.lo < 1 // true, x.lo === 0.9999999999999999
     * x.hi > 2 // true, x.hi === 2.0000000000000004
     * ```
     *
     * @example
     * ```typescript
     * // the correct representation of 1/3
     * var x = Interval().bounded(1/3, 1/3)
     * x.lo < 1/3 // true
     * x.hi > 1/3 // true
     * // however the floating point representation of 1/3 is less than the real 1/3
     * // therefore the left endpoint could be 1/3 instead of the previous value of
     * var next = Interval.round.safeNext
     * var x = Interval().set(1/3, next(1/3))
     * // x now represents 1/3 correctly
     * ```
     *
     * @param {number} lo
     * @param {number} hi
     * @return {Interval} The calling interval i.e. `this`
     */
    bounded(lo, hi) {
        return this.set(lib_esm_round.prev(lo), lib_esm_round.next(hi));
    }
    /**
     * Equivalent to `Interval().bounded(v, v)`
     * @param {number} v
     * @return {Interval} The calling interval i.e. `this`
     */
    boundedSingleton(v) {
        return this.bounded(v, v);
    }
    /**
     * Sets new endpoints for this interval, this method bypasses any
     * checks on the type of arguments
     *
     * @param {Number} lo The left endpoint of the interval
     * @param {Number} hi The right endpoint of the interval
     * @return {Interval} The calling interval
     */
    set(lo, hi) {
        this.lo = lo;
        this.hi = hi;
        return this;
    }
    /**
     * Sets new endpoints for this interval checking that both arguments exist
     * and that are valid numbers, additionally if `lo > hi` the interval is set to
     * an empty interval
     *
     * @param {Number} lo The left endpoint of the interval
     * @param {Number} hi The right endpoint of the interval
     * @return {Interval} The calling interval
     */
    assign(lo, hi) {
        if (typeof lo !== 'number' || typeof hi !== 'number') {
            throw TypeError('Interval#assign: arguments must be numbers');
        }
        if (isNaN(lo) || isNaN(hi) || lo > hi) {
            return this.setEmpty();
        }
        return this.set(lo, hi);
    }
    /**
     * Sets the endpoints of this interval to `[∞, -∞]` effectively representing
     * no values
     * @return {Interval} The calling interval
     */
    setEmpty() {
        return this.set(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY);
    }
    /**
     * Sets the endpoints of this interval to `[-∞, ∞]` effectively representing all
     * the possible real values
     * @return {Interval} The calling interval
     */
    setWhole() {
        return this.set(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    }
    /**
     * Sets the endpoints of this interval to the open interval `(lo, hi)`
     *
     * NOTE: `Interval.round.disable` has no effect on this method
     *
     * @example
     * ```typescript
     * // (2, 3)
     * Interval().open(2, 3)  // {lo: 2.0000000000000004, hi: 2.9999999999999996}
     * ```
     *
     * @param {number} lo
     * @param {number} hi
     * @return {Interval} The calling interval
     */
    open(lo, hi) {
        return this.assign(lib_esm_round.safeNext(lo), lib_esm_round.safePrev(hi));
    }
    /**
     * Sets the endpoints of this interval to the half open interval `(lo, hi]`
     *
     * NOTE: `Interval.round.disable` has no effect on this method
     *
     * @example
     * ```typescript
     * // (2, 3]
     * Interval().halfOpenLeft(2, 3)  // {lo: 2.0000000000000004, hi: 3}
     * ```
     *
     * @param {number} lo
     * @param {number} hi
     * @return {Interval} The calling interval
     */
    halfOpenLeft(lo, hi) {
        return this.assign(lib_esm_round.safeNext(lo), hi);
    }
    /**
     * Sets the endpoints of this interval to the half open interval `[lo, hi)`
     *
     * NOTE: `Interval.round.disable` has no effect on this method
     *
     * @example
     * ```typescript
     * // [2, 3)
     * Interval.halfOpenRight(2, 3)     // {lo: 2, hi: 2.9999999999999996}
     * ```
     *
     * @param {number} lo
     * @param {number} hi
     * @return {Interval} The calling interval
     */
    halfOpenRight(lo, hi) {
        return this.assign(lo, lib_esm_round.safePrev(hi));
    }
    /**
     * Array representation of this interval
     * @return {array}
     */
    toArray() {
        return [this.lo, this.hi];
    }
    /**
     * Creates an interval equal to the calling one
     * @see Interval.clone
     * @name Interval.prototype
     * @example
     * ```typescript
     * var x = Interval(2, 3)
     * x.clone()    // Interval(2, 3)
     * ```
     * @return {Interval}
     */
    clone() {
        return new Interval().set(this.lo, this.hi);
    }
}
// @ts-ignore
function bindNew(Class) {
    function _Class() {
        for (var len = arguments.length, rest = Array(len), key = 0; key < len; key++) {
            rest[key] = arguments[key];
        }
        // @ts-ignore
        return new (Function.prototype.bind.apply(Class, [null].concat(rest)))();
    }
    _Class.prototype = Class.prototype;
    return _Class;
}
const Interval = bindNew(_Interval);
// @ts-ignore
Interval.factory = Interval;

//# sourceMappingURL=interval.js.map
;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/constants.js


const piLow = (3373259426.0 + 273688.0 / (1 << 21)) / (1 << 30);
const piHigh = (3373259426.0 + 273689.0 / (1 << 21)) / (1 << 30);
/**
 * @mixin constants
 */
const constants = {
    /**
     * Previous IEEE floating point value of PI (equal to Math.PI)
     * 3.141592653589793
     * @memberof constants
     * @type {number}
     */
    PI_LOW: piLow,
    /**
     * Next IEEE floating point value of PI, 3.1415926535897936
     * @memberof constants
     * @type {number}
     */
    PI_HIGH: piHigh,
    PI_HALF_LOW: piLow / 2,
    PI_HALF_HIGH: piHigh / 2,
    PI_TWICE_LOW: piLow * 2,
    PI_TWICE_HIGH: piHigh * 2,
    /**
     * An interval that represents PI, NOTE: calls to Interval.PI always return
     * a new interval representing PI
     * @memberof constants
     * @static
     * @example
     * ```typescript
     * Interval.E
     * ```
     * @name E
     * @type {Interval}
     */
    get E() {
        return new Interval(lib_esm_round.prev(Math.E), lib_esm_round.next(Math.E));
    },
    /**
     * An interval that represents Euler's constant e, NOTE: calls to Interval.E always return
     * a new interval representing PI
     * @memberof constants
     * @static
     * @example
     * ```typescript
     * Interval(Interval.PI_LOW, Interval.PI_HIGH)
     * ```
     * @name PI
     * @type {Interval}
     */
    get PI() {
        return new Interval(piLow, piHigh);
    },
    /**
     * An interval that represents `PI / 2`, NOTE: calls to `Interval.PI_HALF` always
     * return a new interval representing `PI / 2`
     * @memberof constants
     * @static
     * @example
     * ```typescript
     * Interval(Interval.PI_LOW / 2, Interval.PI_HIGH / 2)
     * ```
     * @name PI_HALF
     * @type {Interval}
     */
    get PI_HALF() {
        return new Interval(constants.PI_HALF_LOW, constants.PI_HALF_HIGH);
    },
    /**
     * An interval that represents `PI * 2` NOTE: calls to `Interval.PI_TWICE` always
     * return a new interval representing `PI * 2`
     * @memberof constants
     * @static
     * @example
     * ```typescript
     * Interval(Interval.PI_LOW * 2, Interval.PI_HIGH * 2)
     * ```
     * @name PI_TWICE
     * @type {Interval}
     */
    get PI_TWICE() {
        return new Interval(constants.PI_TWICE_LOW, constants.PI_TWICE_HIGH);
    },
    /**
     * An interval that represents 0, NOTE: calls to `Interval.ZERO` always return a new interval representing 0
     * @memberof constants
     * @static
     * @example
     * ```typescript
     * // Interval.ZERO is equivalent to
     * Interval(0)
     * ```
     * @name ZERO
     * @type {Interval}
     */
    get ZERO() {
        return new Interval(0);
    },
    /**
     * An interval that represents 1, NOTE: calls to Interval.ONE always
     * return a new interval representing 1
     * @memberof constants
     * @static
     * @example
     * // Interval.ONE is equivalent to
     * Interval(1)
     * @name ONE
     * @type {Interval}
     */
    get ONE() {
        return new Interval(1);
    },
    /**
     * An interval that represents all the real values
     * NOTE: calls to Interval.WHOLE always return a new interval representing all the real values
     * @memberof constants
     * @static
     * @example
     * ```typescript
     * // Interval.WHOLE is equivalent to
     * Interval().setWhole()
     * ```
     * @name WHOLE
     * @type {Interval}
     */
    get WHOLE() {
        return new Interval().setWhole();
    },
    /**
     * An interval that represents no values
     * NOTE: calls to Interval.EMPTY always return a new interval representing no values
     * @memberof constants
     * @static
     * @example
     * ```typescript
     * // Interval.EMPTY is equivalent to
     * Interval().setEmpty()
     * ```
     * @name EMPTY
     * @type {Interval}
     */
    get EMPTY() {
        return new Interval().setEmpty();
    }
};
/* harmony default export */ const lib_esm_constants = (constants);
//# sourceMappingURL=constants.js.map
;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/operations/relational.js

// boost/numeric/interval_lib/compare/certain package on boost
/**
 * @mixin relational
 */
/**
 * Checks if the intervals `x`, `y` are equal, they're equal when
 * `x.lo === y.lo` and `x.hi === y.hi`, a corner case handled is when `x` and
 * `y` are both empty intervals
 *
 * @example
 * ```typescript
 * Interval.equal(
 *   Interval(2, 3),
 *   Interval(2, 3)
 * ) // true
 * ```
 *
 * @example
 * ```typescript
 * Interval.equal(
 *   Interval.EMPTY,
 *   Interval.EMPTY
 * ) // true
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
function equal(x, y) {
    if (isEmpty(x)) {
        return isEmpty(y);
    }
    return !isEmpty(y) && x.lo === y.lo && x.hi === y.hi;
}
// <debug>
const EPS = 1e-7;
function assert(a, message) {
    /* istanbul ignore next */
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!a) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        throw new Error(message || 'assertion failed');
    }
}
function assertEps(a, b) {
    if (!isFinite(a)) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        return assert(a === b, `[Infinity] expected ${a} to be ${b}`);
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    assert(Math.abs(a - b) < EPS, `expected ${a} to be close to ${b}`);
}
function almostEqual(x, y) {
    x = Array.isArray(x) ? x : x.toArray();
    y = Array.isArray(y) ? y : y.toArray();
    assertEps(x[0], y[0]);
    assertEps(x[1], y[1]);
}
function assertIncludes(x, y) {
    // checks that `y` is included in `x` with the bounds close to `x`
    almostEqual(x, y);
    x = Array.isArray(x) ? x : x.toArray();
    y = Array.isArray(y) ? y : y.toArray();
    assert(x[0] <= y[0], `${x[0]} should be less/equal than ${y[0]}`);
    assert(y[1] <= x[1], `${y[1]} should be less/equal than ${x[1]}`);
}
// </debug>
/**
 * Checks if the intervals `x`, `y` are not equal i.e. when the intervals don't
 * share any value
 *
 * @example
 * ```typescript
 * Interval.notEqual(
 *   Interval(2, 3),
 *   Interval(4, 5)
 * ) // true
 * ```
 *
 * @example
 * ```typescript
 * Interval.notEqual(
 *   Interval(2, 3),
 *   Interval(3, 5)
 * ) // false
 * ```
 *
 * @example
 * ```typescript
 * Interval.notEqual(
 *   Interval(2, 4),
 *   Interval(3, 5)
 * ) // false
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @returns {boolean}
 */
function notEqual(x, y) {
    if (isEmpty(x)) {
        return !isEmpty(y);
    }
    return isEmpty(y) || x.hi < y.lo || x.lo > y.hi;
}
/**
 * Checks if the interval `x` is less than `y` i.e. if all the values of `x`
 * are lower than the left endpoint of `y`
 *
 * @example
 * ```typescript
 * Interval.lessThan(
 *   Interval(2, 3),
 *   Interval(4, 5)
 * ) // true
 * ```
 *
 * @example
 * ```typescript
 * Interval.lessThan(
 *   Interval(4, 5),
 *   Interval(2, 3)
 * ) // false
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
function lessThan(x, y) {
    if (isEmpty(x) || isEmpty(y)) {
        return false;
    }
    return x.hi < y.lo;
}
/**
 * Alias for {@link lessThan}
 * @function
 */
const lt = lessThan;
/**
 * Checks if the interval `x` is greater than `y` i.e. if all the values of `x`
 * are greater than the right endpoint of `y`
 *
 * @example
 * ```typescript
 * Interval.greaterThan(
 *   Interval(2, 3),
 *   Interval(4, 5)
 * ) // false
 * ```
 *
 * @example
 * ```typescript
 * Interval.greaterThan(
 *   Interval(4, 5),
 *   Interval(2, 3)
 * ) // true
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
function greaterThan(x, y) {
    if (isEmpty(x) || isEmpty(y)) {
        return false;
    }
    return x.lo > y.hi;
}
/**
 * Alias for {@link greaterThan}
 * @function
 */
const gt = greaterThan;
/**
 * Checks if the interval `x` is less or equal than `y` i.e.
 * if all the values of `x` are lower or equal to the left endpoint of `y`
 *
 * @example
 * ```typescript
 * Interval.lessEqualThan(
 *   Interval(2, 3),
 *   Interval(3, 5)
 * ) // true
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
function lessEqualThan(x, y) {
    if (isEmpty(x) || isEmpty(y)) {
        return false;
    }
    return x.hi <= y.lo;
}
/**
 * Alias for {@link lessEqualThan}
 * @function
 */
const leq = lessEqualThan;
/**
 * Checks if the interval `x` is greater or equal than `y` i.e.
 * if all the values of `x` are greater or equal to the right endpoint of `y`
 * @param {Interval} x
 * @param {Interval} y
 * @return {boolean}
 */
function greaterEqualThan(x, y) {
    if (isEmpty(x) || isEmpty(y)) {
        return false;
    }
    return x.lo >= y.hi;
}
/**
 * Alias for {@link greaterEqualThan}
 * @function
 */
const geq = greaterEqualThan;
//# sourceMappingURL=relational.js.map
;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/operations/division.js




/**
 * Division between intervals when `y` doesn't contain zero
 * @param {Interval} x
 * @param {Interval} y
 * @returns {Interval}
 */
function nonZero(x, y) {
    const xl = x.lo;
    const xh = x.hi;
    const yl = y.lo;
    const yh = y.hi;
    const out = new Interval();
    if (xh < 0) {
        if (yh < 0) {
            out.lo = lib_esm_round.divLo(xh, yl);
            out.hi = lib_esm_round.divHi(xl, yh);
        }
        else {
            out.lo = lib_esm_round.divLo(xl, yl);
            out.hi = lib_esm_round.divHi(xh, yh);
        }
    }
    else if (xl < 0) {
        if (yh < 0) {
            out.lo = lib_esm_round.divLo(xh, yh);
            out.hi = lib_esm_round.divHi(xl, yh);
        }
        else {
            out.lo = lib_esm_round.divLo(xl, yl);
            out.hi = lib_esm_round.divHi(xh, yl);
        }
    }
    else {
        if (yh < 0) {
            out.lo = lib_esm_round.divLo(xh, yh);
            out.hi = lib_esm_round.divHi(xl, yl);
        }
        else {
            out.lo = lib_esm_round.divLo(xl, yh);
            out.hi = lib_esm_round.divHi(xh, yl);
        }
    }
    return out;
}
/**
 * Division between an interval and a positive constant
 * @param {Interval} x
 * @param {number} v
 * @returns {Interval}
 */
function positive(x, v) {
    if (x.lo === 0 && x.hi === 0) {
        return x;
    }
    if (zeroIn(x)) {
        // mixed considering zero in both ends
        return lib_esm_constants.WHOLE;
    }
    if (x.hi < 0) {
        // negative / v
        return new Interval(Number.NEGATIVE_INFINITY, lib_esm_round.divHi(x.hi, v));
    }
    else {
        // positive / v
        return new Interval(lib_esm_round.divLo(x.lo, v), Number.POSITIVE_INFINITY);
    }
}
/**
 * Division between an interval and a negative constant
 * @param {Interval} x
 * @param {number} v
 * @returns {Interval}
 */
function negative(x, v) {
    if (x.lo === 0 && x.hi === 0) {
        return x;
    }
    if (zeroIn(x)) {
        // mixed considering zero in both ends
        return lib_esm_constants.WHOLE;
    }
    if (x.hi < 0) {
        // negative / v
        return new Interval(lib_esm_round.divLo(x.hi, v), Number.POSITIVE_INFINITY);
    }
    else {
        // positive / v
        return new Interval(Number.NEGATIVE_INFINITY, lib_esm_round.divHi(x.lo, v));
    }
}
/**
 * Division between an interval and zero
 * @param {Interval} x
 * @returns {Interval}
 */
function zero(x) {
    if (x.lo === 0 && x.hi === 0) {
        return x;
    }
    return lib_esm_constants.WHOLE;
}
//# sourceMappingURL=division.js.map
;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/operations/arithmetic.js





/**
 * @mixin arithmetic
 */
/**
 * Adds two intervals
 *
 * @example
 * ```typescript
 * Interval.add(
 *   Interval(0, 1),
 *   Interval(1, 2),
 * )   // Interval(prev(1), next(3))
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function add(x, y) {
    return new Interval(lib_esm_round.addLo(x.lo, y.lo), lib_esm_round.addHi(x.hi, y.hi));
}
/**
 * Subtracts two intervals
 *
 * @example
 * ```typescript
 * Interval.subtract(
 *   Interval(0, 1),
 *   Interval(1, 2),
 * )   // Interval(prev(-2), next(0))
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function subtract(x, y) {
    return new Interval(lib_esm_round.subLo(x.lo, y.hi), lib_esm_round.subHi(x.hi, y.lo));
}
/**
 * Alias for {@link subtract}
 * @function
 */
const sub = subtract;
/**
 * Multiplies two intervals, an explanation of all the possible cases ca
 * be found on [Interval Arithmetic: from Principles to Implementation - T. Hickey, Q. Ju, M.H. van Emden](http://fab.cba.mit.edu/classes/S62.12/docs/Hickey_interval.pdf)
 *
 * @example
 * ```typescript
 * Interval.multiply(
 *  Interval(1, 2),
 *  Interval(2, 3)
 * ) // Interval(prev(2), next(6))
 * ```
 *
 * @example
 * ```typescript
 * Interval.multiply(
 *  Interval(1, Infinity),
 *  Interval(4, 6)
 * ) // Interval(prev(4), Infinity)
 * ```
 *
 * @example
 * ```typescript
 * Interval.multiply(
 *  Interval(1, 2),
 *  Interval(-3, -2)
 * ) // Interval(prev(-6), next(-2))
 * ```
 *
 * @example
 * ```typescript
 * Interval.multiply(
 *  Interval(1, 2),
 *  Interval(-2, 3)
 * ) // Interval(prev(-4), next(6))
 * ```
 *
 * @example
 * ```typescript
 * Interval.multiply(
 *  Interval(-2, -1),
 *  Interval(-3, -2)
 * ) // Interval(prev(2), next(6))
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function multiply(x, y) {
    if (isEmpty(x) || isEmpty(y)) {
        return lib_esm_constants.EMPTY;
    }
    const xl = x.lo;
    const xh = x.hi;
    const yl = y.lo;
    const yh = y.hi;
    const out = new Interval();
    if (xl < 0) {
        if (xh > 0) {
            if (yl < 0) {
                if (yh > 0) {
                    // mixed * mixed
                    out.lo = Math.min(lib_esm_round.mulLo(xl, yh), lib_esm_round.mulLo(xh, yl));
                    out.hi = Math.max(lib_esm_round.mulHi(xl, yl), lib_esm_round.mulHi(xh, yh));
                }
                else {
                    // mixed * negative
                    out.lo = lib_esm_round.mulLo(xh, yl);
                    out.hi = lib_esm_round.mulHi(xl, yl);
                }
            }
            else {
                if (yh > 0) {
                    // mixed * positive
                    out.lo = lib_esm_round.mulLo(xl, yh);
                    out.hi = lib_esm_round.mulHi(xh, yh);
                }
                else {
                    // mixed * zero
                    out.lo = 0;
                    out.hi = 0;
                }
            }
        }
        else {
            if (yl < 0) {
                if (yh > 0) {
                    // negative * mixed
                    out.lo = lib_esm_round.mulLo(xl, yh);
                    out.hi = lib_esm_round.mulHi(xl, yl);
                }
                else {
                    // negative * negative
                    out.lo = lib_esm_round.mulLo(xh, yh);
                    out.hi = lib_esm_round.mulHi(xl, yl);
                }
            }
            else {
                if (yh > 0) {
                    // negative * positive
                    out.lo = lib_esm_round.mulLo(xl, yh);
                    out.hi = lib_esm_round.mulHi(xh, yl);
                }
                else {
                    // negative * zero
                    out.lo = 0;
                    out.hi = 0;
                }
            }
        }
    }
    else {
        if (xh > 0) {
            if (yl < 0) {
                if (yh > 0) {
                    // positive * mixed
                    out.lo = lib_esm_round.mulLo(xh, yl);
                    out.hi = lib_esm_round.mulHi(xh, yh);
                }
                else {
                    // positive * negative
                    out.lo = lib_esm_round.mulLo(xh, yl);
                    out.hi = lib_esm_round.mulHi(xl, yh);
                }
            }
            else {
                if (yh > 0) {
                    // positive * positive
                    out.lo = lib_esm_round.mulLo(xl, yl);
                    out.hi = lib_esm_round.mulHi(xh, yh);
                }
                else {
                    // positive * zero
                    out.lo = 0;
                    out.hi = 0;
                }
            }
        }
        else {
            // zero * any other value
            out.lo = 0;
            out.hi = 0;
        }
    }
    return out;
}
/**
 * Alias for {@link multiply}
 * @function
 */
const mul = multiply;
/**
 * Computes x/y, an explanation of all the possible cases ca
 * be found on [Interval Arithmetic: from Principles to Implementation - T. Hickey, Q. Ju, M.H. van Emden](http://fab.cba.mit.edu/classes/S62.12/docs/Hickey_interval.pdf)
 *
 * NOTE: an extreme case of division might results in multiple
 * intervals, unfortunately this library doesn't support multi-interval
 * arithmetic yet so a single interval will be returned instead with
 * the {@link hull} of the resulting intervals (this is the way
 * Boost implements it too)
 *
 * @example
 * ```typescript
 * Interval.divide(
 *   Interval(1, 2),
 *   Interval(3, 4)
 * ) // Interval(prev(1/4), next(2/3))
 * ```
 *
 * @example
 * ```typescript
 * Interval.divide(
 *   Interval(-2, 1),
 *   Interval(-4, -3)
 * ) // Interval(prev(-1/3), next(2/3))
 * ```
 *
 * @example
 * ```typescript
 * Interval.divide(
 *   Interval(1, 2),
 *   Interval(-1, 1)
 * ) // Interval(-Infinity, Infinity)
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function divide(x, y) {
    if (isEmpty(x) || isEmpty(y)) {
        return lib_esm_constants.EMPTY;
    }
    if (zeroIn(y)) {
        if (y.lo !== 0) {
            if (y.hi !== 0) {
                return zero(x);
            }
            else {
                return negative(x, y.lo);
            }
        }
        else {
            if (y.hi !== 0) {
                return positive(x, y.hi);
            }
            else {
                return lib_esm_constants.EMPTY;
            }
        }
    }
    else {
        return nonZero(x, y);
    }
}
/**
 * Alias for {@link divide}
 * @function
 */
const div = divide;
/**
 * Computes +x (identity function)
 * @link clone
 *
 * @example
 * ```typescript
 * Interval.positive(
 *  Interval(1, 2)
 * )  // Interval(1, 2)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function arithmetic_positive(x) {
    return new Interval(x.lo, x.hi);
}
/**
 * Computes -x
 *
 * @example
 * ```typescript
 * Interval.negative(
 *   Interval(1, 2)
 * )  // Interval(-2, -1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.negative(
 *   Interval(-Infinity, Infinity)
 * )  // Interval(-Infinity, Infinity)
 * ```
 *
 * @example
 * ```typescript
 * Interval.negative(
 *   Interval.WHOLE
 * )  // Interval.WHOLE
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function arithmetic_negative(x) {
    return new Interval(-x.hi, -x.lo);
}
//# sourceMappingURL=arithmetic.js.map
;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/operations/algebra.js





/**
 * @mixin algebra
 */
/**
 * Computes `x mod y (x - k * y)`
 *
 * @example
 * ```typescript
 * Interval.fmod(
 *   Interval(5.3, 5.3),
 *   Interval(2, 2)
 * ) // Interval(1.3, 1.3)
 * Interval.fmod(
 *   Interval(5, 7),
 *   Interval(2, 3)
 * ) // Interval(2, 5)
 * // explanation: [5, 7] - [2, 3] * 1 = [2, 5]
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function fmod(x, y) {
    if (isEmpty(x) || isEmpty(y)) {
        return lib_esm_constants.EMPTY;
    }
    const yb = x.lo < 0 ? y.lo : y.hi;
    let n = x.lo / yb;
    if (n < 0)
        n = Math.ceil(n);
    else
        n = Math.floor(n);
    // x mod y = x - n * y
    return sub(x, mul(y, new Interval(n)));
}
/**
 * Computes `1 / x`
 *
 * @example
 * ```typescript
 * Interval.multiplicativeInverse(
 *   Interval(2, 6)
 * )  // Interval(1/6, 1/2)
 * Interval.multiplicativeInverse(
 *   Interval(-6, -2)
 * )  // Interval(-1/2, -1/6)
 * ```
 *
 * @param {Interval} x
 * @returns {Interval}
 */
function multiplicativeInverse(x) {
    if (isEmpty(x)) {
        return lib_esm_constants.EMPTY;
    }
    if (zeroIn(x)) {
        if (x.lo !== 0) {
            if (x.hi !== 0) {
                // [negative, positive]
                return lib_esm_constants.WHOLE;
            }
            else {
                // [negative, zero]
                return new Interval(Number.NEGATIVE_INFINITY, lib_esm_round.divHi(1, x.lo));
            }
        }
        else {
            if (x.hi !== 0) {
                // [zero, positive]
                return new Interval(lib_esm_round.divLo(1, x.hi), Number.POSITIVE_INFINITY);
            }
            else {
                // [zero, zero]
                return lib_esm_constants.EMPTY;
            }
        }
    }
    else {
        // [positive, positive]
        return new Interval(lib_esm_round.divLo(1, x.hi), lib_esm_round.divHi(1, x.lo));
    }
}
/**
 * Computes `x^power` given that `power` is an integer
 *
 * If `power` is an Interval it must be a singletonInterval i.e. `x^x` is not
 * supported yet
 *
 * If `power` is a rational number use {@link nthRoot} instead
 *
 * @example
 * ```typescript
 * // 2^{-2}
 * Interval.pow(
 *   Interval(2, 2),
 *   -2
 * )  // Interval(1/4, 1/4)
 * // [2,3]^2
 * Interval.pow(
 *   Interval(2, 3),
 *   2
 * )  // Interval(4, 9)
 * // [2,3]^0
 * Interval.pow(
 *   Interval(2, 3),
 *   0
 * )  // Interval(1, 1)
 * // with a singleton interval
 * Interval.pow(
 *   Interval(2, 3),
 *   Interval(2)
 * )  // Interval(4, 9)
 * ```
 *
 * @param {Interval} x
 * @param {number|Interval} power A number of a singleton interval
 * @returns {Interval}
 */
function pow(x, power) {
    if (isEmpty(x)) {
        return lib_esm_constants.EMPTY;
    }
    if (typeof power === 'object') {
        if (!isSingleton(power)) {
            return lib_esm_constants.EMPTY;
        }
        power = power.lo;
    }
    if (power === 0) {
        if (x.lo === 0 && x.hi === 0) {
            // 0^0
            return lib_esm_constants.EMPTY;
        }
        else {
            // x^0
            return lib_esm_constants.ONE;
        }
    }
    else if (power < 0) {
        // compute [1 / x]^-power if power is negative
        return pow(multiplicativeInverse(x), -power);
    }
    // power > 0
    if (Number.isSafeInteger(power)) {
        // power is integer
        if (x.hi < 0) {
            // [negative, negative]
            // assume that power is even so the operation will yield a positive interval
            // if not then just switch the sign and order of the interval bounds
            const yl = lib_esm_round.powLo(-x.hi, power);
            const yh = lib_esm_round.powHi(-x.lo, power);
            if ((power & 1) === 1) {
                // odd power
                return new Interval(-yh, -yl);
            }
            else {
                // even power
                return new Interval(yl, yh);
            }
        }
        else if (x.lo < 0) {
            // [negative, positive]
            if ((power & 1) === 1) {
                return new Interval(-lib_esm_round.powLo(-x.lo, power), lib_esm_round.powHi(x.hi, power));
            }
            else {
                // even power means that any negative number will be zero (min value = 0)
                // and the max value will be the max of x.lo^power, x.hi^power
                return new Interval(0, lib_esm_round.powHi(Math.max(-x.lo, x.hi), power));
            }
        }
        else {
            // [positive, positive]
            return new Interval(lib_esm_round.powLo(x.lo, power), lib_esm_round.powHi(x.hi, power));
        }
    }
    else {
        console.warn('power is not an integer, you should use nth-root instead, returning an empty interval');
        return lib_esm_constants.EMPTY;
    }
}
/**
 * Computes `sqrt(x)`, alias for `nthRoot(x, 2)`
 *
 * @example
 * ```typescript
 * Interval.sqrt(
 *   Interval(4, 9)
 * ) // Interval(prev(2), next(3))
 * ```
 *
 * @param {Interval} x
 * @returns {Interval}
 */
function sqrt(x) {
    return nthRoot(x, 2);
}
/**
 * Computes `x^(1/n)`
 *
 * @example
 * ```typescript
 * Interval.nthRoot(
 *   Interval(-27, -8),
 *   3
 * ) // Interval(-3, -2)
 * ```
 *
 * @param {Interval} x
 * @param {number|Interval} n A number or a singleton interval
 * @return {Interval}
 */
function nthRoot(x, n) {
    if (isEmpty(x) || n < 0) {
        // compute 1 / x^-power if power is negative
        return lib_esm_constants.EMPTY;
    }
    // singleton interval check
    if (typeof n === 'object') {
        if (!isSingleton(n)) {
            return lib_esm_constants.EMPTY;
        }
        n = n.lo;
    }
    const power = 1 / n;
    if (x.hi < 0) {
        // [negative, negative]
        if (Number.isSafeInteger(n) && (n & 1) === 1) {
            // when n is odd we can always take the nth root
            const yl = lib_esm_round.powHi(-x.lo, power);
            const yh = lib_esm_round.powLo(-x.hi, power);
            return new Interval(-yl, -yh);
        }
        // n is not odd therefore there's no nth root
        return lib_esm_constants.EMPTY;
    }
    else if (x.lo < 0) {
        // [negative, positive]
        const yp = lib_esm_round.powHi(x.hi, power);
        if (Number.isSafeInteger(n) && (n & 1) === 1) {
            // nth root of x.lo is possible (n is odd)
            const yn = -lib_esm_round.powHi(-x.lo, power);
            return new Interval(yn, yp);
        }
        return new Interval(0, yp);
    }
    else {
        // [positive, positive]
        return new Interval(lib_esm_round.powLo(x.lo, power), lib_esm_round.powHi(x.hi, power));
    }
}
//# sourceMappingURL=algebra.js.map
;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/operations/misc.js





/**
 * @mixin misc
 */
/**
 * Computes e^x where e is the mathematical constant equal to the base of the
 * natural logarithm
 *
 * @example
 * ```typescript
 * Interval.exp(
 *   Interval(-1, 1)
 * )  // Interval(0.3679, 2.7183)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function exp(x) {
    if (isEmpty(x)) {
        return lib_esm_constants.EMPTY;
    }
    return new Interval(lib_esm_round.expLo(x.lo), lib_esm_round.expHi(x.hi));
}
/**
 * Computes the natural logarithm of x
 *
 * @example
 * ```typescript
 * Interval.log(
 *   Interval(1, Math.exp(3))
 * )  // Interval(0, 3)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function log(x) {
    if (isEmpty(x)) {
        return lib_esm_constants.EMPTY;
    }
    const l = x.lo <= 0 ? Number.NEGATIVE_INFINITY : lib_esm_round.logLo(x.lo);
    return new Interval(l, lib_esm_round.logHi(x.hi));
}
/**
 * Alias for {@link log}
 * @function
 */
const ln = log;
const LOG_EXP_10 = log(new Interval(10, 10));
/**
 * Computes the logarithm base 10 of x
 *
 * @example
 * ```typescript
 * Interval.log10(
 *   Interva(1, 1000)
 * )  // Interval(0, 3)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function log10(x) {
    if (isEmpty(x)) {
        return lib_esm_constants.EMPTY;
    }
    return div(log(x), LOG_EXP_10);
}
const LOG_EXP_2 = log(new Interval(2, 2));
/**
 * Computes the logarithm base 2 of x
 *
 * @example
 * ```typescript
 * Interval.log10(
 *   Interva(1, 8)
 * )  // Interval(0, 3)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function log2(x) {
    if (isEmpty(x)) {
        return lib_esm_constants.EMPTY;
    }
    return div(log(x), LOG_EXP_2);
}
/**
 * Computes an interval that has all the values of x and y, note that it may be
 * possible that values that don't belong to either x or y are included in the
 * interval that represents the hull
 *
 * @example
 * ```typescript
 * Interval.hull(
 *   Interval(-1, 1),
 *   Interval(5, 7)
 * )  // Interval(-1, 7)
 * Interval.hull(
 *   Interval(-1, 1),
 *   Interval.EMPTY
 * )  // Interval(-1, 1)
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function hull(x, y) {
    const badX = isEmpty(x);
    const badY = isEmpty(y);
    if (badX && badY) {
        return lib_esm_constants.EMPTY;
    }
    else if (badX) {
        return y.clone();
    }
    else if (badY) {
        return x.clone();
    }
    else {
        return new Interval(Math.min(x.lo, y.lo), Math.max(x.hi, y.hi));
    }
}
/**
 * Computes an interval that has all the values that belong to both x and y
 *
 * @example
 * ```typescript
 * Interval.intersection(
 *   Interval(-1, 1),
 *   Interval(0, 7)
 * )  // Interval(0, 1)
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function intersection(x, y) {
    if (isEmpty(x) || isEmpty(y)) {
        return lib_esm_constants.EMPTY;
    }
    const lo = Math.max(x.lo, y.lo);
    const hi = Math.min(x.hi, y.hi);
    if (lo <= hi) {
        return new Interval(lo, hi);
    }
    return lib_esm_constants.EMPTY;
}
/**
 * Computes an interval that has all the values that belong to both x and y,
 * the difference with {@link hull} is that x and y must overlap to
 * compute the union
 *
 * @example
 * ```typescript
 * Interval.union(
 *   Interval(-1, 1),
 *   Interval(5, 7)
 * )  // throws error
 * Interval.union(
 *   Interval(-1, 1),
 *   Interval(1, 7)
 * )  // Interval(-1, 7)
 * ```
 *
 * @throws {Error} When x and y don't overlap
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function union(x, y) {
    if (!intervalsOverlap(x, y)) {
        throw Error('Interval#union: intervals do not overlap');
    }
    return new Interval(Math.min(x.lo, y.lo), Math.max(x.hi, y.hi));
}
/**
 * Computes the difference between `x` and `y`, i.e. an interval with all the
 * values of `x` that are not in `y`
 *
 * @example
 * ```typescript
 * Interval.difference(
 *   Interval(3, 5),
 *   Interval(4, 6)
 * )  // Interval(3, prev(4))
 * Interval.difference(
 *   Interval(0, 3),
 *   Interval(0, 1)
 * )  // Interval(next(1), 3)
 * Interval.difference(
 *   Interval(0, 1),
 *   Interval.WHOLE
 * )  // Interval.EMPTY
 * Interval.difference(
 *   Interval(-Infinity, 0),
 *   Interval.WHOLE
 * )  // Interval.EMPTY
 * ```
 *
 * @throws {Error} When the difference creates multiple intervals
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function difference(x, y) {
    if (isEmpty(x) || isWhole(y)) {
        return lib_esm_constants.EMPTY;
    }
    if (intervalsOverlap(x, y)) {
        if (x.lo < y.lo && y.hi < x.hi) {
            // difference creates multiple subsets
            throw Error('Interval.difference: difference creates multiple intervals');
        }
        // handle corner cases first
        if ((y.lo <= x.lo && y.hi === Infinity) || (y.hi >= x.hi && y.lo === -Infinity)) {
            return lib_esm_constants.EMPTY;
        }
        // NOTE: empty interval is handled automatically
        // e.g.
        //
        //    n = difference([0,1], [0,1]) // n = Interval(next(1), 1) = EMPTY
        //    isEmpty(n) === true
        //
        if (y.lo <= x.lo) {
            return new Interval().halfOpenLeft(y.hi, x.hi);
        }
        // y.hi >= x.hi
        return new Interval().halfOpenRight(x.lo, y.lo);
    }
    return x.clone();
}
/**
 * Computes the distance between the endpoints of the interval i.e. `x.hi - x.lo`
 *
 * @example
 * ```typescript
 * Interval.width(
 *   Interval(1, 2)
 * )  // 1
 * Interval.width(
 *   Interval(-1, 1)
 * )  // 2
 * Interval.width(
 *   Interval(1, 1)
 * )  // next(0) ~5e-324
 * Interval.width(
 *   Interval.EMPTY
 * )  // 0
 * ```
 *
 * @param {Interval} x
 * @returns {number}
 */
function width(x) {
    if (isEmpty(x)) {
        return 0;
    }
    return lib_esm_round.subHi(x.hi, x.lo);
}
/**
 * Alias for {@link  width}
 * @function
 */
const wid = width;
/**
 * Computes the absolute value of `x`
 *
 * @example
 * ```typescript
 * Interval.abs(
 *   Interval(2, 3)
 * )  // Interval(2, 3)
 * Interval.abs(
 *   Interval(-2, 3)
 * )  // Interval(2, 3)
 * Interval.abs(
 *   Interval(-3, -2)
 * )  // Interval(2, 3)
 * Interval.abs(
 *   Interval(-3, 2)
 * )  // Interval(0, 3)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function abs(x) {
    if (isEmpty(x) || isWhole(x)) {
        return lib_esm_constants.EMPTY;
    }
    if (x.lo >= 0) {
        return x.clone();
    }
    if (x.hi <= 0) {
        return arithmetic_negative(x);
    }
    return new Interval(0, Math.max(-x.lo, x.hi));
}
/**
 * Computes an interval with the maximum values for each endpoint based on `x`
 * and `y`
 *
 * @example
 * ```typescript
 * Interval.max(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * )  // Interval(1, 3)
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function max(x, y) {
    const badX = isEmpty(x);
    const badY = isEmpty(y);
    if (badX && badY) {
        return lib_esm_constants.EMPTY;
    }
    else if (badX) {
        return y.clone();
    }
    else if (badY) {
        return x.clone();
    }
    else {
        return new Interval(Math.max(x.lo, y.lo), Math.max(x.hi, y.hi));
    }
}
/**
 * Computes an interval with the minimum values for each endpoint based on `x` and `y`
 *
 * @example
 * ```typescript
 * Interval.min(
 *   Interval(0, 3),
 *   Interval(1, 2)
 * )  // Interval(0, 2)
 * ```
 *
 * @param {Interval} x
 * @param {Interval} y
 * @return {Interval}
 */
function min(x, y) {
    const badX = isEmpty(x);
    const badY = isEmpty(y);
    if (badX && badY) {
        return lib_esm_constants.EMPTY;
    }
    else if (badX) {
        return y.clone();
    }
    else if (badY) {
        return x.clone();
    }
    else {
        return new Interval(Math.min(x.lo, y.lo), Math.min(x.hi, y.hi));
    }
}
/**
 * Creates an interval equal to `x`, equivalent to `Interval().set(x.lo, x.hi)`
 *
 * @example
 * ```typescript
 * Interval.clone(
 *   Interval(1, 2)
 * )  // Interval(1, 2)
 * Interval.clone(
 *   Interval.EMPTY
 * )  // Interval.EMPTY
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function clone(x) {
    // no bound checking
    return new Interval().set(x.lo, x.hi);
}
//# sourceMappingURL=misc.js.map
;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/operations/trigonometric.js








/**
 * @mixin trigonometric
 */
/**
 * Checks if an interval is
 * - [-Infinity, -Infinity]
 * - [Infinity, Infinity]
 * @param {Interval} x
 * @returns {boolean}
 */
function onlyInfinity(x) {
    return !isFinite(x.lo) && x.lo === x.hi;
}
/**
 * moves interval 2PI * k to the right until both bounds are positive
 * @param interval
 */
function handleNegative(interval) {
    if (interval.lo < 0) {
        if (interval.lo === -Infinity) {
            interval.lo = 0;
            interval.hi = Infinity;
        }
        else {
            const n = Math.ceil(-interval.lo / lib_esm_constants.PI_TWICE_LOW);
            interval.lo += lib_esm_constants.PI_TWICE_LOW * n;
            interval.hi += lib_esm_constants.PI_TWICE_LOW * n;
        }
    }
    return interval;
}
/**
 * Computes the cosine of `x`
 *
 * @example
 * ```typescript
 * Interval.cos(
 *   Interval(0, 0)
 * ) // Interval(1, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.cos(
 *   Interval(0, Math.PI / 2)
 * ) // Interval(0, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.cos(
 *   Interval(3 * Math.PI / 2, 3 * Math.PI)
 * ) // Interval(-1, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.cos(
 *   Interval(-Infinity, x)
 * )
 * // Interval(-1, 1) if x > -Infinity
 * // Interval.EMPTY otherwise
 * ```
 *
 * @example
 * ```typescript
 * Interval.cos(
 *   Interval(x, Infinity)
 * )
 * // Interval(-1, 1) if x < Infinity
 * // Interval.EMPTY otherwise
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function cos(x) {
    if (isEmpty(x) || onlyInfinity(x)) {
        return lib_esm_constants.EMPTY;
    }
    // create a clone of `x` because the clone is going to be modified
    const cache = new Interval().set(x.lo, x.hi);
    handleNegative(cache);
    const pi2 = lib_esm_constants.PI_TWICE;
    const t = fmod(cache, pi2);
    if (width(t) >= pi2.lo) {
        return new Interval(-1, 1);
    }
    // when t.lo > pi it's the same as
    // -cos(t - pi)
    if (t.lo >= lib_esm_constants.PI_HIGH) {
        const cosv = cos(sub(t, lib_esm_constants.PI));
        return arithmetic_negative(cosv);
    }
    const lo = t.lo;
    const hi = t.hi;
    const rlo = lib_esm_round.cosLo(hi);
    const rhi = lib_esm_round.cosHi(lo);
    // it's ensured that t.lo < pi and that t.lo >= 0
    if (hi <= lib_esm_constants.PI_LOW) {
        // when t.hi < pi
        // [cos(t.lo), cos(t.hi)]
        return new Interval(rlo, rhi);
    }
    else if (hi <= pi2.lo) {
        // when t.hi < 2pi
        // [-1, max(cos(t.lo), cos(t.hi))]
        return new Interval(-1, Math.max(rlo, rhi));
    }
    else {
        // t.lo < pi and t.hi > 2pi
        return new Interval(-1, 1);
    }
}
/**
 * Computes the sine of `x`
 *
 * @example
 * ```typescript
 * Interval.sin(
 *   Interval(0, 0)
 * ) // Interval(0, 0)
 * ```
 *
 * @example
 * ```typescript
 * Interval.sin(
 *   Interval(0, Math.PI / 2)
 * ) // Interval(0, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.sin(
 *   Interval(Math.PI / 2, Math.PI / 2)
 * ) // Interval(1, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.sin(
 *   Interval(Math.PI / 2, -Math.PI / 2)
 * ) // Interval(-1, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.sin(
 *   Interval(Math.PI, 3 * Math.PI / 2)
 * ) // Interval(-1, 0)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function sin(x) {
    if (isEmpty(x) || onlyInfinity(x)) {
        return lib_esm_constants.EMPTY;
    }
    return cos(sub(x, lib_esm_constants.PI_HALF));
}
/**
 * Computes the tangent of `x`
 *
 * @example
 * ```typescript
 * Interval.tan(
 *   Interval(-Math.PI / 4, Math.PI / 4)
 * ) // Interval(-1, 1)
 * ```
 *
 * @example
 * ```typescript
 * Interval.tan(
 *   Interval(0, Math.PI / 2)
 * ) // Interval.WHOLE
 * ```
 *
 * @example
 * ```typescript
 * Interval.tan(
 *   Interval(-Infinity, x)
 * )
 * // Interval.WHOLE if x > -Infinity
 * // Interval.EMPTY otherwise
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function tan(x) {
    if (isEmpty(x) || onlyInfinity(x)) {
        return lib_esm_constants.EMPTY;
    }
    // create a clone of `x` because the clone is going to be modified
    const cache = new Interval().set(x.lo, x.hi);
    handleNegative(cache);
    const pi = lib_esm_constants.PI;
    let t = fmod(cache, pi);
    if (t.lo >= lib_esm_constants.PI_HALF_LOW) {
        t = sub(t, pi);
    }
    if (t.lo <= -lib_esm_constants.PI_HALF_LOW || t.hi >= lib_esm_constants.PI_HALF_LOW) {
        return lib_esm_constants.WHOLE;
    }
    return new Interval(lib_esm_round.tanLo(t.lo), lib_esm_round.tanHi(t.hi));
}
/**
 * Computes the arcsine of `x`
 *
 * @example
 * ```typescript
 * Interval.asin(
 *   Interval(-1.57079633, 1.57079633)
 * )  // Interval(-10, 10)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function asin(x) {
    if (isEmpty(x) || x.hi < -1 || x.lo > 1) {
        return lib_esm_constants.EMPTY;
    }
    const lo = x.lo <= -1 ? -lib_esm_constants.PI_HALF_HIGH : lib_esm_round.asinLo(x.lo);
    const hi = x.hi >= 1 ? lib_esm_constants.PI_HALF_HIGH : lib_esm_round.asinHi(x.hi);
    return new Interval(lo, hi);
}
/**
 * Computes the arccosine of `x`
 *
 * @example
 * ```typescript
 * Interval.acos(
 *   Interval(0, 1)
 * )  // Interval(0, Math.PI / 2)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function acos(x) {
    if (isEmpty(x) || x.hi < -1 || x.lo > 1) {
        return lib_esm_constants.EMPTY;
    }
    const lo = x.hi >= 1 ? 0 : lib_esm_round.acosLo(x.hi);
    const hi = x.lo <= -1 ? lib_esm_constants.PI_HIGH : lib_esm_round.acosHi(x.lo);
    return new Interval(lo, hi);
}
/**
 * Computes the arctangent of `x`
 *
 * @example
 * ```typescript
 * Interval.atan(
 *   Interval(-1, 1)
 * )  // Interval(-0.785398163, 0.785398163)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function atan(x) {
    if (isEmpty(x)) {
        return lib_esm_constants.EMPTY;
    }
    return new Interval(lib_esm_round.atanLo(x.lo), lib_esm_round.atanHi(x.hi));
}
/**
 * Computes the hyperbolic sine of `x`
 *
 * @example
 * ```typescript
 * Interval.sinh(
 *   Interval(-2, 2)
 * )  // Interval(-3.6286040785, 3.6286040785)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function sinh(x) {
    if (isEmpty(x)) {
        return lib_esm_constants.EMPTY;
    }
    return new Interval(lib_esm_round.sinhLo(x.lo), lib_esm_round.sinhHi(x.hi));
}
/**
 * Computes the hyperbolic cosine of `x`
 *
 * @example
 * ```typescript
 * Interval.cosh(
 *   Interval(-2, 2)
 * )  // Interval(1, 3.76219569108)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function cosh(x) {
    if (isEmpty(x)) {
        return lib_esm_constants.EMPTY;
    }
    if (x.hi < 0) {
        return new Interval(lib_esm_round.coshLo(x.hi), lib_esm_round.coshHi(x.lo));
    }
    else if (x.lo >= 0) {
        return new Interval(lib_esm_round.coshLo(x.lo), lib_esm_round.coshHi(x.hi));
    }
    else {
        return new Interval(1, lib_esm_round.coshHi(-x.lo > x.hi ? x.lo : x.hi));
    }
}
/**
 * Computes the hyperbolic tangent of `x`
 *
 * @example
 * ```typescript
 * Interval.tanh(
 *   Interval(-Infinity, Infinity)
 * )  // Interval(-1, 1)
 * ```
 *
 * @param {Interval} x
 * @return {Interval}
 */
function tanh(x) {
    if (isEmpty(x)) {
        return lib_esm_constants.EMPTY;
    }
    return new Interval(lib_esm_round.tanhLo(x.lo), lib_esm_round.tanhHi(x.hi));
}
//# sourceMappingURL=trigonometric.js.map
;// CONCATENATED MODULE: ./node_modules/interval-arithmetic/lib-esm/index.js
/*
 * interval-arithmetic
 *
 * Copyright (c) 2015-2020 Mauricio Poppe
 * Licensed under the MIT license.
 */









const MixedInterval = Object.assign(Interval, lib_esm_constants, lib_esm_round, misc_namespaceObject, utils_namespaceObject, relational_namespaceObject, arithmetic_namespaceObject, algebra_namespaceObject, trigonometric_namespaceObject, { round: lib_esm_round });
/* harmony default export */ const lib_esm = (MixedInterval);








//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * math-codegen
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */

module.exports = __webpack_require__(3829)


/***/ }),

/***/ 3829:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Parser = (__webpack_require__(9213).Parser)
var Interpreter = __webpack_require__(6009)
var extend = __webpack_require__(4470)

function CodeGenerator (options, defs) {
  this.statements = []
  this.defs = defs || {}
  this.interpreter = new Interpreter(this, options)
}

CodeGenerator.prototype.setDefs = function (defs) {
  this.defs = extend(this.defs, defs)
  return this
}

CodeGenerator.prototype.compile = function (namespace) {
  if (!namespace || !(typeof namespace === 'object' || typeof namespace === 'function')) {
    throw TypeError('namespace must be an object')
  }
  if (typeof namespace.factory !== 'function') {
    throw TypeError('namespace.factory must be a function')
  }

  // definitions available in the function
  // each property under this.defs is mapped to local variables
  // e.g
  //
  //  function (defs) {
  //    var ns = defs['ns']
  //    // code generated for the expression
  //  }
  this.defs.ns = namespace
  this.defs.$$mathCodegen = {
    getProperty: function (symbol, scope, ns) {
      if (symbol in scope) {
        return scope[symbol]
      }
      if (symbol in ns) {
        return ns[symbol]
      }
      throw SyntaxError('symbol "' + symbol + '" is undefined')
    },
    functionProxy: function (fn, name) {
      if (typeof fn !== 'function') {
        throw SyntaxError('symbol "' + name + '" must be a function')
      }
      return fn
    }
  }
  this.defs.$$processScope = this.defs.$$processScope || function () {}

  var defsCode = Object.keys(this.defs).map(function (name) {
    return 'var ' + name + ' = defs["' + name + '"]'
  })

  // statement join
  if (!this.statements.length) {
    throw Error('there are no statements saved in this generator, make sure you parse an expression before compiling it')
  }

  // last statement is always a return statement
  this.statements[this.statements.length - 1] = 'return ' + this.statements[this.statements.length - 1]

  var code = this.statements.join(';')
  var factoryCode = defsCode.join('\n') + '\n' + [
    'return {',
    '  eval: function (scope) {',
    '    scope = scope || {}',
    '    $$processScope(scope)',
    '    ' + code,
    '  },',
    "  code: '" + code + "'",
    '}'
  ].join('\n')

  /* eslint-disable */
  var factory = new Function('defs', factoryCode)
  return factory(this.defs)
  /* eslint-enable */
}

CodeGenerator.prototype.parse = function (code) {
  var self = this
  var program = new Parser().parse(code)
  this.statements = program.blocks.map(function (statement) {
    return self.interpreter.next(statement)
  })
  return this
}

module.exports = CodeGenerator


/***/ }),

/***/ 6009:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var extend = __webpack_require__(4470)

var types = {
  ArrayNode: __webpack_require__(5476),
  AssignmentNode: __webpack_require__(6408),
  ConditionalNode: __webpack_require__(9907),
  ConstantNode: __webpack_require__(2341),
  FunctionNode: __webpack_require__(7850),
  OperatorNode: __webpack_require__(305),
  SymbolNode: __webpack_require__(6656),
  UnaryNode: __webpack_require__(2386)
}

var Interpreter = function (owner, options) {
  this.owner = owner
  this.options = extend({
    factory: 'ns.factory',
    raw: false,
    rawArrayExpressionElements: true,
    rawCallExpressionElements: false
  }, options)
}

extend(Interpreter.prototype, types)

// main method which decides which expression to call
Interpreter.prototype.next = function (node) {
  if (!(node.type in this)) {
    throw new TypeError('the node type ' + node.type + ' is not implemented')
  }
  return this[node.type](node)
}

Interpreter.prototype.rawify = function (test, fn) {
  var oldRaw = this.options.raw
  if (test) {
    this.options.raw = true
  }
  fn()
  if (test) {
    this.options.raw = oldRaw
  }
}

module.exports = Interpreter


/***/ }),

/***/ 2576:
/***/ ((module) => {

"use strict";


module.exports = {
  // arithmetic
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div',
  '^': 'pow',
  '%': 'mod',
  '!': 'factorial',

  // misc operators
  '|': 'bitwiseOR',       // bitwise or
  '^|': 'bitwiseXOR',     // bitwise xor
  '&': 'bitwiseAND',      // bitwise and

  '||': 'logicalOR',      // logical or
  'xor': 'logicalXOR',    // logical xor
  '&&': 'logicalAND',     // logical and

  // comparison
  '<': 'lessThan',
  '>': 'greaterThan',
  '<=': 'lessEqualThan',
  '>=': 'greaterEqualThan',
  '===': 'strictlyEqual',
  '==': 'equal',
  '!==': 'strictlyNotEqual',
  '!=': 'notEqual',

  // shift
  '>>': 'shiftRight',
  '<<': 'shiftLeft',
  '>>>': 'unsignedRightShift'
}


/***/ }),

/***/ 6104:
/***/ ((module) => {

"use strict";


module.exports = {
  '+': 'positive',
  '-': 'negative',
  '~': 'oneComplement'
}


/***/ }),

/***/ 5476:
/***/ ((module) => {

"use strict";

module.exports = function (node) {
  var self = this
  var arr = []
  this.rawify(this.options.rawArrayExpressionElements, function () {
    arr = node.nodes.map(function (el) {
      return self.next(el)
    })
  })
  var arrString = '[' + arr.join(',') + ']'

  if (this.options.raw) {
    return arrString
  }
  return this.options.factory + '(' + arrString + ')'
}


/***/ }),

/***/ 6408:
/***/ ((module) => {

"use strict";


module.exports = function (node) {
  return 'scope["' + node.name + '"] = ' + this.next(node.expr)
}


/***/ }),

/***/ 9907:
/***/ ((module) => {

"use strict";


module.exports = function (node) {
  var condition = '!!(' + this.next(node.condition) + ')'
  var trueExpr = this.next(node.trueExpr)
  var falseExpr = this.next(node.falseExpr)
  return '(' + condition + ' ? (' + trueExpr + ') : (' + falseExpr + ') )'
}


/***/ }),

/***/ 2341:
/***/ ((module) => {

"use strict";

module.exports = function (node) {
  if (this.options.raw) {
    return node.value
  }
  return this.options.factory + '(' + node.value + ')'
}


/***/ }),

/***/ 7850:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var SymbolNode = (__webpack_require__(9213).nodeTypes.SymbolNode)

var functionProxy = function (node) {
  return '$$mathCodegen.functionProxy(' + this.next(new SymbolNode(node.name)) + ', "' + node.name + '")'
}

module.exports = function (node) {
  var self = this
  // wrap in a helper function to detect the type of symbol it must be a function
  // NOTE: if successful the wrapper returns the function itself
  // NOTE: node.name should be a symbol so that it's correctly represented as a string in SymbolNode
  var method = functionProxy.call(this, node)
  var args = []
  this.rawify(this.options.rawCallExpressionElements, function () {
    args = node.args.map(function (arg) {
      return self.next(arg)
    })
  })
  return method + '(' + args.join(', ') + ')'
}

module.exports.functionProxy = functionProxy


/***/ }),

/***/ 305:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Operators = __webpack_require__(2576)

module.exports = function (node) {
  if (this.options.raw) {
    return ['(' + this.next(node.args[0]), node.op, this.next(node.args[1]) + ')'].join(' ')
  }

  var namedOperator = Operators[node.op]

  if (!namedOperator) {
    throw TypeError('unidentified operator')
  }

  /* eslint-disable new-cap */
  return this.FunctionNode({
    name: namedOperator,
    args: node.args
  })
  /* eslint-enable new-cap */
}


/***/ }),

/***/ 6656:
/***/ ((module) => {

"use strict";


module.exports = function (node) {
  var id = node.name
  return '$$mathCodegen.getProperty("' + id + '", scope, ns)'
}


/***/ }),

/***/ 2386:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var UnaryOperators = __webpack_require__(6104)

module.exports = function (node) {
  if (this.options.raw) {
    return node.op + this.next(node.argument)
  }

  if (!(node.op in UnaryOperators)) {
    throw new SyntaxError(node.op + ' not implemented')
  }

  var namedOperator = UnaryOperators[node.op]
  /* eslint-disable new-cap */
  return this.FunctionNode({
    name: namedOperator,
    args: [node.argument]
  })
  /* eslint-enable new-cap */
}


/***/ }),

/***/ 9213:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * mr-parser
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */



/* unused reexport */ __webpack_require__(1668)
module.exports.Parser = __webpack_require__(5438)
module.exports.nodeTypes = __webpack_require__(3450)


/***/ }),

/***/ 1668:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// token types
var tokenType = __webpack_require__(5054)

var ESCAPES = {
  'n': '\n',
  'f': '\f',
  'r': '\r',
  't': '\t',
  'v': '\v',
  '\'': '\'',
  '"': '"'
}

var DELIMITERS = {
  ',': true,
  '(': true,
  ')': true,
  '[': true,
  ']': true,
  ';': true,

  // unary
  '~': true,

  // factorial
  '!': true,

  // arithmetic operators
  '+': true,
  '-': true,
  '*': true,
  '/': true,
  '%': true,
  '^': true,
  '**': true,     // python power like

  // misc operators
  '|': true,      // bitwise or
  '&': true,      // bitwise and
  '^|': true,     // bitwise xor
  '=': true,
  ':': true,
  '?': true,

  '||': true,      // logical or
  '&&': true,      // logical and
  'xor': true,     // logical xor

  // relational
  '==': true,
  '!=': true,
  '===': true,
  '!==': true,
  '<': true,
  '>': true,
  '>=': true,
  '<=': true,

  // shifts
  '>>>': true,
  '<<': true,
  '>>': true
}

// helpers

function isDigit (c) {
  return c >= '0' && c <= '9'
}

function isIdentifier (c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
    c === '$' || c === '_'
}

function isWhitespace (c) {
  return c === ' ' || c === '\r' || c === '\t' ||
    c === '\n' || c === '\v' || c === '\u00A0'
}

function isDelimiter (str) {
  return DELIMITERS[str]
}

function isQuote (c) {
  return c === '\'' || c === '"'
}

// lexer

function Lexer () {}

Lexer.prototype.throwError = function (message, index) {
  index = typeof index === 'undefined' ? this.index : index

  var error = new Error(message + ' at index ' + index)
  error.index = index
  error.description = message
  throw error
}

Lexer.prototype.lex = function (text) {
  this.text = text
  this.index = 0
  this.tokens = []

  while (this.index < this.text.length) {
    // skip whitespaces
    while (isWhitespace(this.peek())) {
      this.consume()
    }
    var c = this.peek()
    var c2 = c + this.peek(1)
    var c3 = c2 + this.peek(2)

    // order
    // - delimiter of 3 characters
    // - delimiter of 2 characters
    // - delimiter of 1 character
    // - number
    // - variables, functions and named operators
    if (isDelimiter(c3)) {
      this.tokens.push({
        type: tokenType.DELIMITER,
        value: c3
      })
      this.consume()
      this.consume()
      this.consume()
    } else if (isDelimiter(c2)) {
      this.tokens.push({
        type: tokenType.DELIMITER,
        value: c2
      })
      this.consume()
      this.consume()
    } else if (isDelimiter(c)) {
      this.tokens.push({
        type: tokenType.DELIMITER,
        value: c
      })
      this.consume()
    } else if (isDigit(c) ||
        (c === '.' && isDigit(this.peek(1)))) {
      this.tokens.push({
        type: tokenType.NUMBER,
        value: this.readNumber()
      })
    } else if (isQuote(c)) {
      this.tokens.push({
        type: tokenType.STRING,
        value: this.readString()
      })
    } else if (isIdentifier(c)) {
      this.tokens.push({
        type: tokenType.SYMBOL,
        value: this.readIdentifier()
      })
    } else {
      this.throwError('unexpected character ' + c)
    }
  }

  // end token
  this.tokens.push({ type: tokenType.EOF })

  return this.tokens
}

Lexer.prototype.peek = function (nth) {
  nth = nth || 0
  if (this.index + nth >= this.text.length) {
    return
  }
  return this.text.charAt(this.index + nth)
}

Lexer.prototype.consume = function () {
  var current = this.peek()
  this.index += 1
  return current
}

Lexer.prototype.readNumber = function () {
  var number = ''

  if (this.peek() === '.') {
    number += this.consume()
    if (!isDigit(this.peek())) {
      this.throwError('number expected')
    }
  } else {
    while (isDigit(this.peek())) {
      number += this.consume()
    }
    if (this.peek() === '.') {
      number += this.consume()
    }
  }

  // numbers after the decimal dot
  while (isDigit(this.peek())) {
    number += this.consume()
  }

  // exponent if available
  if ((this.peek() === 'e' || this.peek() === 'E')) {
    number += this.consume()

    if (!(isDigit(this.peek()) ||
        this.peek() === '+' ||
        this.peek() === '-')) {
      this.throwError()
    }

    if (this.peek() === '+' || this.peek() === '-') {
      number += this.consume()
    }

    if (!isDigit(this.peek())) {
      this.throwError('number expected')
    }

    while (isDigit(this.peek())) {
      number += this.consume()
    }
  }
  return number
}

Lexer.prototype.readIdentifier = function () {
  var text = ''
  while (isIdentifier(this.peek()) || isDigit(this.peek())) {
    text += this.consume()
  }
  return text
}

Lexer.prototype.readString = function () {
  var quote = this.consume()
  var string = ''
  var escape
  while (true) {
    var c = this.consume()
    if (!c) {
      this.throwError('string is not closed')
    }
    if (escape) {
      if (c === 'u') {
        var hex = this.text.substring(this.index + 1, this.index + 5)
        if (!hex.match(/[\da-f]{4}/i)) {
          this.throwError('invalid unicode escape')
        }
        this.index += 4
        string += String.fromCharCode(parseInt(hex, 16))
      } else {
        var replacement = ESCAPES[c]
        if (replacement) {
          string += replacement
        } else {
          string += c
        }
      }
      escape = false
    } else if (c === quote) {
      break
    } else if (c === '\\') {
      escape = true
    } else {
      string += c
    }
  }
  return string
}

module.exports = Lexer


/***/ }),

/***/ 5438:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var tokenType = __webpack_require__(5054)

var Lexer = __webpack_require__(1668)
var ConstantNode = __webpack_require__(6311)
var OperatorNode = __webpack_require__(6565)
var UnaryNode = __webpack_require__(5543)
var SymbolNode = __webpack_require__(2514)
var FunctionNode = __webpack_require__(8935)
var ArrayNode = __webpack_require__(3862)
var ConditionalNode = __webpack_require__(9322)
var AssignmentNode = __webpack_require__(3262)
var BlockNode = __webpack_require__(2962)

/**
 * Grammar DSL:
 *
 * program          : block (; block)*
 *
 * block            : assignment
 *
 * assignment       : ternary
 *                  | symbol `=` assignment
 *
 * ternary          : logicalOR
 *                  | logicalOR `?` ternary `:` ternary
 *
 * logicalOR        : logicalXOR
 *                  | logicalXOR (`||`,`or`) logicalOR
 *
 * logicalXOR       : logicalAND
 *                  : logicalAND `xor` logicalXOR
 *
 * logicalAND       : bitwiseOR
 *                  | bitwiseOR (`&&`,`and`) logicalAND
 *
 * bitwiseOR        : bitwiseXOR
 *                  | bitwiseXOR `|` bitwiseOR
 *
 * bitwiseXOR       : bitwiseAND
 *                  | bitwiseAND `^|` bitwiseXOR
 *
 * bitwiseAND       : relational
 *                  | relational `&` bitwiseAND
 *
 * relational       : shift
 *                  | shift (`!=` | `==` | `>` | '<' | '<=' |'>=') shift)
 *
 * shift            : additive
 *                  | additive (`>>` | `<<` | `>>>`) shift
 *
 * additive         : multiplicative
 *                  | multiplicative (`+` | `-`) additive
 *
 * multiplicative   : unary
 *                  | unary (`*` | `/` | `%`) unary
 *                  | unary symbol
 *
 * unary            : pow
 *                  | (`-` | `+` | `~`) unary
 *
 * pow              : factorial
 *                  | factorial (`^`, '**') unary
 *
 * factorial        : symbol
 *                  | symbol (`!`)
 *
 * symbol           : symbolToken
 *                  | symbolToken functionCall
 *                  | string
 *
 * functionCall     : `(` `)`
 *                  | `(` ternary (, ternary)* `)`
 *
 * string           : `'` (character)* `'`
 *                  : `"` (character)* `"`
 *                  | array
 *
 * array            : `[` `]`
 *                  | `[` assignment (, assignment)* `]`
 *                  | number
 *
 * number           : number-token
 *                  | parentheses
 *
 * parentheses      : `(` assignment `)`
 *                  : end
 *
 * end              : NULL
 *
 * @param {[type]} lexer [description]
 */
function Parser () {
  this.lexer = new Lexer()
  this.tokens = null
}

Parser.prototype.current = function () {
  return this.tokens[0]
}

Parser.prototype.next = function () {
  return this.tokens[1]
}

Parser.prototype.peek = function () {
  if (this.tokens.length) {
    var first = this.tokens[0]
    for (var i = 0; i < arguments.length; i += 1) {
      if (first.value === arguments[i]) {
        return true
      }
    }
  }
}

Parser.prototype.consume = function (e) {
  return this.tokens.shift()
}

Parser.prototype.expect = function (e) {
  if (!this.peek(e)) {
    throw Error('expected ' + e)
  }
  return this.consume()
}

Parser.prototype.isEOF = function () {
  return this.current().type === tokenType.EOF
}

Parser.prototype.parse = function (text) {
  this.tokens = this.lexer.lex(text)
  return this.program()
}

Parser.prototype.program = function () {
  var blocks = []
  while (!this.isEOF()) {
    blocks.push(this.assignment())
    if (this.peek(';')) {
      this.consume()
    }
  }
  this.end()
  return new BlockNode(blocks)
}

Parser.prototype.assignment = function () {
  var left = this.ternary()
  if (left instanceof SymbolNode && this.peek('=')) {
    this.consume()
    return new AssignmentNode(left.name, this.assignment())
  }
  return left
}

Parser.prototype.ternary = function () {
  var predicate = this.logicalOR()
  if (this.peek('?')) {
    this.consume()
    var truthy = this.ternary()
    this.expect(':')
    var falsy = this.ternary()
    return new ConditionalNode(predicate, truthy, falsy)
  }
  return predicate
}

Parser.prototype.logicalOR = function () {
  var left = this.logicalXOR()
  if (this.peek('||')) {
    var op = this.consume()
    var right = this.logicalOR()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.logicalXOR = function () {
  var left = this.logicalAND()
  if (this.current().value === 'xor') {
    var op = this.consume()
    var right = this.logicalXOR()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.logicalAND = function () {
  var left = this.bitwiseOR()
  if (this.peek('&&')) {
    var op = this.consume()
    var right = this.logicalAND()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.bitwiseOR = function () {
  var left = this.bitwiseXOR()
  if (this.peek('|')) {
    var op = this.consume()
    var right = this.bitwiseOR()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.bitwiseXOR = function () {
  var left = this.bitwiseAND()
  if (this.peek('^|')) {
    var op = this.consume()
    var right = this.bitwiseXOR()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.bitwiseAND = function () {
  var left = this.relational()
  if (this.peek('&')) {
    var op = this.consume()
    var right = this.bitwiseAND()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.relational = function () {
  var left = this.shift()
  if (this.peek('==', '===', '!=', '!==', '>=', '<=', '>', '<')) {
    var op = this.consume()
    var right = this.shift()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.shift = function () {
  var left = this.additive()
  if (this.peek('>>', '<<', '>>>')) {
    var op = this.consume()
    var right = this.shift()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.additive = function () {
  var left = this.multiplicative()
  while (this.peek('+', '-')) {
    var op = this.consume()
    left = new OperatorNode(op.value, [left, this.multiplicative()])
  }
  return left
}

Parser.prototype.multiplicative = function () {
  var op, right
  var left = this.unary()
  while (this.peek('*', '/', '%')) {
    op = this.consume()
    left = new OperatorNode(op.value, [left, this.unary()])
  }

  // implicit multiplication
  // - 2 x
  // - 2(x)
  // - (2)2
  if (this.current().type === tokenType.SYMBOL ||
      this.peek('(') ||
      (!(left.type instanceof ConstantNode) && this.current().type === tokenType.NUMBER)
      ) {
    right = this.multiplicative()
    return new OperatorNode('*', [left, right])
  }

  return left
}

Parser.prototype.unary = function () {
  if (this.peek('-', '+', '~')) {
    var op = this.consume()
    var right = this.unary()
    return new UnaryNode(op.value, right)
  }
  return this.pow()
}

Parser.prototype.pow = function () {
  var left = this.factorial()
  if (this.peek('^', '**')) {
    var op = this.consume()
    var right = this.unary()
    return new OperatorNode(op.value, [left, right])
  }
  return left
}

Parser.prototype.factorial = function () {
  var left = this.symbol()
  if (this.peek('!')) {
    var op = this.consume()
    return new OperatorNode(op.value, [left])
  }
  return left
}

Parser.prototype.symbol = function () {
  var current = this.current()
  if (current.type === tokenType.SYMBOL) {
    var symbol = this.consume()
    var node = this.functionCall(symbol)
    return node
  }
  return this.string()
}

Parser.prototype.functionCall = function (symbolToken) {
  var name = symbolToken.value
  if (this.peek('(')) {
    this.consume()
    var params = []
    while (!this.peek(')') && !this.isEOF()) {
      params.push(this.assignment())
      if (this.peek(',')) {
        this.consume()
      }
    }
    this.expect(')')
    return new FunctionNode(name, params)
  }
  return new SymbolNode(name)
}

Parser.prototype.string = function () {
  if (this.current().type === tokenType.STRING) {
    return new ConstantNode(this.consume().value, 'string')
  }
  return this.array()
}

Parser.prototype.array = function () {
  if (this.peek('[')) {
    this.consume()
    var params = []
    while (!this.peek(']') && !this.isEOF()) {
      params.push(this.assignment())
      if (this.peek(',')) {
        this.consume()
      }
    }
    this.expect(']')
    return new ArrayNode(params)
  }
  return this.number()
}

Parser.prototype.number = function () {
  var token = this.current()
  if (token.type === tokenType.NUMBER) {
    return new ConstantNode(this.consume().value, 'number')
  }
  return this.parentheses()
}

Parser.prototype.parentheses = function () {
  var token = this.current()
  if (token.value === '(') {
    this.consume()
    var left = this.assignment()
    this.expect(')')
    return left
  }
  return this.end()
}

Parser.prototype.end = function () {
  var token = this.current()
  if (token.type !== tokenType.EOF) {
    throw Error('unexpected end of expression')
  }
}

module.exports = Parser


/***/ }),

/***/ 3862:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Node = __webpack_require__(7111)

function ArrayNode (nodes) {
  this.nodes = nodes
}

ArrayNode.prototype = Object.create(Node.prototype)

ArrayNode.prototype.type = 'ArrayNode'

module.exports = ArrayNode


/***/ }),

/***/ 3262:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Node = __webpack_require__(7111)

function AssignmentNode (name, expr) {
  this.name = name
  this.expr = expr
}

AssignmentNode.prototype = Object.create(Node.prototype)

AssignmentNode.prototype.type = 'AssignmentNode'

module.exports = AssignmentNode


/***/ }),

/***/ 2962:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Node = __webpack_require__(7111)

function BlockNode (blocks) {
  this.blocks = blocks
}

BlockNode.prototype = Object.create(Node.prototype)

BlockNode.prototype.type = 'BlockNode'

module.exports = BlockNode


/***/ }),

/***/ 9322:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Node = __webpack_require__(7111)

function ConditionalNode (predicate, truthy, falsy) {
  this.condition = predicate
  this.trueExpr = truthy
  this.falseExpr = falsy
}

ConditionalNode.prototype = Object.create(Node.prototype)

ConditionalNode.prototype.type = 'ConditionalNode'

module.exports = ConditionalNode


/***/ }),

/***/ 6311:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Node = __webpack_require__(7111)

var SUPPORTED_TYPES = {
  number: true,
  string: true,
  'boolean': true,
  'undefined': true,
  'null': true
}

function ConstantNode (value, type) {
  if (!SUPPORTED_TYPES[type]) {
    throw Error('unsupported type \'' + type + '\'')
  }
  this.value = value
  this.valueType = type
}

ConstantNode.prototype = Object.create(Node.prototype)

ConstantNode.prototype.type = 'ConstantNode'

module.exports = ConstantNode


/***/ }),

/***/ 8935:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Node = __webpack_require__(7111)

function FunctionNode (name, args) {
  this.name = name
  this.args = args
}

FunctionNode.prototype = Object.create(Node.prototype)

FunctionNode.prototype.type = 'FunctionNode'

module.exports = FunctionNode


/***/ }),

/***/ 7111:
/***/ ((module) => {

function Node () {

}

Node.prototype.type = 'Node'

module.exports = Node


/***/ }),

/***/ 6565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Node = __webpack_require__(7111)

function OperatorNode (op, args) {
  this.op = op
  this.args = args || []
}

OperatorNode.prototype = Object.create(Node.prototype)

OperatorNode.prototype.type = 'OperatorNode'

module.exports = OperatorNode


/***/ }),

/***/ 2514:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Node = __webpack_require__(7111)

function SymbolNode (name) {
  this.name = name
}

SymbolNode.prototype = Object.create(Node.prototype)

SymbolNode.prototype.type = 'SymbolNode'

module.exports = SymbolNode


/***/ }),

/***/ 5543:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Node = __webpack_require__(7111)

function UnaryNode (op, argument) {
  this.op = op
  this.argument = argument
}

UnaryNode.prototype = Object.create(Node.prototype)

UnaryNode.prototype.type = 'UnaryNode'

module.exports = UnaryNode


/***/ }),

/***/ 3450:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  ArrayNode: __webpack_require__(3862),
  AssignmentNode: __webpack_require__(3262),
  BlockNode: __webpack_require__(2962),
  ConditionalNode: __webpack_require__(9322),
  ConstantNode: __webpack_require__(6311),
  FunctionNode: __webpack_require__(8935),
  Node: __webpack_require__(7111),
  OperatorNode: __webpack_require__(6565),
  SymbolNode: __webpack_require__(2514),
  UnaryNode: __webpack_require__(5543)
}


/***/ }),

/***/ 5054:
/***/ ((module) => {

module.exports = {
  EOF: 0,
  DELIMITER: 1,
  NUMBER: 2,
  STRING: 3,
  SYMBOL: 4
}


/***/ }),

/***/ 3093:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var doubleBits = __webpack_require__(4635)

var SMALLEST_DENORM = Math.pow(2, -1074)
var UINT_MAX = (-1)>>>0

module.exports = nextafter

function nextafter(x, y) {
  if(isNaN(x) || isNaN(y)) {
    return NaN
  }
  if(x === y) {
    return x
  }
  if(x === 0) {
    if(y < 0) {
      return -SMALLEST_DENORM
    } else {
      return SMALLEST_DENORM
    }
  }
  var hi = doubleBits.hi(x)
  var lo = doubleBits.lo(x)
  if((y > x) === (x > 0)) {
    if(lo === UINT_MAX) {
      hi += 1
      lo = 0
    } else {
      lo += 1
    }
  } else {
    if(lo === 0) {
      lo = UINT_MAX
      hi -= 1
    } else {
      lo -= 1
    }
  }
  return doubleBits.pack(lo, hi)
}

/***/ }),

/***/ 4447:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ym: () => (/* binding */ hsl)
/* harmony export */ });
/* unused harmony exports Color, darker, brighter, default, rgbConvert, rgb, Rgb, hslConvert */
/* harmony import */ var _define_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9531);


function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
    reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
    reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
    reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
    reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
    reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

(0,_define_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex, // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHex8() {
  return this.rgb().formatHex8();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
      : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
      : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
      : null) // invalid hex
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

(0,_define_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(Rgb, rgb, (0,_define_js__WEBPACK_IMPORTED_MODULE_0__/* .extend */ .l)(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return (-0.5 <= this.r && this.r < 255.5)
        && (-0.5 <= this.g && this.g < 255.5)
        && (-0.5 <= this.b && this.b < 255.5)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}

function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}

function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}

function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}

function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}

function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

(0,_define_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(Hsl, hsl, (0,_define_js__WEBPACK_IMPORTED_MODULE_0__/* .extend */ .l)(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));

function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}

function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}


/***/ }),

/***/ 9531:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   l: () => (/* binding */ extend)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}


/***/ })

}]);
//# sourceMappingURL=117.function-plot.js.map