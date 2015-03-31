# simple-function-plot [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

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
  // see the API below
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
    },
    range: [-5, 5]
  }, {
    fn: function (x) {
      return Math.sqrt(x);
    },
    graphOptions: {
      type: 'scatter'
    },
    range: [-5, 5]
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
  * `options.domain` {object} configuration used as the domain of the scales (e.g. `d3.scale.linear().domain(domain.x)`)
    * `options.domain.x` {array} 
    * `options.domain.y` {array} 
  * `options.tip` {object} configuration passed to `lib/tip`, it's the helper shown on mouseover on the closest
  function to the current mose position
    * `options.tip.xLine` {boolean} true to show a line parallel to the X axis on mouseover
    * `options.tip.yLine` {boolean} true to show a line parallel to the Y axis on mouseover
    * `options.tip.renderer` {function} Function to be called to define custom rendering on mouseover, called with the
     `x` and `f(x)` of the function which is closest to the mouse position (args: `x, y`)
  * `options.data` {array} *required* An array defining the functions to be rendered
    * `options.data[i].title` {string} title of the function
    * `options.data[i].fn` {function} the function itself, called with an independent value defined in `range`, it
    * `options.data[i].range` {array} An array with the range of values which `fn` is evaluated with, e.g.
    `[min, max, increment]`, in case increment is not passed it default to `(max - min) / 100`
    * `options.data[i].graphOptions` {Object} options passed to the the files located in `lib/type/`, the most useful
    property of this object is `type` which is used to determine the type of graph to be rendered for a function
   
## Development

After cloning the repo and running `npm install`

```sh
npm start
```

Open `localhost:5555` and that's it! Local development server powered [beefy](https://www.npmjs.com/package/beefy)

## TODO

- [ ] baselines (parallel to the X axis) http://metricsgraphicsjs.org/examples.htm
- [ ] annotations (parallel to the Y axis)

## License

2015 MIT © Mauricio Poppe

[npm-image]: https://nodei.co/npm/simple-function-plot.png?downloads=true
[npm-url]: https://npmjs.org/package/simple-function-plot
[travis-image]: https://travis-ci.org//simple-function-plot.svg?branch=master
[travis-url]: https://travis-ci.org//simple-function-plot
[coveralls-image]: https://coveralls.io/repos//simple-function-plot/badge.svg
[coveralls-url]: https://coveralls.io/r//simple-function-plot
