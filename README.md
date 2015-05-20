# function-plot [![Build Status][travis-image]][travis-url]

[![NPM][npm-image]][npm-url]

> A  2d function plotter powered by d3

Function Plot is a small library built on top of <a href="http://d3js.org/">D3.js</a> whose purpose
is to render functions with little configuration (think of it as a little clone of Google's plotting
utility: [y = x * x](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=y+%3D+x+%5E+2)

The library currently supports interactive line charts and scatterplots,
whenever the graph scale is modified the function is evaluated again with
the new bounds, result: infinite graphs!
    
Have a look at [the homepage](http://maurizzzio.github.io/function-plot/) for a detailed explanation on what the library is capable of

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

All the available options are described in the [`homepage`](http://maurizzzio.github.io/function-plot/)

## API

```
var functionPlot = require('function-plot');
```

### `instance = functionPlot(options)`

**params, All the params are optional unless otherwise stated**

* `options`
  * `options.target` {string} the selector of the parent element to render the graph to
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
  * `options.annotations` {array} An array defining parallel lines to the y-axis or the x-axis
    * `options.annotations[i].x` {number} x-coordinate of the line parallel to the y-axis
    * `options.annotations[i].y` {number} y-coordinate of the line parallel to the x-axis
    * `options.annotations[i].text` {string} text shown next to the parallel line    
  * `options.data` {array} *required* An array defining the functions to be rendered
    * `options.data[i].title` {string} title of the function
    * `options.data[i].skipTip` {boolean} true to avoid this function from being a target of the tip
    * `options.data[i].fn` *required* {string} the function that represents the curve, this function is evaluated 
    with values which are in `range` limiting the values to the screen min/max coordinates for `x`, i.e.
    at any given time the graph min/max x coordinates will limit the range of values to be plotted
    * `options.data[i].range` {number[]} if given the function will only be evaluated with multiple values from this range
    * `options.data[i].samples` {number} the fixed number of samples to be computed within the current domain ends
    * `options.data[i].implicit` {boolean} true to creates samples for the function considering it implicit, it assumes
    that the function depends on the variables *x* and *y*
    * `options.data[i].secants` {Object[]} Secants of `options.data[i].fn`
      * `options.data[i].secants[j].x0` {number} The abscissa of the first point
      * `options.data[i].secants[j].x1` {number} (optional if `updateOnMouseMove` is set) The abscissa of the second point
      * `options.data[i].secants[j].updateOnMouseMove` {boolean} (optional) True to update the secant line by evaluating
      `options.data[i].fn` with the current mouse position (`x0` is the fixed point and `x1` is computed
      dynamically based on the current mouse position)
    * `options.data[i].derivative` {Object} Info of the instantaneous rate of change of y with respect to x
      * `options.data[i].derivative.fn` {string} The derivative of `options.data[i].fn`
      * `options.data[i].derivative.x0` {number} The abscissa of the point which belongs to the curve
      represented by `options.data[i].fn` whose tangent will be computed (i.e. the tangent line to the point
      `x0, fn(x0)`)
      * `options.data[i].derivative.updateOnMouseMove` {boolean} True to compute the tangent line by evaluating
      `options.data[i].derivative.fn` with the current mouse position (i.e. let `x0` be the abscissa of the
      mouse position transformed to local coordinates, the tangent line to the point `x0, fn(x0)`)
    * `options.data[i].graphOptions` {Object} options passed to the the files located in `lib/type/` which plot the data
    generated by the library, the most useful property of this object is `type` which is used to determine the type of
    graph to be rendered for a function

### Graph Options

* `options` {Object}
  * `options.type` {string} type of graph, currently `line`, `scatter` and `interval` are supported,
  `interval` is the default option

Depending on the type option:

#### `line`, `interval`

  * `options.closed` {boolean} True to close the path, for any segment of the closed area graph
    `y0` will be 0 and `y1` will be `f(x)`  
  
### `instance`  

* `instance.id` {string} equal to `options.target`
* `instance.linkedGraphs` {array} array of function-plot instances linked to the events of this instance,
i.e. when the zoom event is dispatched on this instance it's also dispatched on all the instances of
this array
* `instance.meta` {object}
  * `instance.meta.margin` {object} graph's left,right,top,bottom margins
  * `instance.meta.width` {number} width of the canvas (minus the margins)
  * `instance.meta.height` {number} height of the canvas (minus the margins)
  * `instance.meta.xScale` {d3.scale.linear} graph's x-scale
  * `instance.meta.yScale` {d3.scale.linear} graph's y-scale
  * `instance.meta.xAxis` {d3.svg.axis} graph's x-axis
  * `instance.meta.yAxis` {d3.svg.axis} graph's y-axis
* `instance.root` {d3.selection} `svg` element that holds the graph (canvas + title + axes)
* `instance.canvas` {d3.selection} `g.canvas` element that holds the area where the graphs are plotted
(clipped with a mask)

**Events**

An instance can subscribe to any of the following events by doing `instance.on([eventName], callback)`,
events can be triggered by doing `instance.emit([eventName][, params])`

* `mouseover` fired whenever the mouse is over the canvas
* `mousemove` fired whenever the mouse is moved inside the canvas, callback params `x`, `y` (in canvas space
coordinates)
* `mouseout` fired whenever the mouse is moved outside the canvas
* `draw` emit this event to redraw the contents of the canvas
* `zoom:scaleUpdate` fired whenever the scale of another graph is updated, callback params `xScale`, `yScale`
(x-scale and y-scale of another graph whose scales were updated)
* `tip:update` fired whenever the tip position is updated, callback params `x`, `y`, `index` (in canvas
space coordinates, `index` is the index of the graph where the tip is on top of)
* `all:mousemove` same as `mousemove` but it's dispatched for all the linked graphs
* `all:zoom` fired whenever there's scaling/translation on the graph, dispatched on all the linked graphs

## Development

After cloning the repo and running `npm install`

```sh
node site.js    // generate the examples shown on index.html
npm start
```

Open `127.0.0.1:5555` and that's it! Local development server powered [beefy](https://www.npmjs.com/package/beefy)

Plain demo: `127.0.0.1:5555/demo.html` 

## License

2015 MIT © Mauricio Poppe

[npm-image]: https://nodei.co/npm/function-plot.png?downloads=true
[npm-url]: https://npmjs.org/package/function-plot
[travis-image]: https://travis-ci.org/maurizzzio/function-plot.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/function-plot
