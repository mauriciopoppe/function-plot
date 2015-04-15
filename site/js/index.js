'use strict';
$(document).on('markupLoaded', function () {
  var functionPlot = window.functionPlot;
  var a, b, c;

  functionPlot({
    target: '#description-sample',
    yDomain: [-1, 9],
    tip: {
      renderer: function () {}
    },
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
   * ### Plotting a curve
   *
   * The shortest example, the function $y = x^2$ is evaluated with values inside the range
   * defined by the canvas size (the default dimensions are `550x350`)
   *
   * The required parameters are:
   *
   * - `target` a selector to the node to hold the graph
   * - `data` an array of objects which contain info about the functions to render
   */
  functionPlot({
    target: '#quadratic',
    data: [{
      fn: function (x) {
        return x * x;
      }
    }]
  });

  /**
   * ### Additional options
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
    title: 'y = x * x',
    target: '#quadratic-with-options',
    width: 580,
    height: 400,
    disableZoom: true,
    xLabel: 'x - axis',
    yLabel: 'y - axis',
    data: [{
      fn: function (x) {
        return x * x;
      }
    }]
  });

  /**
   * ### Domain
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
      },
      deltaX: 0.01
    }]
  });

  /**
   * ### $\Delta{x}$
   *
   * `deltaX` the change in $x$ to use as increment between samples of the current domain ends i.e. let
   * $x_0$ and $x_n$ be the domain ends, $f(x)$ will be sampled with $f(x_0 + k_0 \* \Delta{x}),
   * f(x_0 + k_1 \* \Delta{x}), \ldots, f(x_0 + k_n \* \Delta{x})$ where
   * $0 \leq k_i \* \Delta{x} \leq x_n - x_0$
   *
   * e.g. $\Delta{x}$ = 0.1
   *
   * $$
   * domain = [-5, 5] \\\
   * \Delta{x} = 0.1 \\\
   * values = -5, -4.9, -4.8, \ldots, 4.8, 4.9, 5.0
   * $$
   *
   * $$
   * domain = [-10, 10] \\\
   * \Delta{x} = 0.1 \\\
   * values = -10, -9.9, -9.8, \ldots, 9.8, 9.9, 10
   * $$
   */
  functionPlot({
    target: '#graphOptionsDeltaX',
    data: [{
      fn: function (x) {
        return Math.sin(x);
      },
      deltaX: 0.01
    }]
  });

  /**
   * ### Samples
   *
   * `samples` sets a fixed number of samples between the current domain ends, `deltaX`
   * is set dynamically each time the graph is rendered with this param, note that `samples`
   * has a higher priority than `deltaX`
   *
   * e.g.  samples = 100
   *
   * $$
   * domain = [-5, 5] \\\
   * \Delta{x} = \frac{5 - -5}{100} = 0.1 \\\
   * values = -5, -4.9, -4.8, \ldots, 4.8, 4.9, 5.0
   * $$
   *
   * $$
   * domain = [-10, 10] \\\
   * \Delta{x} = \frac{10 - -10}{100} = 0.2 \\\
   * values = -10, -9.8, -9.6, \ldots, 9.6, 9.8, 10
   * $$
   *
   */
  functionPlot({
    target: '#graphOptionsSamples',
    data: [{
      fn: function (x) {
        return Math.sin(x);
      },
      samples: 1000
    }]
  });

  /**
   * ### Closed Path + Range
   *
   * Additional graph options for each graph renderer can be set under `graphOptions`,
   * these options will be used by each type of graph.
   *
   * You can restrict the values to be evaluated with the `range` option,
   * this works really nice with the `closed` option of the `line` type to render
   * for example a [definite integral](http://mathworld.wolfram.com/DefiniteIntegral.html)
   *
   * Available `graphOptions`
   *
   * - `type`: the type of graph, currently `line` and `scatter` are supported
   * - `interpolate`: used by the `line` type sets the interpolate option for `d3.svg.line`
   * - `closed`: true to use `d3.svg.area` instead of `d3.svg.line`, `y0` will always be
   * 0 and `y1` will be $fn(x)$
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
   * ### Multiple graphs
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
   * ### Scatter
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
   * ### Tip
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
        // the returning value will be shown in the tip
      }
    },
    yDomain: [-1, 9],
    data: [
      { fn: function (x) { return x * x; }}
    ]
  });

  /**
   * ### Derivative
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
   * ### Derivative <br> <div class="small">Tangent line on mouse's position</div>
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
   * ### Derivative <br> <div class="small">Multiple tangent lines</div>
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
   * ### Linked graphs
   *
   * Multiple graphs can be linked, when the tip's position, graph scale or
   * graph translate properties are modified on the original graph the linked
   * graphs are signaled with the same events, in the following example `a`
   * also fires the internal `all:zoom` event, the `zoom` operation is performed
   * on `a` and `b`, but when `b` fires the `all:zoom` event the zoom operation is only
   * performed on `b`
   */
  a = functionPlot({
    target: '#linkedA',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: function (x) { return x * x; } }]
  });
  b = functionPlot({
    target: '#linkedB',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: function (x) { return 2 * x; } }]
  });
  a.addLink(b);

  /**
   * ### Linked graphs <div class="small">Multiple</div>
   *
   * Since the `zoom` event is dispatched to all the linked graphs as well, one can
   * set as many linked graphs as wanted and all of them will perform the same
   * zoom operation, in the following example these functions are plotted:
   *
   * - $y = x^2$
   * - $y' = 2x$
   * - $y'' = 2$
   *
   */
  a = functionPlot({
    target: '#linkedAMultiple',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: function (x) { return x * x; } }]
  });
  b = functionPlot({
    target: '#linkedBMultiple',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: function (x) { return 2 * x; } }]
  });
  c = functionPlot({
    target: '#linkedCMultiple',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: function (x) { return 2; } }]
  });
  a.addLink(b, c);
  b.addLink(a, c);
  c.addLink(a, b);

  /**
   * ### Update
   *
   * To update a graphic one needs to call `functionPlot` on the same target
   * element with *any* object that is configured properly
   *
   * @additionalDOM
   *
   *    <button id="update" class="btn btn-primary">Update</button>
   */
  var options = {
    target: '#quadratic-update',
    data: [{
      fn: function (x) {
        return x;
      }
    }]
  };
  $('#update').click(function () {
    if (!options.title) {
      // add a title, a tip and change the function to y = x * x
      options.title = 'hello world';
      options.tip = {
        xLine: true,
        yLine: true
      };
      options.data[0] = {
        fn: function (x) {
          return x * x;
        },
        derivative: {
          fn: function (x) {
            return 2 * x;
          },
          updateOnMouseOver: true
        }
      }
    } else {
      // remove the title and the tip
      // update the function to be y = x
      delete options.title;
      delete options.tip;
      options.data[0] =  {
        fn: function (x) {
          return x;
        }
      }
    }
    functionPlot(options);
  });
  // initial plot
  functionPlot(options);

  /**
   * ### With [Math.js](http://mathjs.org/)
   *
   * You can parse functions using <img style="width: 50px; height: 15px" src="img/mathjs_330x100.png"/>
   * taking advantage of its nifty syntax, in the following example the equation of a parabola is rendered
   * whose fixed point (the focus) is at $(0, p)$, the slider below the graph controls
   * the value of $p$
   *
   * NOTE: math.js is not bundled with function-plot
   *
   * @additionalDOM
   *
   *    <div class="extra">
   *      <input id="p-slider" type="range" min="-3" max="3" value="0.2" step="0.2" />
   *      <span id="p-slider-value"></span>
   *    </div>
   *
   */
  var scope = { p: 3 };
  var fn = math.eval('f(x) = 1/(4p) * x^2', scope);
  var config = {
    target: '#parsedWithMathJS',
    data: [{ fn: fn }]
  };
  $('#p-slider').on('change', function () {
    scope.p = +this.value;
    functionPlot(config);
  });
  // initial plot
  functionPlot(config);

  /**
   * ### Limits
   *
   * Some functions approach to infinity or are undefined under a range of values,
   * for example $y = 1/x$ when coming from the left of $x=0$ approaches $-\infty$ and
   * when coming from the right of $x=0$ approaches $+\infty$, to deal with continuity
   * problems we can specify the places the function is undefined/$\infty$ under
   * the option `limits`
   *
   * @experimental
   */
  functionPlot({
    target: '#withLimits',
    data: [{
      title: 'f(x) = 1/x',
      fn: function (x) {
        return 1 / x;
      },
      deltaX: 0.01,
      graphOptions: {
        limits: [0],
        interpolate: 'linear'
      }
    }]
  });

  /** */
});


$('#examples').load('partials/examples.html', function () {
  $(document).trigger('markupLoaded');
  $('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
  });

  $('#p-slider').on('change', function () {
    var value = +this.value;
    $('#p-slider-value').html(value);
  });
});


$('#brcdn').load('partials/brcdn-module.html .panel.panel-primary', function () {
  clipboard();
});

function clipboard() {
  ZeroClipboard.config( { swfPath: "//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.2.0/ZeroClipboard.swf" } );
  var elements = [].slice.call(document.querySelectorAll('[data-clipboard-text]'));
  var client = new ZeroClipboard(elements);
  client.on('ready', function (event) {
    elements.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
      }, false);
    });
    client.on('aftercopy', function (e) {
      e.target.setAttribute('class', 'btn btn-sm btn-success');
      setTimeout(function () {
        e.target.setAttribute('class', 'btn btn-sm btn-primary');
      }, 200);
    });
  });
}
