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
/******/ 	var __webpack_modules__ = ({

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

/***/ 7187:
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
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

/***/ 360:
/***/ (() => {

// @ts-ignore-file
// issue: https://github.com/maurizzzio/function-plot/issues/6
// solution: the line type is selecting the derivative line when the content is re-drawn, then when the
// derivative was redrawn an already selected line (by the line type) was used thus making a single line
// disappear from the graph, to avoid the selection of the derivative line the selector needs to
// work only for immediate children which is done with `:scope >`
// src: http://stackoverflow.com/questions/6481612/queryselector-search-immediate-children
/*eslint-disable */
if (typeof window !== 'undefined')
    (function (doc, proto) {
        try { // check if browser supports :scope natively
            doc.querySelector(':scope body');
        }
        catch (err) { // polyfill native methods if it doesn't
            ['querySelector', 'querySelectorAll'].forEach(function (method) {
                // @ts-ignore
                const native = proto[method];
                // @ts-ignore
                proto[method] = function (selectors) {
                    if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
                        const id = this.id; // remember current element id
                        this.id = 'ID_' + Date.now(); // assign new unique id
                        selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
                        // @ts-ignore
                        const result = doc[method](selectors);
                        this.id = id; // restore previous id
                        return result;
                    }
                    else {
                        return native.call(this, selectors); // use native code for other selectors
                    }
                };
            });
        }
    })(window.document, Element.prototype);
// @ts-ignore-end
/* eslint-enable */


/***/ }),

/***/ 4763:
/***/ ((module) => {

/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = Worker;

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
/************************************************************************/
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
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + "asyncIntervalEvaluator" + ".function-plot.js";
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ functionPlot)
});

// UNUSED EXPORTS: Chart, EvalBuiltIn, EvalInterval, GraphTypeInterval, GraphTypePolyline, GraphTypeScatter, registerGraphType, withWebWorkers

// EXTERNAL MODULE: ./src/polyfills.ts
var polyfills = __webpack_require__(360);
// EXTERNAL MODULE: ./node_modules/web-worker/cjs/browser.js
var browser = __webpack_require__(4763);
var browser_default = /*#__PURE__*/__webpack_require__.n(browser);
;// CONCATENATED MODULE: ./src/samplers/interval_worker_pool.ts

var BackpressureStrategy;
(function (BackpressureStrategy) {
    BackpressureStrategy["None"] = "none";
    BackpressureStrategy["InvalidateSeenScan"] = "invalidateSeenScan";
    BackpressureStrategy["InvalidateSeenMap"] = "invalidateSeenMap";
    BackpressureStrategy["InvalidateSeenLimit"] = "invalidateSeenLimit";
})(BackpressureStrategy || (BackpressureStrategy = {}));
function getTaskId(task) {
    return task.d.index * 1000 + task.nGroup;
}
class IntervalWorkerPool {
    tasks;
    idleWorkers;
    resolves;
    rejects;
    taskIdToIdx;
    nTasks;
    backpressure;
    constructor(nThreads) {
        this.nTasks = 0;
        this.idleWorkers = [];
        this.tasks = [];
        this.resolves = new Map();
        this.rejects = new Map();
        this.backpressure = BackpressureStrategy.InvalidateSeenScan;
        this.taskIdToIdx = new Map();
        for (let i = 0; i < nThreads; i += 1) {
            // NOTE: new URL(...) cannot be a variable!
            // This is a requirement for the webpack worker loader
            const worker = new (browser_default())(new URL(/* webpackChunkName: "asyncIntervalEvaluator" */ /* worker import */ __webpack_require__.p + __webpack_require__.u(757), __webpack_require__.b), { type: undefined });
            worker.onmessage = (messageEvent) => {
                const { interval2d, nTask } = messageEvent.data;
                this.resolves[nTask](interval2d);
                delete this.resolves[nTask];
                this.idleWorkers.push(worker);
                this.drain();
            };
            this.idleWorkers.push(worker);
        }
    }
    setBackpressure(backpressure) {
        this.backpressure = backpressure;
        return this;
    }
    terminate() {
        for (let i = 0; i < this.idleWorkers.length; i += 1) {
            this.idleWorkers[i].terminate();
        }
    }
    queue(task) {
        task.nTask = this.nTasks;
        task.valid = true;
        if (this.backpressure === BackpressureStrategy.None) {
            // push a new task to the queue regardless of its capacity.
            this.tasks.push(task);
        }
        // invalidate cache with a linear scan.
        if (this.backpressure === BackpressureStrategy.InvalidateSeenScan) {
            // push a new task after invalidating all the previous ones
            for (let i = 0; i < this.tasks.length; i += 1) {
                if (getTaskId(this.tasks[i]) === getTaskId(task)) {
                    this.tasks[i].valid = false;
                }
            }
            this.tasks.push(task);
        }
        // invalidate backpressure with map
        if (this.backpressure === BackpressureStrategy.InvalidateSeenMap) {
            // push a new task after invalidating all the previous ones (with a map)
            const taskId = getTaskId(task);
            if (!this.taskIdToIdx.has(taskId)) {
                this.taskIdToIdx.set(taskId, []);
            }
            const oldTasks = this.taskIdToIdx.get(taskId);
            while (oldTasks.length > 0) {
                const oldTask = oldTasks.shift();
                oldTask.valid = false;
            }
            oldTasks.push(task);
            this.tasks.push(task);
        }
        // invalidate cache with capacity
        if (this.backpressure === BackpressureStrategy.InvalidateSeenLimit) {
            // keep the capacity bounded to at most 100 items
            for (let i = this.tasks.length - 100; i >= 0; i -= 1) {
                this.tasks[i].valid = false;
            }
            this.tasks.push(task);
        }
        const p = new Promise((resolve, reject) => {
            this.resolves[task.nTask] = resolve;
            this.rejects[task.nTask] = reject;
        });
        this.nTasks += 1;
        this.drain();
        return p;
    }
    drain() {
        while (this.hasWork()) {
            const task = this.tasks.shift();
            if (!task.valid) {
                // This task is no longer valid (because there's a newer task)
                // resolve with the input value.
                this.resolves[task.nTask](task.interval2d.buffer);
                continue;
            }
            const idleWorker = this.idleWorkers.shift();
            // console.log(`working on task ${task.nTask}`)
            const dStripped = {};
            dStripped.fn = task.d.fn;
            dStripped.scope = task.d.scope;
            idleWorker.postMessage(
            // prettier-ignore
            {
                d: dStripped,
                lo: task.lo,
                hi: task.hi,
                n: task.n,
                nTask: task.nTask,
                interval2d: task.interval2d
            }, [task.interval2d.buffer]);
        }
    }
    hasWork() {
        return this.tasks.length > 0 && this.idleWorkers.length > 0;
    }
}

;// CONCATENATED MODULE: ./node_modules/d3-shape/src/array.js
var slice = Array.prototype.slice;

/* harmony default export */ function array(x) {
  return typeof x === "object" && "length" in x
    ? x // Array, TypedArray, NodeList, array-like
    : Array.from(x); // Map, Set, iterable, string, or anything else
}

;// CONCATENATED MODULE: ./node_modules/d3-shape/src/constant.js
/* harmony default export */ function src_constant(x) {
  return function constant() {
    return x;
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-shape/src/curve/linear.js
function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // falls through
      default: this._context.lineTo(x, y); break;
    }
  }
};

/* harmony default export */ function linear(context) {
  return new Linear(context);
}

;// CONCATENATED MODULE: ./node_modules/d3-path/src/path.js
const pi = Math.PI,
    tau = 2 * pi,
    epsilon = 1e-6,
    tauEpsilon = tau - epsilon;

function append(strings) {
  this._ += strings[0];
  for (let i = 1, n = strings.length; i < n; ++i) {
    this._ += arguments[i] + strings[i];
  }
}

function appendRound(digits) {
  let d = Math.floor(digits);
  if (!(d >= 0)) throw new Error(`invalid digits: ${digits}`);
  if (d > 15) return append;
  const k = 10 ** d;
  return function(strings) {
    this._ += strings[0];
    for (let i = 1, n = strings.length; i < n; ++i) {
      this._ += Math.round(arguments[i] * k) / k + strings[i];
    }
  };
}

class Path {
  constructor(digits) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = "";
    this._append = digits == null ? append : appendRound(digits);
  }
  moveTo(x, y) {
    this._append`M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._append`Z`;
    }
  }
  lineTo(x, y) {
    this._append`L${this._x1 = +x},${this._y1 = +y}`;
  }
  quadraticCurveTo(x1, y1, x, y) {
    this._append`Q${+x1},${+y1},${this._x1 = +x},${this._y1 = +y}`;
  }
  bezierCurveTo(x1, y1, x2, y2, x, y) {
    this._append`C${+x1},${+y1},${+x2},${+y2},${this._x1 = +x},${this._y1 = +y}`;
  }
  arcTo(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;

    // Is the radius negative? Error.
    if (r < 0) throw new Error(`negative radius: ${r}`);

    let x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._append`M${this._x1 = x1},${this._y1 = y1}`;
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon));

    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
    // Equivalently, is (x1,y1) coincident with (x2,y2)?
    // Or, is the radius zero? Line to (x1,y1).
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
      this._append`L${this._x1 = x1},${this._y1 = y1}`;
    }

    // Otherwise, draw an arc!
    else {
      let x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon) {
        this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`;
      }

      this._append`A${r},${r},0,0,${+(y01 * x20 > x01 * y20)},${this._x1 = x1 + t21 * x21},${this._y1 = y1 + t21 * y21}`;
    }
  }
  arc(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r, ccw = !!ccw;

    // Is the radius negative? Error.
    if (r < 0) throw new Error(`negative radius: ${r}`);

    let dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._append`M${x0},${y0}`;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._append`L${x0},${y0}`;
    }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._append`A${r},${r},0,1,${cw},${x - dx},${y - dy}A${r},${r},0,1,${cw},${this._x1 = x0},${this._y1 = y0}`;
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
      this._append`A${r},${r},0,${+(da >= pi)},${cw},${this._x1 = x + r * Math.cos(a1)},${this._y1 = y + r * Math.sin(a1)}`;
    }
  }
  rect(x, y, w, h) {
    this._append`M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${w = +w}v${+h}h${-w}Z`;
  }
  toString() {
    return this._;
  }
}

function path() {
  return new Path;
}

// Allow instanceof d3.path
path.prototype = Path.prototype;

function pathRound(digits = 3) {
  return new Path(+digits);
}

;// CONCATENATED MODULE: ./node_modules/d3-shape/src/path.js


function withPath(shape) {
  let digits = 3;

  shape.digits = function(_) {
    if (!arguments.length) return digits;
    if (_ == null) {
      digits = null;
    } else {
      const d = Math.floor(_);
      if (!(d >= 0)) throw new RangeError(`invalid digits: ${_}`);
      digits = d;
    }
    return shape;
  };

  return () => new Path(digits);
}

;// CONCATENATED MODULE: ./node_modules/d3-shape/src/point.js
function point_x(p) {
  return p[0];
}

function point_y(p) {
  return p[1];
}

;// CONCATENATED MODULE: ./node_modules/d3-shape/src/line.js






/* harmony default export */ function src_line(x, y) {
  var defined = src_constant(true),
      context = null,
      curve = linear,
      output = null,
      path = withPath(line);

  x = typeof x === "function" ? x : (x === undefined) ? point_x : src_constant(x);
  y = typeof y === "function" ? y : (y === undefined) ? point_y : src_constant(y);

  function line(data) {
    var i,
        n = (data = array(data)).length,
        d,
        defined0 = false,
        buffer;

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();
        else output.lineEnd();
      }
      if (defined0) output.point(+x(d, i, data), +y(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function(_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : src_constant(+_), line) : x;
  };

  line.y = function(_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : src_constant(+_), line) : y;
  };

  line.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : src_constant(!!_), line) : defined;
  };

  line.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/formatDecimal.js
/* harmony default export */ function formatDecimal(x) {
  return Math.abs(x = Math.round(x)) >= 1e21
      ? x.toLocaleString("en").replace(/,/g, "")
      : x.toString(10);
}

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimalParts(1.23) returns ["123", 0].
function formatDecimalParts(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/exponent.js


/* harmony default export */ function exponent(x) {
  return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/formatGroup.js
/* harmony default export */ function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/formatNumerals.js
/* harmony default export */ function formatNumerals(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/formatSpecifier.js
// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
  this.align = specifier.align === undefined ? ">" : specifier.align + "";
  this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === undefined ? undefined : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === undefined ? "" : specifier.type + "";
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width === undefined ? "" : Math.max(1, this.width | 0))
      + (this.comma ? "," : "")
      + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
      + (this.trim ? "~" : "")
      + this.type;
};

;// CONCATENATED MODULE: ./node_modules/d3-format/src/formatTrim.js
// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
/* harmony default export */ function formatTrim(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
    }
  }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/formatPrefixAuto.js


var prefixExponent;

