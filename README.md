# simple-function-plot [![Build Status][travis-image]][travis-url]

[![NPM][npm-image]][npm-url]

> A simple 2d function plotter powered by d3 and used on http://blog.maurizzzio.com

## Install

```sh
$ npm install --save simple-function-plot
```

## Usage

```js
var simpleFunctionPlot = require('simple-function-plot');
var instance = simpleFunctionPlot({
  // options below
})
d3.select(' selector of the parent container for the chart ')
  .call(instance)
```

## Example

See `public/index.js`

```javascript
'use strict';
var d3 = window.d3;
var simpleFunctionPlot = require('../');
var instance = simpleFunctionPlot({
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
d3.select('#canvas')
  .call(instance);
```

Screenshot (for the example located at `public/index.js`):

![screen shot 2015-03-31 at 3 04 07 am](https://cloud.githubusercontent.com/assets/1616682/6913963/11013696-d754-11e4-8bf1-8008f36cd670.gif)

## API

```
var simpleFunctionPlot = require('simple-function-plot');
```

### `simpleFunctionPlot(options)`

**params, All the params are optional unless otherwise stated**

* `options`
  * `options.title` {string} If set the chart will have it as a title on the top
  * `options.domainX` {array} domain of the linear scale (used in the x axis) 
  * `options.domainY` {array} domain of the linear scale (used in the y axis)
  * `options.labelX` {string} x axis label 
  * `options.labelY` {string} y axis label
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
    * `options.data[i].increment` {number} the increment used in each iteration to reach the width of the chart i.e.
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
      * `options.data[i].graphOptions.type` {string} the type of graph to render for the function

### Single Graph Options

Common options:

* `options`
  * `options.limits` {number[]} x values which make the function undefined, e.g. in `1/x` the value 0 makes the 
  function invalid

Depending on the type of graph:

#### `line`

* `options`
  * `options.interpolate` {string} passed to `d3.svg.line().interpolate( ... )`  
  
## Development

After cloning the repo and running `npm install`

```sh
npm start
```

Open `localhost:5555` and that's it! Local development server powered [beefy](https://www.npmjs.com/package/beefy)

## TODO

- [ ] baselines (parallel to the X axis) http://metricsgraphicsjs.org/examples.htm
- [ ] annotations (parallel to the Y axis)
- [X] axis labeling

## License

2015 MIT © Mauricio Poppe

[npm-image]: https://nodei.co/npm/simple-function-plot.png?downloads=true
[npm-url]: https://npmjs.org/package/simple-function-plot
[travis-image]: https://travis-ci.org/maurizzzio/simple-function-plot.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/simple-function-plot
