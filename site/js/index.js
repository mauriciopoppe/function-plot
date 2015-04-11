'use strict';
$(document).on('markupLoaded', function () {
  var functionPlot = window.functionPlot;
  /**
   * ## Plotting a curve
   *
   * The shortest example, the function $y = x^2$ is evaluated with values inside the range
   * defined by the canvas size (the default dimensions are `550x350`),
   * whenever the local space is modified (because of a translate/scale operation)
   * the function is evaluated again with the new bounds, result: infinite graphs!
   *
   * The required parameters are:
   *
   * - `target` a selector to get an existing node
   * - `data` an array of objects which contain info about the functions to render
   */
  functionPlot({
    target: '#linear',
    data: [{
      fn: function (x) {
        return x * x;
      }
    }]
  });

  /**
   * ## Additional options
   *
   * Additionally the graph can have the following options defined on the top level object:
   *
   * - `title`: the title of the graph
   * - `width`: width of the graph
   * - `height`: height of the graph
   * - `xLabel`: x axis label
   * - `yLabel`: y axis label
   * - `disableZoom`: true to disable translation/scaling on the graph
   */
  functionPlot({
    title: 'y = sin(x)',
    target: '#linear-with-options',
    width: 400,
    height: 300,
    disableZoom: true,
    xLabel: 'x - axis',
    yLabel: 'y - axis',
    data: [{
      fn: function (x) {
        return Math.sin(x);
      }
    }]
  });

  /**
   * ## Domain
   *
   * The domains of both axes can be changed with the following configurations:
   *
   * - `xDomain`, defaults to `[-5, 5]`
   * - `yDomain`, defaults to `[-5, 5]`
   */
  functionPlot({
    target: '#domain',
    yDomain: [-1, 1],
    xDomain: [8, 24],
    data: [{
      fn: function (x) {
        return Math.sin(x);
      }
    }]
  });

  /**
   * ## Closed Path + Range
   *
   * You can also restrict the values to be evaluated with the `range` option,
   * this works really nice with the `closed` option of the `line` type to render
   * for example a [definite integral](http://mathworld.wolfram.com/DefiniteIntegral.html)
   */
  functionPlot({
    target: '#closed',
    xDomain: [0, 10],
    data: [{
      fn: function (x) {
        return 3 + Math.sin(x);
      },
      graphOptions: {
        type: 'line',
        closed: true
      },
      range: [2, 8]
    }]
  });

  /**
   * ## Limits
   *
   * Some functions approach to infinity or are undefined under a range of values,
   * for example $y = 1/x$ when coming from the left of $x=0$ approaches $-\infty$ and
   * when coming from the right of $x=0$ approaches $+\infty$, to deal with continuity
   * problems we can specify the places the function is undefined/infinity under
   * the option `limits`
   */
  functionPlot({
    target: '#withLimits',
    data: [{
      title: 'f(x) = 1/x',
      fn: function (x) {
        return 1 / x;
      },
      graphOptions: {
        limits: [0],
        interpolate: 'linear'
      }
    }]
  });

  /**
   * ## Multiple graphs
   *
   * `data` as seen in the examples above is an array, which means that multiple
   * functions can be rendered in the same graph
   */
  functionPlot({
    target: '#multiple',
    data: [
      {fn: function (x) { return x; }},
      {fn: function (x) { return -x; }},
      {fn: function (x) { return x * x; }},
      {fn: function (x) { return x * x * x; }},
      {fn: function (x) { return x * x * x * x; }}
    ]
  });

  /**
   * ## Scatter
   *
   * A function can be represented with some points belonging to the curve
   */
  functionPlot({
    target: '#scatter',
    yDomain: [-1, 9],
    data: [{
      fn: function (x) {
        return Math.sqrt(x);
      },
      graphOptions: {
        type: 'scatter'
      }
    }]
  });

  /**
   * ## Tip
   *
   * The little circle that has the x-coordinate of the mouse position is called
   * a "tip", the following options can be configured:
   *
   * - `xLine` true to show a dashed line parallel to $y = 0$ on the tip position
   * - `yLine` true to show a dashed line parallel to $x = 0$ on the tip position
   * - `renderer` a custom rendering function for the text shown in the tip
   */
  functionPlot({
    target: '#tip',
    tip: {
      xLine: true,    // dashed line parallel to y = 0
      yLine: true,    // dashed line parallel to x = 0
      renderer: function (x, y, index) {
        // decide what to do show here
        // the returning value will be shown in the tip
      }
    },
    yDomain: [-1, 9],
    data: [
      { fn: function (x) { return x * x; }}
    ]
  });

  /**
   * ## Derivative
   *
   * If a data object has a `derivative` object then its property `fn` will be used to compute
   * the equation of the line tangent to the point `x0`, i.e. the point $(x_0, f(x_0))$
   * (the derivative is a function which gives the slope of the tangent line at any derivable point)
   */
  functionPlot({
    target: '#derivative',
    yDomain: [-1, 9],
    data: [{
      fn: function (x) {
        return x * x;
      },
      derivative: {
        fn: function (x) {
          return 2 * x;
        },
        x0: 2
      }
    }]
  });

  /**
   * ## Derivative - Tangent line auto update
   *
   * if `updateOnMouseOver` is set to true then tangent line is computed whenever the mouse is moved
   * inside the canvas (let $x_0$ be the mouse's abscissa then the tangent line to the point
   * $(x_0, f(x_0))$ is computed whenever the position of the mouse changes)
   */
  functionPlot({
    target: '#derivativeLive',
    yDomain: [-1, 9],
    data: [{
      fn: function (x) {
        return x * x;
      },
      derivative: {
        fn: function (x) {
          return 2 * x;
        },
        updateOnMouseOver: true
      }
    }]
  });

  /**
   * ## Derivative - Tangent multiple lines
   *
   * An example of a graph with multiple functions, each function is configured with
   * a `derivative` object with auto update of the slope as described above
   */
  functionPlot({
    target: '#derivativeLiveMulti',
    data: [{
      fn: function (x) {
        return x * x;
      },
      derivative: {
        fn: function (x) {
          return 2 * x;
        },
        updateOnMouseOver: true
      }
    }, {
      fn: function (x) {
        return x * x * x;
      },
      derivative: {
        fn: function (x) {
          return 3 * x * x;
        },
        updateOnMouseOver: true
      }
    }]
  });

  /**
   * ## Linked graphs
   *
   * Multiple graphs can be linked, when the tip's position, graph scale or
   * graph translate properties are modified on the original graph the linked
   * graphs are signaled with the same events
   */
  var instanceA = functionPlot({
    target: '#linkedA',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: function (x) { return x * x; } }]
  });
  var instanceB = functionPlot({
    target: '#linkedB',
    height: 250,
    xDomain: [-10, 10],
    disableZoom: true,
    data: [{ fn: function (x) { return 2 * x; } }]
  });
  instanceA.addLink(instanceB);

  /** */
});


$('#content').load('partials/all.html', function () {
  $(document).trigger('markupLoaded');
  MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
});