/* harmony default export */ function formatPrefixAuto(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient
      : i > n ? coefficient + new Array(i - n + 1).join("0")
      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
      : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/formatRounded.js


/* harmony default export */ function formatRounded(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/formatTypes.js




/* harmony default export */ const formatTypes = ({
  "%": (x, p) => (x * 100).toFixed(p),
  "b": (x) => Math.round(x).toString(2),
  "c": (x) => x + "",
  "d": formatDecimal,
  "e": (x, p) => x.toExponential(p),
  "f": (x, p) => x.toFixed(p),
  "g": (x, p) => x.toPrecision(p),
  "o": (x) => Math.round(x).toString(8),
  "p": (x, p) => formatRounded(x * 100, p),
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": (x) => Math.round(x).toString(16).toUpperCase(),
  "x": (x) => Math.round(x).toString(16)
});

;// CONCATENATED MODULE: ./node_modules/d3-format/src/identity.js
/* harmony default export */ function identity(x) {
  return x;
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/locale.js









var map = Array.prototype.map,
    prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

/* harmony default export */ function locale(locale) {
  var group = locale.grouping === undefined || locale.thousands === undefined ? identity : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
      currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
      currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
      decimal = locale.decimal === undefined ? "." : locale.decimal + "",
      numerals = locale.numerals === undefined ? identity : formatNumerals(map.call(locale.numerals, String)),
      percent = locale.percent === undefined ? "%" : locale.percent + "",
      minus = locale.minus === undefined ? "−" : locale.minus + "",
      nan = locale.nan === undefined ? "NaN" : locale.nan + "";

  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type;

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision === undefined ? 6
        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i, n, c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Determine the sign. -0 is not less than 0, but 1 / -0 is!
        var valueNegative = value < 0 || 1 / value < 0;

        // Perform the initial formatting.
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

        // Trim insignificant zeros.
        if (trim) value = formatTrim(value);

        // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
        if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<": value = valuePrefix + value + valueSuffix + padding; break;
        case "=": value = valuePrefix + padding + value + valueSuffix; break;
        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
        default: value = padding + valuePrefix + value + valueSuffix; break;
      }

      return numerals(value);
    }

    format.toString = function() {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function(value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/defaultLocale.js


var defaultLocale_locale;
var format;
var formatPrefix;

defaultLocale({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  defaultLocale_locale = locale(definition);
  format = defaultLocale_locale.format;
  formatPrefix = defaultLocale_locale.formatPrefix;
  return defaultLocale_locale;
}

;// CONCATENATED MODULE: ./node_modules/d3-array/src/ticks.js
const e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function tickSpec(start, stop, count) {
  const step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log10(step)),
      error = step / Math.pow(10, power),
      factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  let i1, i2, inc;
  if (power < 0) {
    inc = Math.pow(10, -power) / factor;
    i1 = Math.round(start * inc);
    i2 = Math.round(stop * inc);
    if (i1 / inc < start) ++i1;
    if (i2 / inc > stop) --i2;
    inc = -inc;
  } else {
    inc = Math.pow(10, power) * factor;
    i1 = Math.round(start / inc);
    i2 = Math.round(stop / inc);
    if (i1 * inc < start) ++i1;
    if (i2 * inc > stop) --i2;
  }
  if (i2 < i1 && 0.5 <= count && count < 2) return tickSpec(start, stop, count * 2);
  return [i1, i2, inc];
}

function ticks(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  if (!(count > 0)) return [];
  if (start === stop) return [start];
  const reverse = stop < start, [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
  if (!(i2 >= i1)) return [];
  const n = i2 - i1 + 1, ticks = new Array(n);
  if (reverse) {
    if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) / -inc;
    else for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) * inc;
  } else {
    if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) / -inc;
    else for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) * inc;
  }
  return ticks;
}

function tickIncrement(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  return tickSpec(start, stop, count)[2];
}

function tickStep(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  const reverse = stop < start, inc = reverse ? tickIncrement(stop, start, count) : tickIncrement(start, stop, count);
  return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}

;// CONCATENATED MODULE: ./node_modules/d3-array/src/ascending.js
function ascending(a, b) {
  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

;// CONCATENATED MODULE: ./node_modules/d3-array/src/descending.js
function descending(a, b) {
  return a == null || b == null ? NaN
    : b < a ? -1
    : b > a ? 1
    : b >= a ? 0
    : NaN;
}

;// CONCATENATED MODULE: ./node_modules/d3-array/src/bisector.js



function bisector(f) {
  let compare1, compare2, delta;

  // If an accessor is specified, promote it to a comparator. In this case we
  // can test whether the search value is (self-) comparable. We can’t do this
  // for a comparator (except for specific, known comparators) because we can’t
  // tell if the comparator is symmetric, and an asymmetric comparator can’t be
  // used to test whether a single value is comparable.
  if (f.length !== 2) {
    compare1 = ascending;
    compare2 = (d, x) => ascending(f(d), x);
    delta = (d, x) => f(d) - x;
  } else {
    compare1 = f === ascending || f === descending ? f : zero;
    compare2 = f;
    delta = f;
  }

  function left(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0) return hi;
      do {
        const mid = (lo + hi) >>> 1;
        if (compare2(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      } while (lo < hi);
    }
    return lo;
  }

  function right(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0) return hi;
      do {
        const mid = (lo + hi) >>> 1;
        if (compare2(a[mid], x) <= 0) lo = mid + 1;
        else hi = mid;
      } while (lo < hi);
    }
    return lo;
  }

  function center(a, x, lo = 0, hi = a.length) {
    const i = left(a, x, lo, hi - 1);
    return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
  }

  return {left, center, right};
}

function zero() {
  return 0;
}

;// CONCATENATED MODULE: ./node_modules/d3-array/src/number.js
function number(x) {
  return x === null ? NaN : +x;
}

function* numbers(values, valueof) {
  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        yield value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
        yield value;
      }
    }
  }
}

;// CONCATENATED MODULE: ./node_modules/d3-array/src/bisect.js




const ascendingBisect = bisector(ascending);
const bisectRight = ascendingBisect.right;
const bisectLeft = ascendingBisect.left;
const bisectCenter = bisector(number).center;
/* harmony default export */ const bisect = (bisectRight);

;// CONCATENATED MODULE: ./node_modules/d3-color/src/define.js
/* harmony default export */ function src_define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

;// CONCATENATED MODULE: ./node_modules/d3-color/src/color.js


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

