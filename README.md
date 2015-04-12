# function-plot [![Build Status][travis-image]][travis-url]

[![NPM][npm-image]][npm-url]

> A  2d function plotter powered by d3

## Install

```sh
$ npm install --save function-plot
```

## Usage

```js
var d3 = window.d3
var functionPlot = require('function-plot');
functionPlot({
  // options below
})
```

## Example

See `site/js/index.js`

```javascript
'use strict';
var d3 = window.d3;
var functionPlot = window.functionPlot;
functionPlot({
  target: '#canvas',
  data: [{
    title: 'f(x)',
    fn: function (x) {
      return -x * x;
    }
  }, {
    fn: function (x) {
      return Math.sqrt(x);
    },
    graphOptions: {
      type: 'scatter'
    }
  }, {
    fn: function (x) {
      return 1 / x;
    },
    graphOptions: {
      limits: [0],
      interpolate: 'linear'
    }
  }]
});
```

## API

```
var functionPlot = require('function-plot');
```

### `functionPlot(options)`

**params, All the params are optional unless otherwise stated**

* `options`
  * `options.title` {string} If set the chart will have it as a title on the top
  * `options.xDomain` {array} domain of the linear scale (used in the x axis) 
  * `options.yDomain` {array} domain of the linear scale (used in the y axis)
  * `options.xLabel` {string} x axis label 
  * `options.yLabel` {string} y axis label
  * `options.disableZoom` {boolean} true to disable drag and zoom on the graph
  * `options.tip` {object} configuration passed to `lib/tip`, it's the helper shown on mouseover on the closest
  function to the current mose position
    * `options.tip.xLine` {boolean} true to show a line parallel to the X axis on mouseover
    * `options.tip.yLine` {boolean} true to show a line parallel to the Y axis on mouseover
    * `options.tip.renderer` {function} Function to be called to define custom rendering on mouseover, called with the
     `x` and `f(x)` of the function which is closest to the mouse position (args: `x, y`)
  * `options.data` {array} *required* An array defining the functions to be rendered
    * `options.data[i].title` {string} title of the function
    * `options.data[i].skipTip` {boolean} true to avoid this function from being a target of the tip
    * `options.data[i].fn` {function} the function that represents the curve, this function is evaluated 
    with values which are in `range` limiting the values to the screen min/max coordinates for `x`, i.e.
    at any given time the graph min/max x coordinates will limit the range of values to be plotted
    * `options.data[i].range` {number[]} if given the function will only be evaluated with multiple values from this range
    * `options.data[i].samples` {number} the fixed number of samples to be computed at the current domain ends
    * `options.data[i].deltaX` {number} the increment used in each iteration to reach the width of the chart i.e.
    this quantity is added k times to the x scale's min x value until it surpasses the x scale's max value,
    defaults to `(max - min) / 100`    
    * `options.data[i].derivative` {Object} Info of the instantaneous rate of change of y with respect to x
      * `options.data[i].derivative.fn` {Function} The derivative of `options.data[i].fn`
      * `options.data[i].derivative.x0` {number} The abscissa of the point which belongs to the curve
      represented by `options.data[i].fn` whose tangent will be computed (i.e. the tangent line to the point
      `x0, fn(x0)`)
      * `options.data[i].derivative.updateOnMouseOver` {boolean} True to compute the tangent line by evaluating
      `options.data[i].derivative.fn` with the current mouse position (i.e. let `x0` be the abscissa of the
      mouse position transformed to local coordinates, the tangent line to the point `x0, fn(x0)`)
    * `options.data[i].graphOptions` {Object} options passed to the the files located in `lib/type/`, the most useful
    property of this object is `type` which is used to determine the type of graph to be rendered for a function
      * `options.data[i].graphOptions.type` {string} the type of graph to render for the function (possible values: 
      'line', 'scatter')

### Graph Options

Common options:

* `options`
  * **experimental** `options.limits` {number[]} x values which make the function undefined, e.g. in `1/x` the value 0 makes the 
  function invalid

Depending on the type of graph:

#### `line`

* `options`
  * `options.interpolate` {string} passed to `d3.svg.line().interpolate( ... )`  
  
## Development

After cloning the repo and running `npm install`

```sh
node site.js    // generate the examples shown on index.html
npm start
```

Open `127.0.0.1:5555` and that's it! Local development server powered [beefy](https://www.npmjs.com/package/beefy)

Plain demo: `127.0.0.1:5555/demo.html` 

## TODO

- [ ] baselines (parallel to the X axis) http://metricsgraphicsjs.org/examples.htm
- [ ] annotations (parallel to the Y axis)
- [X] axis labeling

## License

2015 MIT © Mauricio Poppe

[npm-image]: https://nodei.co/npm/function-plot.png?downloads=true
[npm-url]: https://npmjs.org/package/function-plot
[travis-image]: https://travis-ci.org/maurizzzio/function-plot.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/function-plot
