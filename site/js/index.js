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
        updateOnMouseMove: true
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
      deltaX: 0.01,
      graphOptions: {
        interpolate: 'linear'
      }
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
    target: '#delta-x',
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
    target: '#samples',
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
   * instead of the
   */
  functionPlot({
    target: '#scatter',
    yDomain: [-1, 9],
    data: [{
      fn: function (x) {
        return Math.sqrt(x);
      },
      samples: 100,
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
   * ### Secants
   *
   * If a data object has a `secants` array, then each object will be used to compute
   * secant lines between two points belonging to the function, additionally if `updateOnMouseMove`
   * is a property set to `true` in the object then $(x_0, f(x_0))$ will be used as an anchored point
   * and $(x_1, f(x_1))$ will be computed dynamically based on the mouse abscissa
   *
   * Available options for each object:
   *
   * - `x0` the abscissa of the first point
   * - `x1` (optional if `updateOnMouseMove` is set) the abscissa of the second point
   * - `updateOnMouseMove` (optional) if set to `true` `x1` will be computed dynamically based on the current
   * position of the mouse
   */
  functionPlot({
    target: '#secant',
    yDomain: [-1, 9],
    xDomain: [-3, 3],
    data: [{
      fn: function (x) {
        return x * x;
      },
      secants: [
        { x0: 1, x1: 3 },
        { x0: 1, x1: 2.5 },
        { x0: 1, x1: 2 }
      ]
    }]
  });

  /**
   * ### Secants <br> <div class="small">Dynamic secant lines</div>
   *
   * An example where `updateOnMouseMove` is set in two secant lines, each line will be computed on the
   * dynamically based on the current position of the mouse
   */
  functionPlot({
    target: '#secant-update',
    yDomain: [-1, 9],
    data: [{
      fn: function (x) {
        return x * x;
      },
      secants: [{
        x0: 2,
        updateOnMouseMove: true
      }, {
        x0: -2,
        updateOnMouseMove: true
      }]
    }]
  });

  /**
   * ### Derivative
   *
   * If a data object has a `derivative` object then its property `fn` will be used to compute
   * the equation of the line tangent to the point `x0`, i.e. the point $(x_0, f(x_0))$
   * (the derivative is a function which gives the slope of the tangent line at any derivable point)
   *
   * Available options for the `derivative` object:
   *
   * - `fn` The function that is the first derivative of `data.fn`
   * - `x0` (optional if `updateOnMouseMove` is set) the abscissa of the point belonging to the curve
   * whose tangent will be computed
   * - `updateOnMouseMove` if set to `true` `x1` will be computed dynamically based on the current
   * position of the mouse
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
   * if `updateOnMouseMove` is set to true then tangent line is computed whenever the mouse is moved
   * inside the canvas (let $x_0$ be the mouse's abscissa then the tangent line to the point
   * $(x_0, f(x_0))$ is computed whenever the position of the mouse changes)
   */
  functionPlot({
    target: '#derivative-update',
    yDomain: [-1, 9],
    data: [{
      fn: function (x) {
        return x * x;
      },
      derivative: {
        fn: function (x) {
          return 2 * x;
        },
        updateOnMouseMove: true
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
    target: '#derivative-update-multiple',
    data: [{
      fn: function (x) {
        return x * x;
      },
      derivative: {
        fn: function (x) {
          return 2 * x;
        },
        updateOnMouseMove: true
      }
    }, {
      fn: function (x) {
        return x * x * x;
      },
      derivative: {
        fn: function (x) {
          return 3 * x * x;
        },
        updateOnMouseMove: true
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
    target: '#linked-a',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: function (x) { return x * x; } }]
  });
  b = functionPlot({
    target: '#linked-b',
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
    target: '#linked-a-multiple',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: function (x) { return x * x; } }]
  });
  b = functionPlot({
    target: '#linked-b-multiple',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: function (x) { return 2 * x; } }]
  });
  c = functionPlot({
    target: '#linked-c-multiple',
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
          updateOnMouseMove: true
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
    target: '#parsed-with-mathjs',
    data: [{ fn: fn }]
  };
  $('#p-slider').on('change', function () {
    scope.p = +this.value;
    functionPlot(config);
  });
  // initial plot
  functionPlot(config);

  /**
   * ### Function continuity
   *
   * Some functions are not defined under some range of values, for example
   * the function $f(x) = \frac{1}{x}$ is undefined when $x = 0$, the library identifies
   * these kind of peaks by comparing the sign of two contiguous evaluated values with a
   * small threshold, thus there's no need to explicitly tell these asymptotes
   *
   */
  functionPlot({
    target: '#function-continuity',
    data: [{
      fn: function (x) {
        return 1 / x;
      },
      derivative: {
        fn: function (x) {
          return -1 / x / x;
        },
        updateOnMouseMove: true
      }
    }]
  });

  /**
   * ### Function continuity <div class="small">$tan(x)$</div>
   *
   * Plotting $f(x) = tan(x)$ which has many vertical asymptotes
   */
  functionPlot({
    target: '#function-continuity-tan-x',
    data: [{
      fn: function (x) {
        return Math.tan(x);
      },
      samples: 2000,
      derivative: {
        fn: function (x) {
          return 1 / Math.cos(x) / Math.cos(x);
        },
        updateOnMouseMove: true
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