src_define(Color, color, {
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

function color_rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

src_define(Rgb, color_rgb, extend(Color, {
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

src_define(Hsl, hsl, extend(Color, {
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

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/basis.js
function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0
      + (4 - 6 * t2 + 3 * t3) * v1
      + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
      + t3 * v3) / 6;
}

/* harmony default export */ function src_basis(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/basisClosed.js


/* harmony default export */ function basisClosed(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
        v0 = values[(i + n - 1) % n],
        v1 = values[i % n],
        v2 = values[(i + 1) % n],
        v3 = values[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/constant.js
/* harmony default export */ const d3_interpolate_src_constant = (x => () => x);

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/color.js


function color_linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? color_linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : d3_interpolate_src_constant(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? color_linear(a, d) : d3_interpolate_src_constant(isNaN(a) ? b : a);
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/rgb.js





/* harmony default export */ const rgb = ((function rgbGamma(y) {
  var color = gamma(y);

  function rgb(start, end) {
    var r = color((start = color_rgb(start)).r, (end = color_rgb(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb.gamma = rgbGamma;

  return rgb;
})(1));

function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i, color;
    for (i = 0; i < n; ++i) {
      color = color_rgb(colors[i]);
      r[i] = color.r || 0;
      g[i] = color.g || 0;
      b[i] = color.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color.opacity = 1;
    return function(t) {
      color.r = r(t);
      color.g = g(t);
      color.b = b(t);
      return color + "";
    };
  };
}

var rgbBasis = rgbSpline(src_basis);
var rgbBasisClosed = rgbSpline(basisClosed);

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/array.js



/* harmony default export */ function src_array(a, b) {
  return (isNumberArray(b) ? numberArray : genericArray)(a, b);
}

function genericArray(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = value(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];

  return function(t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);
    return c;
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/date.js
/* harmony default export */ function date(a, b) {
  var d = new Date;
  return a = +a, b = +b, function(t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/number.js
/* harmony default export */ function src_number(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/object.js


/* harmony default export */ function object(a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = value(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/string.js


var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function string_zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

/* harmony default export */ function string(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: src_number(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : string_zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/numberArray.js
/* harmony default export */ function src_numberArray(a, b) {
  if (!b) b = [];
  var n = a ? Math.min(b.length, a.length) : 0,
      c = b.slice(),
      i;
  return function(t) {
    for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
    return c;
  };
}

function numberArray_isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/value.js










/* harmony default export */ function value(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? d3_interpolate_src_constant(b)
      : (t === "number" ? src_number
      : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
      : b instanceof color ? rgb
      : b instanceof Date ? date
      : numberArray_isNumberArray(b) ? src_numberArray
      : Array.isArray(b) ? genericArray
      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
      : src_number)(a, b);
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/round.js
/* harmony default export */ function round(a, b) {
  return a = +a, b = +b, function(t) {
    return Math.round(a * (1 - t) + b * t);
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-scale/src/constant.js
function constants(x) {
  return function() {
    return x;
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-scale/src/number.js
function number_number(x) {
  return +x;
}

;// CONCATENATED MODULE: ./node_modules/d3-scale/src/continuous.js





var unit = [0, 1];

function continuous_identity(x) {
  return x;
}

function normalize(a, b) {
  return (b -= (a = +a))
      ? function(x) { return (x - a) / b; }
      : constants(isNaN(b) ? NaN : 0.5);
}

function clamper(a, b) {
  var t;
  if (a > b) t = a, a = b, b = t;
  return function(x) { return Math.max(a, Math.min(b, x)); };
}

// normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
function bimap(domain, range, interpolate) {
  var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
  if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
  else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
  return function(x) { return r0(d0(x)); };
}

function polymap(domain, range, interpolate) {
  var j = Math.min(domain.length, range.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = normalize(domain[i], domain[i + 1]);
    r[i] = interpolate(range[i], range[i + 1]);
  }

  return function(x) {
    var i = bisect(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target
      .domain(source.domain())
      .range(source.range())
      .interpolate(source.interpolate())
      .clamp(source.clamp())
      .unknown(source.unknown());
}

function transformer() {
  var domain = unit,
      range = unit,
      interpolate = value,
      transform,
      untransform,
      unknown,
      clamp = continuous_identity,
      piecewise,
      output,
      input;

  function rescale() {
    var n = Math.min(domain.length, range.length);
    if (clamp !== continuous_identity) clamp = clamper(domain[0], domain[n - 1]);
    piecewise = n > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
  }

  scale.invert = function(y) {
    return clamp(untransform((input || (input = piecewise(range, domain.map(transform), src_number)))(y)));
  };

  scale.domain = function(_) {
    return arguments.length ? (domain = Array.from(_, number_number), rescale()) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
  };

  scale.rangeRound = function(_) {
    return range = Array.from(_), interpolate = round, rescale();
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = _ ? true : continuous_identity, rescale()) : clamp !== continuous_identity;
  };

  scale.interpolate = function(_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  return function(t, u) {
    transform = t, untransform = u;
    return rescale();
  };
}

function continuous() {
  return transformer()(continuous_identity, continuous_identity);
}

;// CONCATENATED MODULE: ./node_modules/d3-scale/src/init.js
function initRange(domain, range) {
  switch (arguments.length) {
    case 0: break;
    case 1: this.range(domain); break;
    default: this.range(range).domain(domain); break;
  }
  return this;
}

function initInterpolator(domain, interpolator) {
  switch (arguments.length) {
    case 0: break;
    case 1: {
      if (typeof domain === "function") this.interpolator(domain);
      else this.range(domain);
      break;
    }
    default: {
      this.domain(domain);
      if (typeof interpolator === "function") this.interpolator(interpolator);
      else this.range(interpolator);
      break;
    }
  }
  return this;
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/precisionPrefix.js


/* harmony default export */ function precisionPrefix(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/precisionRound.js


/* harmony default export */ function precisionRound(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
}

;// CONCATENATED MODULE: ./node_modules/d3-format/src/precisionFixed.js


/* harmony default export */ function precisionFixed(step) {
  return Math.max(0, -exponent(Math.abs(step)));
}

;// CONCATENATED MODULE: ./node_modules/d3-scale/src/tickFormat.js



function tickFormat(start, stop, count, specifier) {
  var step = tickStep(start, stop, count),
      precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format(specifier);
}

;// CONCATENATED MODULE: ./node_modules/d3-scale/src/linear.js





function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function(count, specifier) {
    var d = domain();
    return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
  };

  scale.nice = function(count) {
    if (count == null) count = 10;

    var d = domain();
    var i0 = 0;
    var i1 = d.length - 1;
    var start = d[i0];
    var stop = d[i1];
    var prestep;
    var step;
    var maxIter = 10;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }
    
    while (maxIter-- > 0) {
      step = tickIncrement(start, stop, count);
      if (step === prestep) {
        d[i0] = start
        d[i1] = stop
        return domain(d);
      } else if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      } else {
        break;
      }
      prestep = step;
    }

    return scale;
  };

  return scale;
}

function linear_linear() {
  var scale = continuous();

  scale.copy = function() {
    return copy(scale, linear_linear());
  };

  initRange.apply(scale, arguments);

  return linearish(scale);
}

;// CONCATENATED MODULE: ./node_modules/d3-scale/src/nice.js
function nice(domain, interval) {
  domain = domain.slice();

  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}

;// CONCATENATED MODULE: ./node_modules/d3-scale/src/log.js






function transformLog(x) {
  return Math.log(x);
}

function transformExp(x) {
  return Math.exp(x);
}

function transformLogn(x) {
  return -Math.log(-x);
}

function transformExpn(x) {
  return -Math.exp(-x);
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10
      : base === Math.E ? Math.exp
      : x => Math.pow(base, x);
}

function logp(base) {
  return base === Math.E ? Math.log
      : base === 10 && Math.log10
      || base === 2 && Math.log2
      || (base = Math.log(base), x => Math.log(x) / base);
}

function reflect(f) {
  return (x, k) => -f(-x, k);
}

function loggish(transform) {
  const scale = transform(transformLog, transformExp);
  const domain = scale.domain;
  let base = 10;
  let logs;
  let pows;

  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) {
      logs = reflect(logs), pows = reflect(pows);
      transform(transformLogn, transformExpn);
    } else {
      transform(transformLog, transformExp);
    }
    return scale;
  }

  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = count => {
    const d = domain();
    let u = d[0];
    let v = d[d.length - 1];
    const r = v < u;

    if (r) ([u, v] = [v, u]);

    let i = logs(u);
    let j = logs(v);
    let k;
    let t;
    const n = count == null ? 10 : +count;
    let z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.floor(i), j = Math.ceil(j);
      if (u > 0) for (; i <= j; ++i) {
        for (k = 1; k < base; ++k) {
          t = i < 0 ? k / pows(-i) : k * pows(i);
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i <= j; ++i) {
        for (k = base - 1; k >= 1; --k) {
          t = i > 0 ? k / pows(-i) : k * pows(i);
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
      if (z.length * 2 < n) z = ticks(u, v, n);
    } else {
      z = ticks(i, j, Math.min(j - i, n)).map(pows);
    }
    return r ? z.reverse() : z;
  };

  scale.tickFormat = (count, specifier) => {
    if (count == null) count = 10;
    if (specifier == null) specifier = base === 10 ? "s" : ",";
    if (typeof specifier !== "function") {
      if (!(base % 1) && (specifier = formatSpecifier(specifier)).precision == null) specifier.trim = true;
      specifier = format(specifier);
    }
    if (count === Infinity) return specifier;
    const k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
    return d => {
      let i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = () => {
    return domain(nice(domain(), {
      floor: x => pows(Math.floor(logs(x))),
      ceil: x => pows(Math.ceil(logs(x)))
    }));
  };

  return scale;
}

function log() {
  const scale = loggish(transformer()).domain([1, 10]);
  scale.copy = () => copy(scale, log()).base(scale.base());
  initRange.apply(scale, arguments);
  return scale;
}

;// CONCATENATED MODULE: ./node_modules/d3-axis/src/identity.js
/* harmony default export */ function src_identity(x) {
  return x;
}

;// CONCATENATED MODULE: ./node_modules/d3-axis/src/axis.js


var axis_top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    axis_epsilon = 1e-6;

function translateX(x) {
  return "translate(" + x + ",0)";
}

function translateY(y) {
  return "translate(0," + y + ")";
}

function axis_number(scale) {
  return d => +scale(d);
}

function center(scale, offset) {
  offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
  if (scale.round()) offset = Math.round(offset);
  return d => +scale(d) + offset;
}

function entering() {
  return !this.__axis;
}

function axis(orient, scale) {
  var tickArguments = [],
      tickValues = null,
      tickFormat = null,
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 3,
      offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5,
      k = orient === axis_top || orient === left ? -1 : 1,
      x = orient === left || orient === right ? "x" : "y",
      transform = orient === axis_top || orient === bottom ? translateX : translateY;

  function axis(context) {
    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : src_identity) : tickFormat,
        spacing = Math.max(tickSizeInner, 0) + tickPadding,
        range = scale.range(),
        range0 = +range[0] + offset,
        range1 = +range[range.length - 1] + offset,
        position = (scale.bandwidth ? center : axis_number)(scale.copy(), offset),
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text");

    path = path.merge(path.enter().insert("path", ".tick")
        .attr("class", "domain")
        .attr("stroke", "currentColor"));

    tick = tick.merge(tickEnter);

    line = line.merge(tickEnter.append("line")
        .attr("stroke", "currentColor")
        .attr(x + "2", k * tickSizeInner));

    text = text.merge(tickEnter.append("text")
        .attr("fill", "currentColor")
        .attr(x, k * spacing)
        .attr("dy", orient === axis_top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      tickExit = tickExit.transition(context)
          .attr("opacity", axis_epsilon)
          .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d + offset) : this.getAttribute("transform"); });

      tickEnter
          .attr("opacity", axis_epsilon)
          .attr("transform", function(d) { var p = this.parentNode.__axis; return transform((p && isFinite(p = p(d)) ? p : position(d)) + offset); });
    }

    tickExit.remove();

    path
        .attr("d", orient === left || orient === right
            ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1)
            : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1));

    tick
        .attr("opacity", 1)
        .attr("transform", function(d) { return transform(position(d) + offset); });

    line
        .attr(x + "2", k * tickSizeInner);

    text
        .attr(x, k * spacing)
        .text(format);

    selection.filter(entering)
        .attr("fill", "none")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

    selection
        .each(function() { this.__axis = position; });
  }

  axis.scale = function(_) {
    return arguments.length ? (scale = _, axis) : scale;
  };

  axis.ticks = function() {
    return tickArguments = Array.from(arguments), axis;
  };

  axis.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : Array.from(_), axis) : tickArguments.slice();
  };

  axis.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : Array.from(_), axis) : tickValues && tickValues.slice();
  };

  axis.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, axis) : tickFormat;
  };

  axis.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
  };

  axis.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
  };

  axis.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
  };

  axis.offset = function(_) {
    return arguments.length ? (offset = +_, axis) : offset;
  };

  return axis;
}

function axisTop(scale) {
  return axis(axis_top, scale);
}

function axisRight(scale) {
  return axis(right, scale);
}

function axisBottom(scale) {
  return axis(bottom, scale);
}

function axisLeft(scale) {
  return axis(left, scale);
}

;// CONCATENATED MODULE: ./node_modules/d3-dispatch/src/dispatch.js
var noop = {value: () => {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

/* harmony default export */ const src_dispatch = (dispatch);

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selector.js
function none() {}

/* harmony default export */ function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/select.js



/* harmony default export */ function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/array.js
// Given something array like (or null), returns something that is strictly an
// array. This is used to ensure that array-like objects passed to d3.selectAll
// or selection.selectAll are converted into proper arrays when creating a
// selection; we don’t ever want to create a selection backed by a live
// HTMLCollection or NodeList. However, note that selection.selectAll will use a
// static NodeList as a group, since it safely derived from querySelectorAll.
function array_array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selectorAll.js
function empty() {
  return [];
}

/* harmony default export */ function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/selectAll.js




function arrayAll(select) {
  return function() {
    return array_array(select.apply(this, arguments));
  };
}

/* harmony default export */ function selectAll(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/matcher.js
/* harmony default export */ function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}


;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/selectChild.js


var find = Array.prototype.find;

function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}

function childFirst() {
  return this.firstElementChild;
}

/* harmony default export */ function selectChild(match) {
  return this.select(match == null ? childFirst
      : childFind(typeof match === "function" ? match : childMatcher(match)));
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/selectChildren.js


var filter = Array.prototype.filter;

function children() {
  return Array.from(this.children);
}

function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}

/* harmony default export */ function selectChildren(match) {
  return this.selectAll(match == null ? children
      : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/filter.js



/* harmony default export */ function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/sparse.js
/* harmony default export */ function sparse(update) {
  return new Array(update.length);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/enter.js



/* harmony default export */ function enter() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/constant.js
/* harmony default export */ function d3_selection_src_constant(x) {
  return function() {
    return x;
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/data.js




function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = new Map,
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
      exit[i] = node;
    }
  }
}

function datum(node) {
  return node.__data__;
}

/* harmony default export */ function data(value, key) {
  if (!arguments.length) return Array.from(this, datum);

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = d3_selection_src_constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

// Given some data, this returns an array-like view of it: an object that
// exposes a length property and allows numeric indexing. Note that unlike
// selectAll, this isn’t worried about “live” collections because the resulting
// array will only be used briefly while data is being bound. (It is possible to
// cause the data to change while iterating by using a key function, but please
// don’t; we’d rather avoid a gratuitous copy.)
function arraylike(data) {
  return typeof data === "object" && "length" in data
    ? data // Array, TypedArray, NodeList, array-like
    : Array.from(data); // Map, Set, iterable, string, or anything else
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/exit.js



/* harmony default export */ function exit() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/join.js
/* harmony default export */ function join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter) enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update) update = update.selection();
  }
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/merge.js


/* harmony default export */ function merge(context) {
  var selection = context.selection ? context.selection() : context;

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/order.js
/* harmony default export */ function order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/sort.js


/* harmony default export */ function sort(compare) {
  if (!compare) compare = sort_ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
}

function sort_ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/call.js
/* harmony default export */ function call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/nodes.js
/* harmony default export */ function nodes() {
  return Array.from(this);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/node.js
/* harmony default export */ function node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/size.js
/* harmony default export */ function size() {
  let size = 0;
  for (const node of this) ++size; // eslint-disable-line no-unused-vars
  return size;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/empty.js
/* harmony default export */ function selection_empty() {
  return !this.node();
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/each.js
/* harmony default export */ function each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";

/* harmony default export */ const namespaces = ({
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
});

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/namespace.js


/* harmony default export */ function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/attr.js


function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

/* harmony default export */ function attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/window.js
/* harmony default export */ function src_window(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/style.js


function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

/* harmony default export */ function style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || src_window(node).getComputedStyle(node, null).getPropertyValue(name);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

/* harmony default export */ function property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

/* harmony default export */ function classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/text.js
function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

/* harmony default export */ function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

/* harmony default export */ function html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/raise.js
function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

/* harmony default export */ function selection_raise() {
  return this.each(raise);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/lower.js
function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

/* harmony default export */ function selection_lower() {
  return this.each(lower);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/creator.js



function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

/* harmony default export */ function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/append.js


/* harmony default export */ function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/insert.js



function constantNull() {
  return null;
}

/* harmony default export */ function insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/remove.js
function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

/* harmony default export */ function selection_remove() {
  return this.each(remove);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

/* harmony default export */ function clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/datum.js
/* harmony default export */ function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}

function on_parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

/* harmony default export */ function on(typename, value, options) {
  var typenames = on_parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
  return this;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/dispatch.js


function dispatchEvent(node, type, params) {
  var window = src_window(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

/* harmony default export */ function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/iterator.js
/* harmony default export */ function* iterator() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/selection/index.js



































var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

function selection_selection() {
  return this;
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selectAll,
  selectChild: selectChild,
  selectChildren: selectChildren,
  filter: selection_filter,
  data: data,
  enter: enter,
  exit: exit,
  join: join,
  merge: merge,
  selection: selection_selection,
  order: order,
  sort: sort,
  call: call,
  nodes: nodes,
  node: node,
  size: size,
  empty: selection_empty,
  each: each,
  attr: attr,
  style: style,
  property: property,
  classed: classed,
  text: selection_text,
  html: html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: insert,
  remove: selection_remove,
  clone: clone,
  datum: selection_datum,
  on: on,
  dispatch: selection_dispatch,
  [Symbol.iterator]: iterator
};

/* harmony default export */ const src_selection = (selection);

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/select.js


/* harmony default export */ function src_select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

;// CONCATENATED MODULE: ./node_modules/d3-drag/src/noevent.js
// These are typically used in conjunction with noevent to ensure that we can
// preventDefault on the event.
const nonpassive = {passive: false};
const nonpassivecapture = {capture: true, passive: false};

function nopropagation(event) {
  event.stopImmediatePropagation();
}

/* harmony default export */ function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

;// CONCATENATED MODULE: ./node_modules/d3-drag/src/nodrag.js



/* harmony default export */ function nodrag(view) {
  var root = view.document.documentElement,
      selection = src_select(view).on("dragstart.drag", noevent, nonpassivecapture);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, nonpassivecapture);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = src_select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, nonpassivecapture);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/zoom.js
var epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}

/* harmony default export */ const src_zoom = ((function zoomRho(rho, rho2, rho4) {

  // p0 = [ux0, uy0, w0]
  // p1 = [ux1, uy1, w1]
  function zoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
        dx = ux1 - ux0,
        dy = uy1 - uy0,
        d2 = dx * dx + dy * dy,
        i,
        S;

    // Special case for u0 ≅ u1.
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      }
    }

    // General case.
    else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      }
    }

    i.duration = S * 1000 * rho / Math.SQRT2;

    return i;
  }

  zoom.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };

  return zoom;
})(Math.SQRT2, 2, 4));

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/sourceEvent.js
/* harmony default export */ function sourceEvent(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}

;// CONCATENATED MODULE: ./node_modules/d3-selection/src/pointer.js


/* harmony default export */ function pointer(event, node) {
  event = sourceEvent(event);
  if (node === undefined) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

;// CONCATENATED MODULE: ./node_modules/d3-timer/src/timer.js
var timer_frame = 0, // is an animation frame pending?
    timeout = 0, // is a timeout pending?
    interval = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++timer_frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
    t = t._next;
  }
  --timer_frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  timer_frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    timer_frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (timer_frame) return; // Soonest alarm already set, or will be.
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    timer_frame = 1, setFrame(wake);
  }
}

;// CONCATENATED MODULE: ./node_modules/d3-timer/src/timeout.js


/* harmony default export */ function src_timeout(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(elapsed => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/schedule.js



var emptyOn = src_dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

/* harmony default export */ function schedule(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = schedule_get(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function schedule_set(node, id) {
  var schedule = schedule_get(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function schedule_get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return src_timeout(start);

      // Interrupt the active transition, if any.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions.
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    src_timeout(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/interrupt.js


/* harmony default export */ function interrupt(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/selection/interrupt.js


/* harmony default export */ function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/transform/decompose.js
var degrees = 180 / Math.PI;

var decompose_identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

/* harmony default export */ function decompose(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/transform/parse.js


var svgNode;

/* eslint-disable no-undef */
function parseCss(value) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? decompose_identity : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
}

function parseSvg(value) {
  if (value == null) return decompose_identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return decompose_identity;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

;// CONCATENATED MODULE: ./node_modules/d3-interpolate/src/transform/index.js



function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: src_number(xa, xb)}, {i: i - 2, x: src_number(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: src_number(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: src_number(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: src_number(xa, xb)}, {i: i - 2, x: src_number(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/tween.js


function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = schedule_set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = schedule_set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

/* harmony default export */ function tween(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = schedule_get(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = schedule_set(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return schedule_get(node, id).value[name];
  };
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/interpolate.js



/* harmony default export */ function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? src_number
      : b instanceof color ? rgb
      : (c = color(b)) ? (b = c, rgb)
      : string)(a, b);
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/attr.js





function attr_attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attr_attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attr_attrConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attr_attrConstantNS(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attr_attrFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attr_attrFunctionNS(fullname, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

/* harmony default export */ function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attr_attrFunctionNS : attr_attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attr_attrRemoveNS : attr_attrRemove)(fullname)
      : (fullname.local ? attr_attrConstantNS : attr_attrConstant)(fullname, i, value));
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/attrTween.js


function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

/* harmony default export */ function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/delay.js


function delayFunction(id, value) {
  return function() {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    init(this, id).delay = value;
  };
}

/* harmony default export */ function delay(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : schedule_get(this.node(), id).delay;
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/duration.js


function durationFunction(id, value) {
  return function() {
    schedule_set(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    schedule_set(this, id).duration = value;
  };
}

/* harmony default export */ function duration(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : schedule_get(this.node(), id).duration;
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/ease.js


function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    schedule_set(this, id).ease = value;
  };
}

/* harmony default export */ function ease(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : schedule_get(this.node(), id).ease;
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/easeVarying.js


function easeVarying(id, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v !== "function") throw new Error;
    schedule_set(this, id).ease = v;
  };
}

/* harmony default export */ function transition_easeVarying(value) {
  if (typeof value !== "function") throw new Error;
  return this.each(easeVarying(this._id, value));
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/filter.js



/* harmony default export */ function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/merge.js


/* harmony default export */ function transition_merge(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/on.js


function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? init : schedule_set;
  return function() {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

/* harmony default export */ function transition_on(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? schedule_get(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/remove.js
function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

/* harmony default export */ function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/select.js




/* harmony default export */ function transition_select(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, schedule_get(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/selectAll.js




/* harmony default export */ function transition_selectAll(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = schedule_get(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/selection.js


var selection_Selection = src_selection.prototype.constructor;

/* harmony default export */ function transition_selection() {
  return new selection_Selection(this._groups, this._parents);
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/style.js






function styleNull(name, interpolate) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function style_styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function style_styleConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function style_styleFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
  return function() {
    var schedule = schedule_set(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = style_styleRemove(name)) : undefined;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

    schedule.on = on1;
  };
}

/* harmony default export */ function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this
      .styleTween(name, styleNull(name, i))
      .on("end.style." + name, style_styleRemove(name))
    : typeof value === "function" ? this
      .styleTween(name, style_styleFunction(name, i, tweenValue(this, "style." + name, value)))
      .each(styleMaybeRemove(this._id, name))
    : this
      .styleTween(name, style_styleConstant(name, i, value), priority)
      .on("end.style." + name, null);
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/styleTween.js
function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}

/* harmony default export */ function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/text.js


function text_textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function text_textFunction(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

/* harmony default export */ function transition_text(value) {
  return this.tween("text", typeof value === "function"
      ? text_textFunction(tweenValue(this, "text", value))
      : text_textConstant(value == null ? "" : value + ""));
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/textTween.js
function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}

/* harmony default export */ function transition_textTween(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, textTween(value));
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/transition.js



/* harmony default export */ function transition() {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = schedule_get(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/end.js


/* harmony default export */ function end() {
  var on0, on1, that = this, id = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = {value: reject},
        end = {value: function() { if (--size === 0) resolve(); }};

    that.each(function() {
      var schedule = schedule_set(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }

      schedule.on = on1;
    });

    // The selection was empty, resolve end immediately
    if (size === 0) resolve();
  });
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/transition/index.js






















var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition_transition(name) {
  return src_selection().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = src_selection.prototype;

Transition.prototype = transition_transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: tween,
  delay: delay,
  duration: duration,
  ease: ease,
  easeVarying: transition_easeVarying,
  end: end,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

;// CONCATENATED MODULE: ./node_modules/d3-ease/src/cubic.js
function cubicIn(t) {
  return t * t * t;
}

function cubicOut(t) {
  return --t * t * t + 1;
}

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/selection/transition.js





var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id} not found`);
    }
  }
  return timing;
}

/* harmony default export */ function selection_transition(name) {
  var id,
      timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/selection/index.js




src_selection.prototype.interrupt = selection_interrupt;
src_selection.prototype.transition = selection_transition;

;// CONCATENATED MODULE: ./node_modules/d3-transition/src/index.js





;// CONCATENATED MODULE: ./node_modules/d3-zoom/src/constant.js
/* harmony default export */ const d3_zoom_src_constant = (x => () => x);

;// CONCATENATED MODULE: ./node_modules/d3-zoom/src/event.js
function ZoomEvent(type, {
  sourceEvent,
  target,
  transform,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    transform: {value: transform, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}

;// CONCATENATED MODULE: ./node_modules/d3-zoom/src/transform.js
function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};

var transform_identity = new Transform(1, 0, 0);

transform.prototype = Transform.prototype;

function transform(node) {
  while (!node.__zoom) if (!(node = node.parentNode)) return transform_identity;
  return node.__zoom;
}

;// CONCATENATED MODULE: ./node_modules/d3-zoom/src/noevent.js
function noevent_nopropagation(event) {
  event.stopImmediatePropagation();
}

/* harmony default export */ function src_noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

;// CONCATENATED MODULE: ./node_modules/d3-zoom/src/zoom.js










// Ignore right-click, since that should open the context menu.
// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
function defaultFilter(event) {
  return (!event.ctrlKey || event.type === 'wheel') && !event.button;
}

function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}

function defaultTransform() {
  return this.__zoom || transform_identity;
}

function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}

/* harmony default export */ function zoom() {
  var filter = defaultFilter,
      extent = defaultExtent,
      constrain = defaultConstrain,
      wheelDelta = defaultWheelDelta,
      touchable = defaultTouchable,
      scaleExtent = [0, Infinity],
      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
      duration = 250,
      interpolate = src_zoom,
      listeners = src_dispatch("start", "zoom", "end"),
      touchstarting,
      touchfirst,
      touchending,
      touchDelay = 500,
      wheelDelay = 150,
      clickDistance2 = 0,
      tapDistance = 10;

  function zoom(selection) {
    selection
        .property("__zoom", defaultTransform)
        .on("wheel.zoom", wheeled, {passive: false})
        .on("mousedown.zoom", mousedowned)
        .on("dblclick.zoom", dblclicked)
      .filter(touchable)
        .on("touchstart.zoom", touchstarted)
        .on("touchmove.zoom", touchmoved)
        .on("touchend.zoom touchcancel.zoom", touchended)
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  zoom.transform = function(collection, transform, point, event) {
    var selection = collection.selection ? collection.selection() : collection;
    selection.property("__zoom", defaultTransform);
    if (collection !== selection) {
      schedule(collection, transform, point, event);
    } else {
      selection.interrupt().each(function() {
        gesture(this, arguments)
          .event(event)
          .start()
          .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
          .end();
      });
    }
  };

  zoom.scaleBy = function(selection, k, p, event) {
    zoom.scaleTo(selection, function() {
      var k0 = this.__zoom.k,
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };

  zoom.scaleTo = function(selection, k, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t0 = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
          p1 = t0.invert(p0),
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p, event);
  };

  zoom.translateBy = function(selection, x, y, event) {
    zoom.transform(selection, function() {
      return constrain(this.__zoom.translate(
        typeof x === "function" ? x.apply(this, arguments) : x,
        typeof y === "function" ? y.apply(this, arguments) : y
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };

  zoom.translateTo = function(selection, x, y, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(transform_identity.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x === "function" ? -x.apply(this, arguments) : -x,
        typeof y === "function" ? -y.apply(this, arguments) : -y
      ), e, translateExtent);
    }, p, event);
  };

  function scale(transform, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
  }

  function translate(transform, p0, p1) {
    var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
    return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
  }

  function centroid(extent) {
    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
  }

  function schedule(transition, transform, point, event) {
    transition
        .on("start.zoom", function() { gesture(this, arguments).event(event).start(); })
        .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).event(event).end(); })
        .tween("zoom", function() {
          var that = this,
              args = arguments,
              g = gesture(that, args).event(event),
              e = extent.apply(that, args),
              p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
              w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
              a = that.__zoom,
              b = typeof transform === "function" ? transform.apply(that, args) : transform,
              i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
          return function(t) {
            if (t === 1) t = b; // Avoid rounding error on end.
            else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
            g.zoom(null, t);
          };
        });
  }

  function gesture(that, args, clean) {
    return (!clean && that.__zooming) || new Gesture(that, args);
  }

  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }

  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = src_select(this.that).datum();
      listeners.call(
        type,
        this.that,
        new ZoomEvent(type, {
          sourceEvent: this.sourceEvent,
          target: zoom,
          type,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };

  function wheeled(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var g = gesture(this, args).event(event),
        t = this.__zoom,
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
        p = pointer(event);

    // If the mouse is in the same location as before, reuse it.
    // If there were recent wheel events, reset the wheel idle timeout.
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    }

    // If this wheel event won’t trigger a transform change, ignore it.
    else if (t.k === k) return;

    // Otherwise, capture the mouse point and location at the start.
    else {
      g.mouse = [p, t.invert(p)];
      interrupt(this);
      g.start();
    }

    src_noevent(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }

  function mousedowned(event, ...args) {
    if (touchending || !filter.apply(this, arguments)) return;
    var currentTarget = event.currentTarget,
        g = gesture(this, args, true).event(event),
        v = src_select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
        p = pointer(event, currentTarget),
        x0 = event.clientX,
        y0 = event.clientY;

    nodrag(event.view);
    noevent_nopropagation(event);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt(this);
    g.start();

    function mousemoved(event) {
      src_noevent(event);
      if (!g.moved) {
        var dx = event.clientX - x0, dy = event.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event)
       .zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }

    function mouseupped(event) {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event.view, g.moved);
      src_noevent(event);
      g.event(event).end();
    }
  }

  function dblclicked(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var t0 = this.__zoom,
        p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this),
        p1 = t0.invert(p0),
        k1 = t0.k * (event.shiftKey ? 0.5 : 2),
        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);

    src_noevent(event);
    if (duration > 0) src_select(this).transition().duration(duration).call(schedule, t1, p0, event);
    else src_select(this).call(zoom.transform, t1, p0, event);
  }

  function touchstarted(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var touches = event.touches,
        n = touches.length,
        g = gesture(this, args, event.changedTouches.length === n).event(event),
        started, i, t, p;

    noevent_nopropagation(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }

    if (touchstarting) touchstarting = clearTimeout(touchstarting);

    if (started) {
      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
      interrupt(this);
      g.start();
    }
  }

  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t, p, l;

    src_noevent(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1],
          p1 = g.touch1[0], l1 = g.touch1[1],
          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    }
    else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
    else return;

    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }

  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t;

    noevent_nopropagation(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
      if (g.taps === 2) {
        t = pointer(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = src_select(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }
  }

  zoom.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : d3_zoom_src_constant(+_), zoom) : wheelDelta;
  };

  zoom.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : d3_zoom_src_constant(!!_), zoom) : filter;
  };

  zoom.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : d3_zoom_src_constant(!!_), zoom) : touchable;
  };

  zoom.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : d3_zoom_src_constant([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };

  zoom.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };

  zoom.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };

  zoom.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };

  zoom.duration = function(_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };

  zoom.interpolate = function(_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };

  zoom.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };

  zoom.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };

  zoom.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
  };

  return zoom;
}

;// CONCATENATED MODULE: ./node_modules/d3-zoom/src/index.js



// EXTERNAL MODULE: ./node_modules/events/events.js
var events = __webpack_require__(7187);
var events_default = /*#__PURE__*/__webpack_require__.n(events);
;// CONCATENATED MODULE: ./src/helpers/annotations.ts


function annotations(options) {
    const xScale = options.owner.meta.xScale;
    const yScale = options.owner.meta.yScale;
    const line = src_line()
        .x(function (d) {
        return d[0];
    })
        .y(function (d) {
        return d[1];
    });
    return function (parentSelection) {
        parentSelection.each(function () {
            // join
            const current = src_select(this);
            const selection = current.selectAll('g.annotations').data(function (d) {
                return d.annotations || [];
            });
            // enter
            const enter = selection.enter().append('g').attr('class', 'annotations');
            // enter + update
            // - path
            const yRange = yScale.range();
            const xRange = xScale.range();
            // prettier-ignore
            const path = selection.merge(enter).selectAll('path')
                .data(function (d) {
                if ('x' in d) {
                    return [[[0, yRange[0]], [0, yRange[1]]]];
                }
                else {
                    return [[[xRange[0], 0], [xRange[1], 0]]];
                }
            });
            path
                .enter()
                .append('path')
                .attr('stroke', '#eee')
                .attr('d', line);
            path.exit().remove();
            // enter + update
            // - text
            const text = selection
                .merge(enter)
                .selectAll('text')
                .data(function (d) {
                return [
                    {
                        text: d.text || '',
                        hasX: 'x' in d
                    }
                ];
            });
            text
                .enter()
                .append('text')
                .attr('y', function (d) {
                return d.hasX ? 3 : 0;
            })
                .attr('x', function (d) {
                return d.hasX ? 0 : 3;
            })
                .attr('dy', function (d) {
                return d.hasX ? 5 : -5;
            })
                .attr('text-anchor', function (d) {
                return d.hasX ? 'end' : '';
            })
                .attr('transform', function (d) {
                return d.hasX ? 'rotate(-90)' : '';
            })
                .text(function (d) {
                return d.text;
            });
            text.exit().remove();
            // enter + update
            // move group
            selection.merge(enter).attr('transform', function (d) {
                if ('x' in d) {
                    return 'translate(' + xScale(d.x) + ', 0)';
                }
                else {
                    return 'translate(0, ' + yScale(d.y) + ')';
                }
            });
            // exit
            selection.exit().remove();
        });
    };
}

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
    return hsl(v)
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


/* harmony default export */ const globals = (Globals);

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

// EXTERNAL MODULE: ./node_modules/built-in-math-eval/index.js
var built_in_math_eval = __webpack_require__(5248);
// EXTERNAL MODULE: ./node_modules/interval-arithmetic-eval/index.js
var interval_arithmetic_eval = __webpack_require__(8867);
var interval_arithmetic_eval_default = /*#__PURE__*/__webpack_require__.n(interval_arithmetic_eval);
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
const eval_interval = generateEvaluator('interval')



;// CONCATENATED MODULE: ./src/tip.ts





function mouseTip(config) {
    config = Object.assign({
        xLine: false,
        yLine: false,
        renderer: function (x, y) {
            return '(' + x.toFixed(3) + ', ' + y.toFixed(3) + ')';
        },
        owner: null
    }, config);
    const MARGIN = 20;
    const line = src_line()
        .x(function (d) {
        return d[0];
    })
        .y(function (d) {
        return d[1];
    });
    function lineGenerator(el, data) {
        return el
            .append('path')
            .datum(data)
            .attr('stroke', 'grey')
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.5)
            .attr('d', line);
    }
    let tipInnerJoin, tipInnerEnter;
    function tip(selection) {
        const join = selection.selectAll('g.tip').data(function (d) {
            return [d];
        });
        // enter
        const tipEnter = join
            .enter()
            .append('g')
            .attr('class', 'tip')
            .attr('clip-path', 'url(#function-plot-clip-' + config.owner.id + ')');
        // enter + update = enter inner tip
        tipInnerJoin = join
            .merge(tipEnter)
            .selectAll('g.inner-tip')
            .data(function (d) {
            // debugger
            return [d];
        });
        tipInnerEnter = tipInnerJoin
            .enter()
            .append('g')
            .attr('class', 'inner-tip')
            .style('display', 'none')
            .each(function () {
            const el = src_select(this);
            lineGenerator(el, [
                [0, -config.owner.meta.height - MARGIN],
                [0, config.owner.meta.height + MARGIN]
            ])
                .attr('class', 'tip-x-line')
                .style('display', 'none');
            lineGenerator(el, [
                [-config.owner.meta.width - MARGIN, 0],
                [config.owner.meta.width + MARGIN, 0]
            ])
                .attr('class', 'tip-y-line')
                .style('display', 'none');
            el.append('circle').attr('r', 3);
            el.append('text').attr('transform', 'translate(5,-5)');
        });
        // enter + update
        tipInnerJoin
            .merge(tipInnerEnter)
            .selectAll('.tip-x-line')
            .style('display', config.xLine ? null : 'none');
        tipInnerJoin
            .merge(tipInnerEnter)
            .selectAll('.tip-y-line')
            .style('display', config.yLine ? null : 'none');
    }
    tip.move = function (coordinates) {
        let minDist = Infinity;
        let closestIndex = -1;
        let x, y;
        const selection = tipInnerJoin.merge(tipInnerEnter);
        const meta = config.owner.meta;
        const data = selection.datum().data;
        const xScale = meta.xScale;
        const yScale = meta.yScale;
        const width = meta.width;
        const height = meta.height;
        const x0 = coordinates.x;
        const y0 = coordinates.y;
        for (let i = 0; i < data.length; i += 1) {
            // skipTip=true skips the evaluation in the datum
            // implicit equations cannot be evaluated with a single point
            // parametric equations cannot be evaluated with a single point
            // polar equations cannot be evaluated with a single point
            if (data[i].skipTip || data[i].fnType !== 'linear') {
                continue;
            }
            const range = data[i].range || [-infinity(), infinity()];
            let candidateY;
            if (x0 > range[0] - globals.TIP_X_EPS && x0 < range[1] + globals.TIP_X_EPS) {
                try {
                    candidateY = builtIn(data[i], 'fn', { x: x0 });
                }
                catch (e) { }
                if (isValidNumber(candidateY)) {
                    const tDist = Math.abs(candidateY - y0);
                    if (tDist < minDist) {
                        minDist = tDist;
                        closestIndex = i;
                    }
                }
            }
        }
        if (closestIndex !== -1) {
            x = x0;
            if (data[closestIndex].range) {
                x = Math.max(x, data[closestIndex].range[0]);
                x = Math.min(x, data[closestIndex].range[1]);
            }
            y = builtIn(data[closestIndex], 'fn', { x });
            tip.show();
            config.owner.emit('tip:update', { x, y, index: closestIndex });
            // @ts-ignore
            const clampX = clamp(x, xScale.invert(-MARGIN), xScale.invert(width + MARGIN));
            // @ts-ignore
            const clampY = clamp(y, yScale.invert(height + MARGIN), yScale.invert(-MARGIN));
            const computedColor = utils_color(data[closestIndex], closestIndex);
            selection.style('color', 'red');
            selection.attr('transform', 'translate(' + xScale(clampX) + ',' + yScale(clampY) + ')');
            selection.select('circle').attr('fill', computedColor);
            selection.select('text').attr('fill', computedColor).text(config.renderer(x, y, closestIndex));
        }
        else {
            tip.hide();
        }
    };
    tip.show = function () {
        tipInnerJoin.merge(tipInnerEnter).style('display', null);
    };
    tip.hide = function () {
        tipInnerJoin.merge(tipInnerEnter).style('display', 'none');
    };
    // generations of getters/setters
    Object.keys(config).forEach(function (option) {
        getterSetter.call(tip, config, option);
    });
    return tip;
}

;// CONCATENATED MODULE: ./node_modules/d3-shape/src/area.js







/* harmony default export */ function src_area(x0, y0, y1) {
  var x1 = null,
      defined = src_constant(true),
      context = null,
      curve = linear,
      output = null,
      path = withPath(area);

  x0 = typeof x0 === "function" ? x0 : (x0 === undefined) ? point_x : src_constant(+x0);
  y0 = typeof y0 === "function" ? y0 : (y0 === undefined) ? src_constant(0) : src_constant(+y0);
  y1 = typeof y1 === "function" ? y1 : (y1 === undefined) ? point_y : src_constant(+y1);

  function area(data) {
    var i,
        j,
        k,
        n = (data = array(data)).length,
        d,
        defined0 = false,
        buffer,
        x0z = new Array(n),
        y0z = new Array(n);

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) {
          j = i;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();
          for (k = i - 1; k >= j; --k) {
            output.point(x0z[k], y0z[k]);
          }
          output.lineEnd();
          output.areaEnd();
        }
      }
      if (defined0) {
        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
      }
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  function arealine() {
    return src_line().defined(defined).curve(curve).context(context);
  }

  area.x = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : src_constant(+_), x1 = null, area) : x0;
  };

  area.x0 = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : src_constant(+_), area) : x0;
  };

  area.x1 = function(_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : src_constant(+_), area) : x1;
  };

  area.y = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : src_constant(+_), y1 = null, area) : y0;
  };

  area.y0 = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : src_constant(+_), area) : y0;
  };

  area.y1 = function(_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : src_constant(+_), area) : y1;
  };

  area.lineX0 =
  area.lineY0 = function() {
    return arealine().x(x0).y(y0);
  };

  area.lineY1 = function() {
    return arealine().x(x0).y(y1);
  };

  area.lineX1 = function() {
    return arealine().x(x1).y(y0);
  };

  area.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : src_constant(!!_), area) : defined;
  };

  area.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };

  area.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };

  return area;
}

;// CONCATENATED MODULE: ./src/samplers/interval.ts




interval_arithmetic_eval_default().policies.disableRounding();
async function asyncInterval1d({ d, xAxis, range, nSamples, nGroups, xScale, yScale }) {
    const workerPoolInterval = globals.workerPool;
    const absLo = range[0];
    const absHi = range[1];
    nGroups = nGroups || 4;
    // if nSamples = 4
    //
    // lo                 hi
    // [#     #     #     #]
    //   =====  <-- step
    //
    // See more useful math in the utils tests
    const step = (absHi - absLo) / (nSamples - 1);
    const groupSize = (nSamples - 1) / nGroups;
    const promises = [];
    const interval2dTypedArrayGroups = interval2dTypedArray(nSamples, nGroups);
    for (let i = 0; i < nGroups; i += 1) {
        const nGroup = i;
        const lo = absLo + step * groupSize * i;
        const hi = absLo + step * groupSize * (i + 1);
        // Transfers the typed arrays to the worker threads.
        promises.push(workerPoolInterval.queue({
            nGroup,
            d,
            lo,
            hi,
            n: Math.ceil(groupSize),
            interval2d: interval2dTypedArrayGroups[i]
        }));
    }
    const allWorkersDone = await Promise.all(promises);
    // Transfer the typed arrays back to the main thread.
    for (let i = 0; i < allWorkersDone.length; i += 1) {
        interval2dTypedArrayGroups[i] = new Float32Array(allWorkersDone[i]);
    }
    const samples = [];
    for (let i = 0; i < interval2dTypedArrayGroups.length; i += 1) {
        const group = interval2dTypedArrayGroups[i];
        for (let j = 0; j < group.length; j += 4) {
            const x = { lo: group[j + 0], hi: group[j + 1] };
            const y = { lo: group[j + 2], hi: group[j + 3] };
            if (y.lo === Infinity && y.hi === -Infinity) {
                // interval is empty
                continue;
            }
            else if (y.lo === -Infinity && y.hi === Infinity) {
                // skip whole interval
                continue;
            }
            else {
                samples.push([x, y]);
            }
        }
    }
    // asymptote determination
    const yMin = yScale.domain()[0] - infinity();
    const yMax = yScale.domain()[1] + infinity();
    for (let i = 1; i < samples.length - 1; i += 1) {
        if (!samples[i]) {
            const prev = samples[i - 1];
            const next = samples[i + 1];
            if (prev && next && !interval_arithmetic_eval.Interval.intervalsOverlap(prev[1], next[1])) {
                // case:
                //
                //   |
                //
                //     |
                //
                //   p n
                if (prev[1].lo > next[1].hi) {
                    prev[1].hi = Math.max(yMax, prev[1].hi);
                    next[1].lo = Math.min(yMin, next[1].lo);
                }
                // case:
                //
                //     |
                //
                //   |
                //
                //   p n
                if (prev[1].hi < next[1].lo) {
                    prev[1].lo = Math.min(yMin, prev[1].lo);
                    next[1].hi = Math.max(yMax, next[1].hi);
                }
            }
        }
    }
    ;
    samples.scaledDx = xScale(absLo + step) - xScale(absLo);
    return [samples];
}
function interval1d({ d, xAxis, range, nSamples, xScale, yScale }) {
    const xCoords = space(xAxis, range, nSamples);
    const samples = [];
    for (let i = 0; i < xCoords.length - 1; i += 1) {
        const x = { lo: xCoords[i], hi: xCoords[i + 1] };
        const y = eval_interval(d, 'fn', { x });
        if (!interval_arithmetic_eval.Interval.isEmpty(y) && !interval_arithmetic_eval.Interval.isWhole(y)) {
            samples.push([x, y]);
        }
        if (interval_arithmetic_eval.Interval.isWhole(y)) {
            // means that the next and prev intervals need to be fixed
            samples.push(null);
        }
    }
    // asymptote determination
    const yMin = yScale.domain()[0] - infinity();
    const yMax = yScale.domain()[1] + infinity();
    for (let i = 1; i < samples.length - 1; i += 1) {
        if (!samples[i]) {
            const prev = samples[i - 1];
            const next = samples[i + 1];
            if (prev && next && !interval_arithmetic_eval.Interval.intervalsOverlap(prev[1], next[1])) {
                // case:
                //
                //   |
                //
                //     |
                //
                //   p n
                if (prev[1].lo > next[1].hi) {
                    prev[1].hi = Math.max(yMax, prev[1].hi);
                    next[1].lo = Math.min(yMin, next[1].lo);
                }
                // case:
                //
                //     |
                //
                //   |
                //
                //   p n
                if (prev[1].hi < next[1].lo) {
                    prev[1].lo = Math.min(yMin, prev[1].lo);
                    next[1].hi = Math.max(yMax, next[1].hi);
                }
            }
        }
    }
    ;
    samples.scaledDx = xScale(xCoords[1]) - xScale(xCoords[0]);
    return [samples];
}
let rectEps;
function smallRect(x, _) {
    return interval_arithmetic_eval.Interval.width(x) < rectEps;
}
function quadTree(x, y, d) {
    const sample = eval_interval(d, 'fn', { x, y });
    const fulfills = interval_arithmetic_eval.Interval.zeroIn(sample);
    if (!fulfills) {
        return this;
    }
    if (smallRect(x, y)) {
        this.push([x, y]);
        return this;
    }
    const midX = x.lo + (x.hi - x.lo) / 2;
    const midY = y.lo + (y.hi - y.lo) / 2;
    const east = { lo: midX, hi: x.hi };
    const west = { lo: x.lo, hi: midX };
    const north = { lo: midY, hi: y.hi };
    const south = { lo: y.lo, hi: midY };
    quadTree.call(this, east, north, d);
    quadTree.call(this, east, south, d);
    quadTree.call(this, west, north, d);
    quadTree.call(this, west, south, d);
}
function interval2d(samplerParams) {
    const xScale = samplerParams.xScale;
    const xDomain = samplerParams.xScale.domain();
    const yDomain = samplerParams.yScale.domain();
    const x = { lo: xDomain[0], hi: xDomain[1] };
    const y = { lo: yDomain[0], hi: yDomain[1] };
    const samples = [];
    // 1 px
    rectEps = xScale.invert(1) - xScale.invert(0);
    quadTree.call(samples, x, y, samplerParams.d);
    samples.scaledDx = 1;
    return [samples];
}
const syncSamplerInterval = function sampler(samplerParams) {
    switch (samplerParams.d.fnType) {
        case 'linear':
            return interval1d(samplerParams);
        case 'implicit':
            return interval2d(samplerParams);
        default:
            throw new Error(samplerParams.d.fnType + ' is not supported in the `interval` sync sampler');
    }
};
const asyncSamplerInterval = async function sampler(samplerParams) {
    switch (samplerParams.d.fnType) {
        case 'linear':
            return asyncInterval1d(samplerParams);
        default:
            throw new Error(samplerParams.d.fnType + ' is not supported in the `interval` async sampler');
    }
};


;// CONCATENATED MODULE: ./src/samplers/builtIn.ts


function checkAsymptote(d0, d1, d, sign, level) {
    if (!level) {
        return { asymptote: true, d0, d1 };
    }
    const n = 10;
    const x0 = d0[0];
    const x1 = d1[0];
    const samples = linspace(x0, x1, n);
    let oldY, oldX;
    for (let i = 0; i < n; i += 1) {
        const x = samples[i];
        const y = builtIn(d, 'fn', { x });
        if (oldY) {
            const deltaY = y - oldY;
            const newSign = sgn(deltaY);
            if (newSign === sign) {
                return checkAsymptote([oldX, oldY], [x, y], d, sign, level - 1);
            }
        }
        oldY = y;
        oldX = x;
    }
    return { asymptote: false, d0, d1 };
}
/**
 * Splits the evaluated data into arrays, each array is separated by any asymptote found
 * through the process of detecting slope/sign brusque changes
 */
function split(d, data, yScale) {
    if (data.length === 0) {
        // This case is possible when the function didn't render any valid points
        // e.g. when evaluating sqrt(x) with all negative values.
        return [];
    }
    const samplerResult = [];
    const yMin = yScale.domain()[0] - infinity();
    const yMax = yScale.domain()[1] + infinity();
    let samplerGroup = [data[0]];
    let i = 1;
    let deltaX = infinity();
    let oldSign;
    while (i < data.length) {
        const yOld = data[i - 1][1];
        const yNew = data[i][1];
        const deltaY = yNew - yOld;
        const newSign = sgn(deltaY);
        // make a new set if:
        if (
        // we have at least 2 entries (so that we can compute deltaY)
        samplerGroup.length >= 2 &&
            // sgn(y1) * sgn(y0) < 0 && // there's a change in the evaluated values sign
            // there's a change in the slope sign
            oldSign !== newSign &&
            // the slope is bigger to some value (according to the current zoom scale)
            Math.abs(deltaY / deltaX) > 1) {
            // retest this section again and determine if it's an asymptote
            const check = checkAsymptote(data[i - 1], data[i], d, newSign, 3);
            if (check.asymptote) {
                // data[i-1] has an updated [x,y], it was already added to a group (in a previous iteration)
                // we just need to update the yCoordinate
                data[i - 1][0] = check.d0[0];
                data[i - 1][1] = clamp(check.d0[1], yMin, yMax);
                samplerResult.push(samplerGroup);
                // data[i] has an updated [x,y], create a new group with it.
                data[i][0] = check.d1[0];
                data[i][1] = clamp(check.d1[1], yMin, yMax);
                samplerGroup = [data[i]];
            }
            else {
                // false alarm, it's not an asymptote
                samplerGroup.push(data[i]);
            }
        }
        else {
            samplerGroup.push(data[i]);
        }
        // wait for at least 2 entries in the group before computing deltaX.
        if (samplerGroup.length > 1) {
            deltaX = samplerGroup[samplerGroup.length - 1][0] - samplerGroup[samplerGroup.length - 2][0];
            oldSign = newSign;
        }
        ++i;
    }
    if (samplerGroup.length) {
        samplerResult.push(samplerGroup);
    }
    return samplerResult;
}
function builtIn_linear(samplerParams) {
    const allX = space(samplerParams.xAxis, samplerParams.range, samplerParams.nSamples);
    const yDomain = samplerParams.yScale.domain();
    // const yDomainMargin = yDomain[1] - yDomain[0]
    const yMin = yDomain[0] - infinity();
    const yMax = yDomain[1] + infinity();
    const data = [];
    for (let i = 0; i < allX.length; i += 1) {
        const x = allX[i];
        let y = builtIn(samplerParams.d, 'fn', { x });
        if (isValidNumber(x) && isValidNumber(y)) {
            y = clamp(y, yMin, yMax);
            data.push([x, y]);
        }
    }
    const splitData = split(samplerParams.d, data, samplerParams.yScale);
    return splitData;
}
function parametric(samplerParams) {
    // range is mapped to canvas coordinates from the input
    // for parametric plots the range will tell the start/end points of the `t` param
    const parametricRange = samplerParams.d.range || [0, 2 * Math.PI];
    const tCoords = space(samplerParams.xAxis, parametricRange, samplerParams.nSamples);
    const samples = [];
    for (let i = 0; i < tCoords.length; i += 1) {
        const t = tCoords[i];
        const x = builtIn(samplerParams.d, 'x', { t });
        const y = builtIn(samplerParams.d, 'y', { t });
        samples.push([x, y]);
    }
    return [samples];
}
function polar(samplerParams) {
    // range is mapped to canvas coordinates from the input
    // for polar plots the range will tell the start/end points of the `theta` param
    const polarRange = samplerParams.d.range || [-Math.PI, Math.PI];
    const thetaSamples = space(samplerParams.xAxis, polarRange, samplerParams.nSamples);
    const samples = [];
    for (let i = 0; i < thetaSamples.length; i += 1) {
        const theta = thetaSamples[i];
        const r = builtIn(samplerParams.d, 'r', { theta });
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        samples.push([x, y]);
    }
    return [samples];
}
function points(samplerParams) {
    return [samplerParams.d.points];
}
function vector(sampleParams) {
    const d = sampleParams.d;
    d.offset = d.offset || [0, 0];
    return [[d.offset, [d.vector[0] + d.offset[0], d.vector[1] + d.offset[1]]]];
}
const sampler = function sampler(samplerParams) {
    switch (samplerParams.d.fnType) {
        case 'linear':
            return builtIn_linear(samplerParams);
        case 'parametric':
            return parametric(samplerParams);
        case 'polar':
            return polar(samplerParams);
        case 'vector':
            return vector(samplerParams);
        case 'points':
            return points(samplerParams);
        default:
            throw Error(samplerParams.d.fnType + ' is not supported in the `builtIn` sampler');
    }
};
/* harmony default export */ const samplers_builtIn = (sampler);

;// CONCATENATED MODULE: ./src/evaluate.ts



/**
 * Computes the endpoints x_lo, x_hi of the range in d.range from which the sampler will take samples.
 */
function getRange(scale, d) {
    const range = d.range || [-Infinity, Infinity];
    const start = Math.max(scale.domain()[0], range[0]);
    const end = Math.min(scale.domain()[1], range[1]);
    return [start, end];
}
function getSamples(nSamples, chartWidth) {
    return nSamples || Math.min(globals.MAX_ITERATIONS, globals.DEFAULT_ITERATIONS || chartWidth * 2);
}
/**
 * Decides which sampler function to call based on the options
 * of `data`
 *
 * @param {Object} chart Chart instance which is orchestrating this sampling operation
 * @param {Object} d a.k.a a single item from `data`
 * @returns [number, number]
 */
function builtInEvaluate(chart, d) {
    const data = samplers_builtIn({
        d,
        range: getRange(chart.meta.xScale, d),
        xScale: chart.meta.xScale,
        yScale: chart.meta.yScale,
        xAxis: chart.options.xAxis,
        yAxis: chart.options.yAxis,
        nSamples: getSamples(d.nSamples, chart.meta.width)
    });
    // NOTE: it's impossible to listen for the first eval event
    // as the event is already fired when a listener is attached
    chart.emit('eval', data, d.index, d.isHelper);
    return data;
}
function intervalEvaluate(chart, d) {
    const data = syncSamplerInterval({
        d,
        range: getRange(chart.meta.xScale, d),
        xScale: chart.meta.xScale,
        yScale: chart.meta.yScale,
        xAxis: chart.options.xAxis,
        yAxis: chart.options.yAxis,
        nSamples: getSamples(d.nSamples, chart.meta.width)
    });
    // NOTE: it's impossible to listen for the first eval event
    // as the event is already fired when a listener is attached
    chart.emit('eval', data, d.index, d.isHelper);
    return data;
}
async function asyncIntervalEvaluate(chart, d) {
    const data = asyncSamplerInterval({
        d,
        range: getRange(chart.meta.xScale, d),
        xScale: chart.meta.xScale,
        yScale: chart.meta.yScale,
        xAxis: chart.options.xAxis,
        yAxis: chart.options.yAxis,
        nSamples: getSamples(d.nSamples, chart.meta.width)
    });
    // NOTE: it's impossible to listen for the first eval event
    // as the event is already fired when a listener is attached
    chart.emit('eval', data, d.index, d.isHelper);
    return data;
}


;// CONCATENATED MODULE: ./src/graph-types/polyline.ts




function polyline(chart) {
    function plotLine(selection) {
        selection.each(function (d) {
            const el = (plotLine.el = src_select(this));
            const index = d.index;
            const evaluatedData = builtInEvaluate(chart, d);
            const computedColor = utils_color(d, index);
            const yRange = chart.meta.yScale.range();
            let yMax = yRange[0];
            let yMin = yRange[1];
            // workaround, clamp assuming that the bounds are finite but huge
            const diff = yMax - yMin;
            yMax += diff * 1e6;
            yMin -= diff * 1e6;
            if (d.skipBoundsCheck) {
                yMax = infinity();
                yMin = -infinity();
            }
            function y(d) {
                return clamp(chart.meta.yScale(d[1]), yMin, yMax);
            }
            const line = src_line()
                .curve(linear)
                .x(function (d) {
                return chart.meta.xScale(d[0]);
            })
                .y(y);
            const area = src_area()
                .x(function (d) {
                return chart.meta.xScale(d[0]);
            })
                .y0(chart.meta.yScale(0))
                .y1(y);
            // join
            const innerSelection = el.selectAll(':scope > path.line').data(evaluatedData);
            const cls = `line line-${index}`;
            const innerSelectionEnter = innerSelection
                .enter()
                .append('path')
                .attr('class', cls)
                .attr('stroke-width', 1)
                .attr('stroke-linecap', 'round');
            // enter + update
            innerSelection.merge(innerSelectionEnter).each(function () {
                const path = src_select(this);
                let pathD;
                if (d.closed) {
                    path.attr('fill', computedColor);
                    path.attr('fill-opacity', 0.3);
                    pathD = area;
                }
                else {
                    path.attr('fill', 'none');
                    pathD = line;
                }
                path
                    .attr('stroke', computedColor)
                    .attr('marker-end', function () {
                    // special marker for vectors
                    return d.fnType === 'vector' ? 'url(#' + chart.markerId + ')' : null;
                })
                    .attr('d', pathD);
                if (d.attr) {
                    for (const k in d.attr) {
                        // If the attribute to modify is class then append the default class
                        // or otherwise the d3 selection won't work.
                        let val = d.attr[k];
                        if (k === 'class') {
                            val = `${cls} ${d.attr[k]}`;
                        }
                        path.attr(k, val);
                    }
                }
            });
            // exit
            innerSelection.exit().remove();
        });
    }
    return plotLine;
}

;// CONCATENATED MODULE: ./src/graph-types/interval.ts



function clampRange(minWidthHeight, vLo, vHi, gLo, gHi) {
    // issue 69
    // by adding the option `invert` to both the xAxis and the `yAxis`
    // it might be possible that after the transformation to canvas space
    // the y limits of the rectangle get inverted i.e. gLo > gHi
    //
    // e.g.
    //
    //   functionPlot({
    //     target: '#playground',
    //     yAxis: { invert: true },
    //     // ...
    //   })
    //
    if (gLo > gHi) {
        const t = gLo;
        gLo = gHi;
        gHi = t;
    }
    const hi = Math.min(vHi, gHi);
    const lo = Math.max(vLo, gLo);
    if (lo > hi) {
        // no overlap
        return [-minWidthHeight, 0];
    }
    return [lo, hi];
}
function createPathD(xScale, yScale, minWidthHeight, points, closed) {
    let path = '';
    const range = yScale.range();
    const minY = Math.min.apply(Math, range);
    const maxY = Math.max.apply(Math, range);
    for (let i = 0, length = points.length; i < length; i += 1) {
        if (points[i]) {
            const x = points[i][0];
            const y = points[i][1];
            let yLo = y.lo;
            let yHi = y.hi;
            // if options.closed is set to true then one of the bounds must be zero
            if (closed) {
                yLo = Math.min(yLo, 0);
                yHi = Math.max(yHi, 0);
            }
            // points.scaledDX is added because of the stroke-width
            const moveX = xScale(x.lo) + points.scaledDx / 2;
            const viewportY = clampRange(minWidthHeight, minY, maxY, isFinite(yHi) ? yScale(yHi) : -infinity(), isFinite(yLo) ? yScale(yLo) : infinity());
            const vLo = viewportY[0];
            const vHi = viewportY[1];
            path += ' M ' + moveX + ' ' + vLo;
            path += ' v ' + Math.max(vHi - vLo, minWidthHeight);
        }
    }
    return path;
}
function interval_interval(chart) {
    const xScale = chart.meta.xScale;
    const yScale = chart.meta.yScale;
    function plotLine(selection) {
        selection.each(async function (d) {
            const el = (plotLine.el = src_select(this));
            const index = d.index;
            const closed = d.closed;
            let evaluatedData;
            if (d.fnType === 'linear' && typeof d.fn === 'string' && d.sampler === 'asyncInterval') {
                evaluatedData = await asyncIntervalEvaluate(chart, d);
            }
            else {
                evaluatedData = intervalEvaluate(chart, d);
            }
            const innerSelection = el.selectAll(':scope > path.line').data(evaluatedData);
            // the min height/width of the rects drawn by the path generator
            const minWidthHeight = Math.max(evaluatedData[0].scaledDx, 1);
            const cls = `line line-${index}`;
            const innerSelectionEnter = innerSelection.enter().append('path').attr('class', cls).attr('fill', 'none');
            // enter + update
            const selection = innerSelection
                .merge(innerSelectionEnter)
                .attr('stroke-width', minWidthHeight)
                .attr('stroke', utils_color(d, index))
                .attr('opacity', closed ? 0.5 : 1)
                .attr('d', function (d) {
                return createPathD(xScale, yScale, minWidthHeight, d, closed);
            });
            if (d.attr) {
                for (const k in d.attr) {
                    // If the attribute to modify is class then append the default class
                    // or otherwise the d3 selection won't work.
                    let val = d.attr[k];
                    if (k === 'class') {
                        val = `${cls} ${d.attr[k]}`;
                    }
                    selection.attr(k, val);
                }
            }
            innerSelection.exit().remove();
        });
    }
    return plotLine;
}

;// CONCATENATED MODULE: ./src/graph-types/scatter.ts




function Scatter(chart) {
    const xScale = chart.meta.xScale;
    const yScale = chart.meta.yScale;
    function scatter(selection) {
        selection.each(function (d) {
            let i, j;
            const index = d.index;
            const computedColor = utils_color(d, index);
            const evaluatedData = builtInEvaluate(chart, d);
            // scatter doesn't need groups, therefore each group is
            // flattened into a single array
            const joined = [];
            for (i = 0; i < evaluatedData.length; i += 1) {
                for (j = 0; j < evaluatedData[i].length; j += 1) {
                    joined.push(evaluatedData[i][j]);
                }
            }
            const innerSelection = src_select(this).selectAll(':scope > circle.scatter').data(joined);
            const cls = `scatter scatter-${index}`;
            const innerSelectionEnter = innerSelection.enter().append('circle').attr('class', cls);
            const selection = innerSelection
                .merge(innerSelectionEnter)
                .attr('fill', hsl(computedColor.toString()).brighter(1.5).formatHex())
                .attr('stroke', computedColor)
                .attr('opacity', 0.7)
                .attr('r', 1)
                .attr('cx', function (d) {
                return xScale(d[0]);
            })
                .attr('cy', function (d) {
                return yScale(d[1]);
            });
            if (d.attr) {
                for (const k in d.attr) {
                    // If the attribute to modify is class then append the default class
                    // or otherwise the d3 selection won't work.
                    let val = d.attr[k];
                    if (k === 'class') {
                        val = `${cls} ${d.attr[k]}`;
                    }
                    selection.attr(k, val);
                }
            }
            innerSelection.exit().remove();
        });
    }
    return scatter;
}

;// CONCATENATED MODULE: ./src/graph-types/text.ts



function Text(chart) {
    const xScale = chart.meta.xScale;
    const yScale = chart.meta.yScale;
    function text(selection) {
        selection.each(function (d) {
            // Force some parameters to make it look like a vector.
            d.sampler = 'builtIn';
            d.fnType = 'vector';
            const innerSelection = src_select(this).selectAll(':scope > text.fn-text').data([d.location]);
            const innerSelectionEnter = innerSelection.enter().append('text').attr('class', `fn-text fn-text-${d.index}`);
            const computeColor = utils_color(d, d.index);
            // enter + update
            const selection = innerSelection
                .merge(innerSelectionEnter)
                .attr('fill', hsl(computeColor.toString()).brighter(1.5).formatHex())
                .attr('x', (d) => xScale(d[0]))
                .attr('y', (d) => yScale(d[1]))
                .text(() => d.text);
            if (d.attr) {
                for (const k in d.attr) {
                    selection.attr(k, d.attr[k]);
                }
            }
            // exit
            innerSelection.exit().remove();
        });
    }
    return text;
}

;// CONCATENATED MODULE: ./src/graph-types/index.ts






;// CONCATENATED MODULE: ./src/datum-defaults.ts
function datumDefaults(d) {
    // default graphType uses boxes i.e. 2d intervals
    if (!('graphType' in d)) {
        d.graphType = 'interval';
    }
    // if the graphType is not `interval` then the sampler is `builtIn`
    // because the interval sampler returns a box instead of a point
    if (!('sampler' in d)) {
        d.sampler = d.graphType !== 'interval' ? 'builtIn' : 'interval';
    }
    // TODO: handle default fnType
    // default `fnType` is linear
    if (!('fnType' in d)) {
        d.fnType = 'linear';
    }
    return d;
}

;// CONCATENATED MODULE: ./src/helpers/derivative.ts





function derivative(chart) {
    const derivativeDatum = datumDefaults({
        isHelper: true,
        skipTip: true,
        skipBoundsCheck: true,
        nSamples: 2,
        graphType: 'polyline'
    });
    function computeLine(d) {
        if (!d.derivative) {
            return [];
        }
        const x0 = typeof d.derivative.x0 === 'number' ? d.derivative.x0 : infinity();
        derivativeDatum.index = d.index;
        derivativeDatum.scope = {
            m: builtIn(d.derivative, 'fn', { x: x0 }),
            x0,
            y0: builtIn(d, 'fn', { x: x0 })
        };
        derivativeDatum.fn = 'm * (x - x0) + y0';
        return [derivativeDatum];
    }
    function checkAutoUpdate(d) {
        const self = this;
        if (!d.derivative) {
            return;
        }
        if (d.derivative.updateOnMouseMove && !d.derivative.$$mouseListener) {
            d.derivative.$$mouseListener = function ({ x }) {
                // update initial value to be the position of the mouse
                // scope's x0 will be updated on the next call to `derivative(self)`
                if (d.derivative) {
                    d.derivative.x0 = x;
                }
                // trigger update (selection = self)
                derivative(self);
            };
            // if d.derivative is destroyed and recreated, the tip:update event
            // will be fired on the new d.derivative :)
            chart.on('tip:update', d.derivative.$$mouseListener);
        }
    }
    const derivative = function (selection) {
        selection.each(function (d) {
            const el = src_select(this);
            const data = computeLine.call(selection, d);
            checkAutoUpdate.call(selection, d);
            const innerSelection = el.selectAll('g.derivative').data(data);
            const innerSelectionEnter = innerSelection.enter().append('g').attr('class', 'derivative');
            // enter + update
            innerSelection.merge(innerSelectionEnter).call(polyline(chart));
            // update
            // change the opacity of the line
            innerSelection.merge(innerSelectionEnter).selectAll('path').attr('opacity', 0.5);
            innerSelection.exit().remove();
        });
    };
    return derivative;
}

;// CONCATENATED MODULE: ./src/helpers/secant.ts





function secant(chart) {
    const secantDefaults = datumDefaults({
        isHelper: true,
        skipTip: true,
        skipBoundsCheck: true,
        nSamples: 2,
        graphType: 'polyline'
    });
    function computeSlope(scope) {
        scope.m = (scope.y1 - scope.y0) / (scope.x1 - scope.x0);
    }
    function updateLine(d, secant) {
        if (!('x0' in secant)) {
            throw Error('secant must have the property `x0` defined');
        }
        secant.scope = secant.scope || {};
        const x0 = secant.x0;
        const x1 = typeof secant.x1 === 'number' ? secant.x1 : infinity();
        Object.assign(secant.scope, {
            x0,
            x1,
            y0: builtIn(d, 'fn', { x: x0 }),
            y1: builtIn(d, 'fn', { x: x1 })
        });
        computeSlope(secant.scope);
    }
    function setFn(d, secant) {
        updateLine(d, secant);
        secant.fn = 'm * (x - x0) + y0';
    }
    function setMouseListener(d, secantObject) {
        const self = this;
        if (secantObject.updateOnMouseMove && !secantObject.$$mouseListener) {
            secantObject.$$mouseListener = function ({ x }) {
                secantObject.x1 = x;
                updateLine(d, secantObject);
                secant(self);
            };
            chart.on('tip:update', secantObject.$$mouseListener);
        }
    }
    function computeLines(d) {
        const self = this;
        const data = [];
        d.secants = d.secants || [];
        for (let i = 0; i < d.secants.length; i += 1) {
            const secant = (d.secants[i] = Object.assign({}, secantDefaults, d.secants[i]));
            // necessary to make the secant have the same color as d
            secant.index = d.index;
            if (!secant.fn) {
                setFn.call(self, d, secant);
                setMouseListener.call(self, d, secant);
            }
            data.push(secant);
        }
        return data;
    }
    function secant(selection) {
        selection.each(function (d) {
            const el = src_select(this);
            const data = computeLines.call(selection, d);
            const innerSelection = el.selectAll('g.secant').data(data);
            const innerSelectionEnter = innerSelection.enter().append('g').attr('class', 'secant');
            // enter + update
            innerSelection.merge(innerSelectionEnter).call(polyline(chart));
            // change the opacity of the secants
            innerSelection.merge(innerSelectionEnter).selectAll('path').attr('opacity', 0.5);
            // exit
            innerSelection.exit().remove();
        });
    }
    return secant;
}

;// CONCATENATED MODULE: ./src/helpers/index.ts



function helpers(chart) {
    function helper(selection) {
        selection.each(function () {
            const el = src_select(this);
            el.call(derivative(chart));
            el.call(secant(chart));
        });
    }
    return helper;
}

;// CONCATENATED MODULE: ./src/chart.ts





// @ts-ignore








function getD3Scale(type) {
    if (type === 'linear')
        return linear_linear;
    return log;
}
/**
 * An instance can subscribe to any of the following events by doing `instance.on([eventName], callback)`,
 * events can be triggered by doing `instance.emit([eventName][, params])`
 *
 * - `mouseover` fired whenever the mouse is over the canvas
 * - `mousemove` fired whenever the mouse is moved inside the canvas, callback params: a single object `{x: number, y: number}` (in canvas space
 coordinates)
 * - `mouseout` fired whenever the mouse is moved outside the canvas
 * - `before:draw` fired before drawing all the graphs
 * - `after:draw` fired after drawing all the graphs
 * - `zoom` fired whenever there's scaling/translation on the graph
 (x-scale and y-scale of another graph whose scales were updated)
 * - `tip:update` fired whenever the tip position is updated, callback params `{x, y, index}` (in canvas
 space coordinates, `index` is the index of the graph where the tip is on top of)
 * - `eval` fired whenever the sampler evaluates a function, callback params `data` (an array of segment/points),
 `index` (the index of datum in the `data` array), `isHelper` (true if the data is created for a helper e.g.
 for the derivative/secant)
 *
 * The following events are dispatched to all the linked graphs
 *
 * - `all:mouseover` same as `mouseover` but it's dispatched in each linked graph
 * - `all:mousemove` same as `mousemove` but it's dispatched in each linked graph
 * - `all:mouseout` same as `mouseout` but it's dispatched in each linked graph
 * - `all:zoom` fired whenever there's scaling/translation on the graph, dispatched on all the linked graphs
 */
class Chart extends (events_default()).EventEmitter {
    static cache = {};
    id;
    markerId;
    options;
    meta;
    /**
     * Array of function-plot instances linked to the events of this instance,
     i.e. when the zoom event is dispatched on this instance it's also dispatched on all the instances of
     this array
     */
    linkedGraphs;
    line;
    /**
     * The number of times a function was rendered.
     */
    generation;
    /**
     * `svg` element that holds the graph (canvas + title + axes)
     */
    root;
    /**
     * Element that holds the tip
     */
    tip;
    /**
     * `g.canvas` element that holds the area where the graphs are plotted (clipped with a mask)
     */
    canvas;
    /**
     * Element that holds the canvas where the functions are drawn
     */
    content;
    /**
     * Draggable element that receives zoom and pan events
     */
    draggable;
    constructor(options) {
        super();
        const n = Math.random();
        const letter = String.fromCharCode(Math.floor(n * 26) + 97);
        this.options = options;
        this.id = letter + n.toString(16).substr(2);
        this.options.id = this.id;
        this.markerId = this.id + '-marker';
        Chart.cache[this.id] = this;
        this.linkedGraphs = [this];
        this.meta = {};
        this.generation = 1;
        this.setUpEventListeners();
    }
    /**
     * Rebuilds the entire graph from scratch recomputing
     *
     * - the inner width/height
     * - scales/axes
     *
     * After this is done it does a complete redraw of all the datums,
     * if only the datums need to be redrawn call `instance.draw()` instead
     *
     * @returns Chart
     */
    build() {
        this.internalVars();
        this.drawGraphWrapper();
        return this;
    }
    getDraggableNode() {
        return src_select(this.options.target)
            .select('.zoom-and-drag')
            .node();
    }
    /**
     * The draggable container won't change across different instances of Chart,
     * therefore multiple instances will share the draggable container, to avoid dispatching
     * the event from the old instance grab it in runtime with this function
     */
    getEmitInstance() {
        let cachedInstance = this;
        const cachedNode = this.getDraggableNode();
        if (cachedNode) {
            cachedInstance = cachedNode.instance;
        }
        return cachedInstance;
    }
    internalVars() {
        const margin = (this.meta.margin = { left: 40, right: 20, top: 20, bottom: 20 });
        // if there's a title make the top margin bigger
        if (this.options.title) {
            this.meta.margin.top = 40;
        }
        // inner width/height
        this.meta.width = (this.options.width || globals.DEFAULT_WIDTH) - margin.left - margin.right;
        this.meta.height = (this.options.height || globals.DEFAULT_HEIGHT) - margin.top - margin.bottom;
        this.initializeAxes();
    }
    initializeAxes() {
        const self = this;
        const integerFormat = format('~s');
        function formatter(d) {
            // take only the decimal part of the number
            const frac = Math.abs(d) - Math.floor(Math.abs(d));
            if (frac > 0) {
                return d.toString();
            }
            else {
                return integerFormat(d);
            }
        }
        function computeYScale(xScale) {
            // assumes that xScale is a linear scale
            const xDiff = xScale[1] - xScale[0];
            return (self.meta.height * xDiff) / self.meta.width;
        }
        this.options.xAxis = this.options.xAxis || {};
        this.options.xAxis.type = this.options.xAxis.type || 'linear';
        this.options.yAxis = this.options.yAxis || {};
        this.options.yAxis.type = this.options.yAxis.type || 'linear';
        const xDomain = (this.meta.xDomain = (function (axis) {
            if (axis.domain) {
                return axis.domain;
            }
            if (axis.type === 'linear') {
                const xLimit = 12;
                return [-xLimit / 2, xLimit / 2];
            }
            else if (axis.type === 'log') {
                return [1, 10];
            }
            throw Error('axis type ' + axis.type + ' unsupported');
        })(this.options.xAxis));
        const yDomain = (this.meta.yDomain = (function (axis) {
            if (axis.domain) {
                return axis.domain;
            }
            const yLimit = computeYScale(xDomain);
            if (axis.type === 'linear') {
                return [-yLimit / 2, yLimit / 2];
            }
            else if (axis.type === 'log') {
                return [1, 10];
            }
            throw Error('axis type ' + axis.type + ' unsupported');
        })(this.options.yAxis));
        if (!this.meta.xScale) {
            this.meta.xScale = getD3Scale(this.options.xAxis.type)();
        }
        this.meta.xScale
            .domain(xDomain)
            // @ts-ignore domain always returns typeof this.meta.xDomain
            .range(this.options.xAxis.invert ? [this.meta.width, 0] : [0, this.meta.width]);
        if (!this.meta.yScale) {
            this.meta.yScale = getD3Scale(this.options.yAxis.type)();
        }
        this.meta.yScale
            .domain(yDomain)
            // @ts-ignore domain always returns typeof this.meta.yDomain
            .range(this.options.yAxis.invert ? [0, this.meta.height] : [this.meta.height, 0]);
        if (!this.meta.xAxis) {
            this.meta.xAxis = axisBottom(this.meta.xScale);
        }
        this.meta.xAxis.tickSize(this.options.grid ? -this.meta.height : 0).tickFormat(formatter);
        if (!this.meta.yAxis) {
            this.meta.yAxis = axisLeft(this.meta.yScale);
        }
        this.meta.yAxis.tickSize(this.options.grid ? -this.meta.width : 0).tickFormat(formatter);
        this.line = src_line()
            .x(function (d) {
            return self.meta.xScale(d[0]);
        })
            .y(function (d) {
            return self.meta.yScale(d[1]);
        });
    }
    drawGraphWrapper() {
        const root = (this.root = src_select(this.options.target)
            .selectAll('svg')
            .data([this.options]));
        // enter
        // prettier-ignore
        this.root.enter = root.enter().append('svg')
            .attr('class', 'function-plot')
            .attr('font-size', this.getFontSize());
        // enter + update
        root
            .merge(this.root.enter)
            .attr('width', this.meta.width + this.meta.margin.left + this.meta.margin.right)
            .attr('height', this.meta.height + this.meta.margin.top + this.meta.margin.bottom);
        this.buildTitle();
        this.buildLegend();
        this.buildCanvas();
        this.buildClip();
        this.buildAxis();
        this.buildAxisLabel();
        // helper to detect the closest fn to the cursor's current abscissa
        const tip = (this.tip = mouseTip(Object.assign(this.options.tip || {}, { owner: this })));
        this.canvas.merge(this.canvas.enter).call(tip);
        this.setUpPlugins();
        // draw each datum after the wrapper and plugins were set up
        this.draw();
        // zoom helper on top
        this.buildZoomHelper();
    }
    buildTitle() {
        // join
        const selection = this.root
            .merge(this.root.enter)
            .selectAll('text.title')
            .data(function (d) {
            return [d.title].filter(Boolean);
        });
        // enter
        const selectionEnter = selection.enter().append('text');
        selectionEnter
            .merge(selection)
            .attr('class', 'title')
            .attr('y', this.meta.margin.top / 2)
            .attr('x', this.meta.margin.left + this.meta.width / 2)
            .attr('font-size', 25)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text(this.options.title);
        // exit
        selection.exit().remove();
    }
    buildLegend() {
        // enter
        this.root.enter.append('text').attr('class', 'top-right-legend').attr('text-anchor', 'end');
        // update + enter
        this.root
            .merge(this.root.enter)
            .select('.top-right-legend')
            .attr('y', this.meta.margin.top / 2)
            .attr('x', this.meta.width + this.meta.margin.left);
    }
    buildCanvas() {
        // enter
        const canvas = (this.canvas = this.root
            .merge(this.root.enter)
            .selectAll('.canvas')
            .data(function (d) {
            return [d];
        }));
        this.canvas.enter = canvas.enter().append('g').attr('class', 'canvas');
        // enter + update
    }
    buildClip() {
        // (so that the functions don't overflow on zoom or drag)
        const id = this.id;
        const defs = this.canvas.enter.append('defs');
        defs
            .append('clipPath')
            .attr('id', 'function-plot-clip-' + id)
            .append('rect')
            .attr('class', 'clip static-clip');
        // enter + update
        this.canvas
            .merge(this.canvas.enter)
            .selectAll('.clip')
            .attr('width', this.meta.width)
            .attr('height', this.meta.height);
        // marker clip (for vectors)
        defs
            .append('clipPath')
            .append('marker')
            .attr('id', this.markerId)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('markerWidth', 5)
            .attr('markerHeight', 5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5L0,0')
            .attr('stroke-width', '0px')
            .attr('fill-opacity', 1)
            .attr('fill', '#777');
    }
    buildAxis() {
        // axis creation
        const canvasEnter = this.canvas.enter;
        canvasEnter.append('g').attr('class', 'x axis');
        canvasEnter.append('g').attr('class', 'y axis');
        // update
        this.canvas
            .merge(this.canvas.enter)
            .select('.x.axis')
            .attr('transform', 'translate(0,' + this.meta.height + ')')
            .call(this.meta.xAxis);
        this.canvas.merge(this.canvas.enter).select('.y.axis').call(this.meta.yAxis);
    }
    buildAxisLabel() {
        // axis labeling
        const canvas = this.canvas;
        const xLabel = canvas
            .merge(canvas.enter)
            .selectAll('text.x.axis-label')
            .data(function (d) {
            return [d.xAxis.label].filter(Boolean);
        });
        // prettier-ignore
        const xLabelEnter = xLabel.enter().append('text')
            .attr('class', 'x axis-label')
            .attr('text-anchor', 'end');
        xLabel
            .merge(xLabelEnter)
            .attr('x', this.meta.width)
            .attr('y', this.meta.height - 6)
            .text(function (d) {
            return d;
        });
        xLabel.exit().remove();
        const yLabel = canvas
            .merge(canvas.enter)
            .selectAll('text.y.axis-label')
            .data(function (d) {
            return [d.yAxis.label].filter(Boolean);
        });
        const yLabelEnter = yLabel
            .enter()
            .append('text')
            .attr('class', 'y axis-label')
            .attr('y', 6)
            .attr('dy', '.75em')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-90)');
        yLabel.merge(yLabelEnter).text(function (d) {
            return d;
        });
        yLabel.exit().remove();
    }
    /**
     * @private
     *
     * Draws each of the datums stored in data.options, to do a full
     * redraw call `instance.draw()`
     */
    buildContent() {
        const self = this;
        const canvas = this.canvas;
        canvas
            .merge(canvas.enter)
            .attr('transform', 'translate(' + this.meta.margin.left + ',' + this.meta.margin.top + ')');
        const content = (this.content = canvas
            .merge(canvas.enter)
            .selectAll(':scope > g.content')
            .data(function (d) {
            return [d];
        }));
        // g tag clipped to hold the data
        const contentEnter = content
            .enter()
            .append('g')
            .attr('clip-path', 'url(#function-plot-clip-' + this.id + ')')
            .attr('class', 'content');
        // helper line, x = 0
        if (this.options.xAxis.type === 'linear') {
            const yOrigin = content
                .merge(contentEnter)
                .selectAll(':scope > path.y.origin')
                .data([
                [
                    [0, this.meta.yScale.domain()[0]],
                    [0, this.meta.yScale.domain()[1]]
                ]
            ]);
            const yOriginEnter = yOrigin
                .enter()
                .append('path')
                .attr('class', 'y origin')
                .attr('stroke', 'black')
                .attr('opacity', 0.2);
            yOrigin.merge(yOriginEnter).attr('d', this.line);
        }
        // helper line y = 0
        if (this.options.yAxis.type === 'linear') {
            const xOrigin = content
                .merge(contentEnter)
                .selectAll(':scope > path.x.origin')
                .data([
                [
                    [this.meta.xScale.domain()[0], 0],
                    [this.meta.xScale.domain()[1], 0]
                ]
            ]);
            const xOriginEnter = xOrigin
                .enter()
                .append('path')
                .attr('class', 'x origin')
                .attr('stroke', 'black')
                .attr('opacity', 0.2);
            xOrigin.merge(xOriginEnter).attr('d', this.line);
        }
        // annotations
        content.merge(contentEnter).call(annotations({ owner: self }));
        // content construction
        // - join options.data to <g class='graph'> elements
        // - for each datum determine the sampler to use
        const graphs = content
            .merge(contentEnter)
            .selectAll(':scope > g.graph')
            .data((d) => {
            return d.data.map(datumDefaults);
        }, (d) => {
            // The key is the function set or other value that uniquely identifies the datum.
            return d.fn || d.r || d.x || d.text;
        });
        // exit
        graphs.exit().remove();
        // enter
        const graphsEnter = graphs.enter().append('g').attr('class', 'graph');
        // enter + update
        graphs.merge(graphsEnter).each(function (d, index) {
            // additional options needed in the graph-types/helpers
            d.index = index;
            // (hidden property)
            // @ts-ignore
            d.generation = self.generation;
            const selection = src_select(this);
            selection.call(globals.graphTypes[d.graphType](self));
            selection.call(helpers(self));
        });
        this.generation += 1;
    }
    buildZoomHelper() {
        // dummy rect (detects the zoom + drag)
        const self = this;
        if (!this.meta.zoomBehavior) {
            this.meta.zoomBehavior = zoom().on('zoom', function onZoom(ev) {
                self.getEmitInstance().emit('all:zoom', ev);
            });
            // the zoom behavior must work with a copy of the scale, the zoom behavior has its own state and assumes
            // that its updating the original scale!
            // things that failed when I tried rescaleX(self.meta.xScale), the state of self.meta.xScale was a multiplied
            // for zoom/mousemove operations
            //
            // this copy should only be created once when the application starts
            self.meta.zoomBehavior.xScale = self.meta.xScale.copy();
            self.meta.zoomBehavior.yScale = self.meta.yScale.copy();
        }
        // in the case where the original scale domains were updated (because of a change in the size of the canvas)
        // update the range only but not the domain, the domain is going to be updated
        self.meta.zoomBehavior.xScale.range(self.meta.xScale.range());
        self.meta.zoomBehavior.yScale.range(self.meta.yScale.range());
        // enter
        this.canvas.enter
            .append('rect')
            .call(this.meta.zoomBehavior)
            .attr('class', 'zoom-and-drag')
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mouseover', function (event) {
            self.getEmitInstance().emit('all:mouseover', event);
        })
            .on('mouseout', function (event) {
            self.getEmitInstance().emit('all:mouseout', event);
        })
            .on('mousemove', function (event) {
            self.getEmitInstance().emit('all:mousemove', event);
        });
        // update + enter
        this.draggable = this.canvas
            .merge(this.canvas.enter)
            .select('.zoom-and-drag')
            .call((selection) => {
            if (selection.node()) {
                // store the instance for the next run
                selection.node().instance = self;
            }
        })
            .attr('width', this.meta.width)
            .attr('height', this.meta.height);
    }
    setUpPlugins() {
        const plugins = this.options.plugins || [];
        const self = this;
        plugins.forEach(function (plugin) {
            plugin(self);
        });
    }
    updateAxes() {
        const instance = this;
        const canvas = instance.canvas.merge(instance.canvas.enter);
        canvas.select('.x.axis').call(instance.meta.xAxis);
        canvas.select('.y.axis').call(instance.meta.yAxis);
        // updates the style of the axes
        canvas
            .selectAll('.axis path, .axis line')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('shape-rendering', 'crispedges')
            .attr('opacity', 0.1);
    }
    syncOptions() {
        // update the original options yDomain and xDomain, this is done so that next calls to functionPlot()
        // with the same object preserve some of the computed state
        this.options.xAxis.domain = [this.meta.xScale.domain()[0], this.meta.xScale.domain()[1]];
        this.options.yAxis.domain = [this.meta.yScale.domain()[0], this.meta.yScale.domain()[1]];
    }
    getFontSize() {
        return Math.max(Math.max(this.meta.width, this.meta.height) / 50, 8);
    }
    draw() {
        const instance = this;
        instance.emit('before:draw');
        instance.syncOptions();
        instance.updateAxes();
        instance.buildContent();
        instance.emit('after:draw');
    }
    setUpEventListeners() {
        const self = this;
        // before setting up the listeners, remove any listeners set on the previous instance, this happens because
        // the draggable container is shared across instances
        const prevInstance = this.getEmitInstance();
        if (prevInstance) {
            prevInstance.removeAllListeners();
        }
        const eventsThisInstance = {
            mousemove: function (coordinates) {
                self.tip.move(coordinates);
            },
            mouseover: function () {
                self.tip.show();
            },
            mouseout: function () {
                self.tip.hide();
            },
            zoom: function zoom({ transform }) {
                // disable zoom
                if (self.options.disableZoom)
                    return;
                const xScaleClone = transform.rescaleX(self.meta.zoomBehavior.xScale).interpolate(round);
                const yScaleClone = transform.rescaleY(self.meta.zoomBehavior.yScale).interpolate(round);
                // update the scales's metadata
                // NOTE: setting self.meta.xScale = self.meta.zoomBehavior.xScale creates artifacts and weird lines
                self.meta.xScale
                    .domain(xScaleClone.domain())
                    // @ts-ignore domain always returns typeof this.meta.yDomain
                    .range(xScaleClone.range());
                self.meta.yScale
                    .domain(yScaleClone.domain())
                    // @ts-ignore domain always returns typeof this.meta.yDomain
                    .range(yScaleClone.range());
            },
            'tip:update': function ({ x, y, index }) {
                const meta = self.root.merge(self.root.enter).datum().data[index];
                const title = meta.title || '';
                const format = meta.renderer ||
                    function (x, y) {
                        return x.toFixed(3) + ', ' + y.toFixed(3);
                    };
                const text = [];
                title && text.push(title);
                text.push(format(x, y));
                self.root.select('.top-right-legend').attr('fill', globals.COLORS[index]).text(text.join(' '));
            }
        };
        // all represents events that can be propagated to all the instances (including this one)
        const eventsAllInstances = {
            mousemove: function (event) {
                const mouse = pointer(event, self.draggable.node());
                const coordinates = {
                    x: self.meta.xScale.invert(mouse[0]),
                    y: self.meta.yScale.invert(mouse[1])
                };
                self.linkedGraphs.forEach(function (graph) {
                    graph.emit('before:mousemove', coordinates);
                    graph.emit('mousemove', coordinates);
                });
            },
            zoom: function (event) {
                self.linkedGraphs.forEach(function (graph) {
                    // hack to synchronize the zoom state across all the instances
                    graph.draggable.node().__zoom = self.draggable.node().__zoom;
                    graph.emit('zoom', event);
                    graph.draw();
                });
                // emit the position of the mouse to all the registered graphs
                self.emit('all:mousemove', event);
            }
        };
        // set listeners for this instance.
        for (const [event, callback] of Object.entries(eventsThisInstance)) {
            this.on(event, callback);
        }
        // set listeners for all instances.
        for (const [event, callback] of Object.entries(eventsAllInstances)) {
            this.on(`all:${event}`, callback);
        }
        for (const [event] of Object.entries(eventsThisInstance)) {
            if (!Object.hasOwn(eventsAllInstances, event)) {
                // create an event for each event existing on `eventsThisInstance` in the form 'all:' event
                // e.g. all:mouseover all:mouseout
                // the objective is that all the linked graphs receive the same event as the current graph
                this.on(`all:${event}`, function (...args) {
                    for (let i = 0; i < this.linkedGraphs.length; i += 1) {
                        const graph = this.linkedGraphs[i];
                        graph.emit(event, ...args);
                    }
                });
            }
        }
    }
    addLink(...args) {
        for (let i = 0; i < args.length; i += 1) {
            this.linkedGraphs.push(args[i]);
        }
    }
    /**
     * Removes a linked graph.
     */
    removeLink(instance) {
        const idx = this.linkedGraphs.indexOf(instance);
        if (idx > -1) {
            this.linkedGraphs = this.linkedGraphs.splice(idx, 1);
        }
    }
    /**
     * Destroys this instance of functionPlot,
     * if you added this to other instances through `addLink` make
     * sure you remove the links from the other instances to this
     * instance using `removeLink`.
     */
    destroy() {
        this.removeAllListeners();
        src_select(this.options.target)
            .selectAll('svg')
            .remove();
    }
}

;// CONCATENATED MODULE: ./src/index.ts






// register common graphTypes on library load.
registerGraphType('polyline', polyline);
registerGraphType('interval', interval_interval);
registerGraphType('scatter', Scatter);
registerGraphType('text', Text);
// Web workers initializer.
function withWebWorkers(nWorkers = 8, publicPath = window.location.href) {
    // @ts-ignore
    __webpack_require__.g.__webpack_public_path__ = publicPath;
    globals.workerPool = new IntervalWorkerPool(nWorkers);
}
/**
 * functionPlot is a function plotter of 2d functions.
 *
 * functionPlot creates an instance of {@link Chart} with the param options
 * and immediately calls {@link Chart#build} on it.
 *
 * `options` is augmented with additional internal computed data,
 * therefore, if you want to rerender graphs it's important to reuse
 * the same object to preserve state across builds.
 *
 * @param options The options sent to Chart
 */
function functionPlot(options) {
    options.data = options.data || [];
    let instance = Chart.cache[options.id];
    if (!instance) {
        instance = new Chart(options);
    }
    return instance.build();
}
functionPlot.globals = globals;
functionPlot.$eval = {
    builtIn: builtIn,
    interval: eval_interval
};
functionPlot.graphTypes = { interval: interval_interval, polyline: polyline, scatter: Scatter };
functionPlot.withWebWorkers = withWebWorkers;







})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=function-plot.js.map