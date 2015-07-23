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
      fn: 'x^2',
      derivative: {
        fn: '2 * x',
        updateOnMouseMove: true
      }
    }]
  });

  functionPlot({
    target: '#description-sin-exp-x-naive',
    yDomain: [-4, 4],
    xDomain: [-2, 6],
    tip: {
      renderer: function () {}
    },
    data: [{
      fn: 'sin(exp(x))',
      samples: 5000,
      graphOptions: {
        type: 'line'
      }
    }]
  });

  functionPlot({
    target: '#description-sin-exp-x',
    yDomain: [-4, 4],
    xDomain: [-2, 6],
    tip: {
      renderer: function () {}
    },
    data: [{
      fn: 'sin(exp(x))'
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
   *  - `data.fn` (string) a mathematical expression to render, it's parsed and evaluated
   *  using [interval-arithmetic](https://www.npmjs.com/package/interval-arithmetic-eval)
   *
   * The syntax of the string that represent the mathematical expression is just like ECMAScript
   * however the `^` operator has been replaced with `pow` and there's no namespace for the
   * functions to be evaluated
   */
  functionPlot({
    target: '#quadratic',
    data: [{
      fn: 'x^2'
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
      fn: 'x^2'
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
      fn: 'sin(x)'
    }]
  });

  /**
   * ### Samples
   *
   * `samples` determine the number of equally spaced points in which the function will be
   * evaluated in the current domain, increasing it will more accurately represent the function
   * using rectangles at the cost of processing speed
   *
   * e.g.  samples = 100
   *
   * $$
   * domain = [-5, 5] \\\
   * values = -5, -4.9, -4.8, \ldots, 4.8, 4.9, 5.0
   * $$
   *
   * $$
   * domain = [-10, 10] \\\
   * values = -10, -9.8, -9.6, \ldots, 9.6, 9.8, 10
   * $$
   *
   */
  functionPlot({
    target: '#samples',
    data: [{
      fn: 'sin(x)',
      samples: 1000
    }]
  });

  /**
   * ### Annotations
   *
   * Parallel lines to the y-axis or x-axis can be set in the `annotations` option:
   *
   * - `x`: x coordinate of a line parallel to the y-axis
   * - `y`: y coordinate of a line parallel to the x-axis
   * - `text` (optional) text shown next to the parallel line
   *
   * NOTE: either `x` or `y` need to be set on the object, setting both of them
   * will raise an exception
   */
  functionPlot({
    target: '#annotations',
    yDomain: [-1, 9],
    data: [{
      fn: 'x^2'
    }],
    annotations: [{
      x: -1
    }, {
      x: 1,
      text: 'x = 1'
    }, {
      y: 2,
      text: 'y = 2'
    }]
  });

  /**
   * ### Range and closed path
   *
   * You can restrict the values to be evaluated with the `range` option,
   * this works really nice with the `closed` option of the `line` type to render
   * for example a [definite integral](http://mathworld.wolfram.com/DefiniteIntegral.html)
   *
   * Additional graph options for the renderer of each graph can be set inside `graphOptions`
   *
   * - `type`: the type of graph, `line` (naive sampling), `scatter` (naive sampling) and
   * `interval` (interval arithmetic sampling) are supported
   * - `closed`: true to render a closed path, `y0` will always be 0 and `y1` will be $fn(x)$
   */
  functionPlot({
    target: '#closed',
    xDomain: [0, 10],
    data: [{
      fn: '3 + sin(x)',
      range: [2, 8],
      graphOptions: {
        closed: true
      }
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
      { fn: 'x' },
      { fn: '-x' },
      { fn: 'x * x' },
      { fn: 'x * x * x' },
      { fn: 'x * x * x * x' }
    ]
  });

  /**
   * ### Scatter
   *
   * A function can be represented with some points belonging to the curve
   * instead of the actual curve, to render some points make sure to set a low value for
   * `samples` and set the type option to `scatter`
   *
   */
  functionPlot({
    target: '#scatter',
    data: [{
      fn: 'x < 0 ? -sqrt(-x) : sqrt(x)',
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
      { fn: 'x^2' }
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
      fn: 'x^2',
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
      fn: 'x^2',
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
      fn: 'x^2',
      derivative: {
        fn: '2 * x',
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
      fn: 'x^2',
      derivative: {
        fn: '2 * x',
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
      fn: 'x * x',
      derivative: {
        fn: '2 * x',
        updateOnMouseMove: true
      }
    }, {
      fn: 'x * x * x',
      derivative: {
        fn: '3 * x * x',
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
    data: [{ fn: 'x * x' }]
  });
  b = functionPlot({
    target: '#linked-b',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: '2 * x' }]
  });
  a.addLink(b);

  /**
   * ### Linked graphs <div class="small">Multiple</div>
   *
   * Since the `zoom` event is dispatched to all the linked graphs, one can
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
    data: [{ fn: 'x * x' }]
  });
  b = functionPlot({
    target: '#linked-b-multiple',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: '2 * x' }]
  });
  c = functionPlot({
    target: '#linked-c-multiple',
    height: 250,
    xDomain: [-10, 10],
    data: [{ fn: '2' }]
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
      fn: 'x'
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
        fn: 'x * x',
        derivative: {
          fn: '2 * x',
          updateOnMouseMove: true
        }
      }
    } else {
      // remove the title and the tip
      // update the function to be y = x
      delete options.title;
      delete options.tip;
      options.data[0] =  {
        fn: 'x'
      }
    }
    functionPlot(options);
  });
  // initial plot
  functionPlot(options);

  /**
   * ### Function continuity
   *
   * Some functions are not defined under some range of values, for example
   * the function $f(x) = \frac{1}{x}$ is undefined when $x = 0$, the library identifies
   * these kind of peaks and there's no need to explicitly tell these asymptotes
   */
  functionPlot({
    target: '#function-continuity',
    data: [{
      fn: '1 / x',
      derivative: {
        fn: '-1 / x / x',
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
      fn: 'tan(x)',
      derivative: {
        fn: '1 / (cos(x) ^ 2)',
        updateOnMouseMove: true
      }
    }]
  });

  /**
   * ## The tale of a circle
   *
   * Consider plotting the function
   *
   * $$
   * x^2 + y^2 = 1
   * $$
   *
   * which is the equation of a circle of radius 1, unfortunately $y$ is not expressed in terms of $x$ and
   * `function-plot` needs an equation in the form $y = f(x)$, solving for $y$ we get:
   *
   * $$
   * y = \pm\sqrt{1 - x^2}
   * $$
   *
   * Which raises two functions
   *
   * $$
   * y = \sqrt{1 - x^2} \quad and \quad y = -\sqrt{1 - x^2}
   * $$
   *
   */
  functionPlot({
    target: '#circle-explicit',
    yDomain: [-1.897959183, 1.897959183],
    xDomain: [-3, 3],
    data: [
      { fn: 'sqrt(1 - x * x)' },
      { fn: '-sqrt(1 - x * x)' }
    ]
  });

  /**
   * ### Parametric equations
   *
   * The original equation of the circle $x^2 + y^2 = 1$ can be parametrized as
   *
   * $$
   * x = cos(t) \\\\
   * y = sin(t)
   * $$
   *
   * For $0 \leq t \leq 2 \pi$
   *
   * The options that tell `function-plot` to render a parametric equation are defined
   * inside each term of the `data` array and need to have the following properties set:
   *
   * - `parametric = true` to mark this term as a parametric equation
   * - `x` the x-coordinate of a point to be sampled with a parameter `t`
   * - `y` the y-coordinate of a point to be sampled with a parameter `t`
   * - `range = [0, 2 * Math.PI]` the `range` property in parametric equations is used
   * to determine the possible values of `t`, remember that the number of samples is
   * set in the property `samples`
   *
   * NOTE: `function-plot` uses interval-arithmetic by default, to create a nice line
   * instead of rectangles generated by the interval-arithmetic sampler set
   * `graphOptions.type` to `line` which uses the normal single point evaluation
   */
  functionPlot({
    target: '#parametric-circle',
    yDomain: [-1.897959183, 1.897959183],
    xDomain: [-3, 3],
    data: [{
      x: 'cos(t)',
      y: 'sin(t)',
      parametric: true,
      graphOptions: {
        type: 'line'
      }
    }]
  });

  /**
   * ### Parametric Equations  <br /> <div class="small">Butterfly curve</div>
   *
   * Let's render the famous equation of the butterfly curve using parametric equations,
   * the equations are:
   *
   * $$
   * x = sin(t)(e^{cos(t)} - 2cos(4t) - sin(\tfrac{t}{12})^5) \\\\
   * y = cos(t)(e^{cos(t)} - 2cos(4t) - sin(\tfrac{t}{12})^5)
   * $$
   *
   */
  functionPlot({
    target: '#butterfly-curve',
    yDomain: [-4.428571429, 4.428571429],
    xDomain: [-7, 7],
    data: [{
      x: 'sin(t) * (exp(cos(t)) - 2 cos(4t) - sin(t/12)^5)',
      y: 'cos(t) * (exp(cos(t)) - 2 cos(4t) - sin(t/12)^5)',
      range: [-10 * Math.PI, 10 * Math.PI],
      parametric: true,
      graphOptions: {
        type: 'line'
      }
    }]
  });

  /**
   * ### Polar equations
   *
   * The original equation of the circle $x^2 + y^2 = 1$ can be expressed with the
   * following polar equation
   *
   * $$
   * r = r_0 \; cos(\theta - \gamma) + sqrt(a^2 -r_0^2 sin^2(\theta - \gamma))
   * $$
   *
   * Where $\theta$ is the polar angle, $a$ is the radius of the circle with center $(r_0, \gamma)$
   *
   * The options that tell `function-plot` to render a polar equation are defined
   * inside each term of the `data` array and need to have the following properties set:
   *
   * - `polar = true` to mark this term as a polar equation
   * - `r` a polar equation in terms of `theta`
   * - `range = [-Math.PI, Math.PI]` the `range` property in polar equations is used
   * to determine the possible values of `theta`, remember that the number of samples is
   * set in the property `samples`
   *
   * NOTE: `function-plot` uses interval-arithmetic by default, to create a nice line
   * instead of rectangles generated by the interval-arithmetic sampler set
   * `graphOptions.type` to `line` which uses the normal single point evaluation
   */
  functionPlot({
    target: '#polar-circle',
    yDomain: [-1.897959183, 1.897959183],
    xDomain: [-3, 3],
    data: [{
      r: 'r0 * cos(theta - gamma) + sqrt(a^2 - r0^2 * (sin(theta - gamma))^2)',
      scope: {
        a: 1,
        r0: 0,
        gamma: 0
      },
      polar: true,
      graphOptions: {
        type: 'line'
      }
    }]
  });

  /**
   * ### Polar equations <br /> <div class="small">Polar rose</div>
   *
   * Rendering the equation of the polar rose
   *
   * $$
   * r = 2 sin(4 \theta)
   * $$
   */
  functionPlot({
    target: '#polar-complex',
    yDomain: [-1.897959183, 1.897959183],
    xDomain: [-3, 3],
    data: [{
      r: '2 * sin(4 theta)',
      polar: true,
      graphOptions: {
        type: 'line'
      }
    }]
  });

  /**
   * ### Implicit functions
   *
   * The equation of a circle of radius 1 $x^2 + y^2 = 1$ expressed in an explicit way is:
   *
   * $$
   * y = \sqrt{1 - x^2} \quad and \quad y = -\sqrt{1 - x^2}
   * $$
   *
   * This library can also plot implicit equations with the only requirement of making the equation
   * equal to zero and adding the option `implicit` (the sampler expects that the function
   * depends on the variables $x$ and $y$)
   *
   * $$
   * 0 = x^2 + y^2 - 1
   * $$
   *
   * To render implicit equations you have to make sure of the following:
   *
   * - `fn(x, y)` means that the function `fn` needs to be expressed in terms of `x` and `y`
   * - `implicit = true` is set on the data item that is an implicit equation
   *
   */
  functionPlot({
    target: '#circle-implicit',
    yDomain: [-1.897959183, 1.897959183],
    xDomain: [-3, 3],
    data: [{
      fn: 'x * x + y * y - 1',
      implicit: true
    }]
  });

  /**
   * ### Implicit function <br /> <div class="small">complex implicit functions</div>
   *
   * Consider the following equation
   *
   * $$
   * cos(\pi x) = cos(\pi y)
   * $$
   *
   * It's impossible to find an explicit version of it because we would need an infinite number
   * of functions, however for a finite region of the plane a finite number of functions suffice
   */
  functionPlot({
    target: '#implicit-complex',
    yDomain: [-3.795918366, 3.795918366],
    xDomain: [-6, 6],
    disableZoom: true,
    data: [{
      fn: 'cos(PI * x) - cos(PI * y)',
      implicit: true
    }]
  });

  /**
   * ### Advanced: sampler
   *
   * `function-plot` uses `interval-arithmetic` math by default, unfortunately some functions are
   * not implemented yet because of the underlying complexity, for this reason you can always
   * evaluate a function with <img style="width: 50px; height: 15px" src="img/mathjs_330x100.png"/>,
   * to do so make sure that the datum has the following set:
   *
   * - `sampler: 'mathjs'` to evaluate functions using math.js
   * - `type: 'line'` or `type: 'scatter'`
   */
  functionPlot({
    target: '#sampler-mathjs',
    disableZoom: true,
    data: [{
      fn: 'gamma(x)',
      graphOptions: {
        sampler: 'mathjs',
        type: 'line'
      }
    }]
  });
  functionPlot({
    target: '#sampler-tan-mathjs',
    data: [{
      fn: 'tan(x)',
      samples: 4000,
      graphOptions: {
        sampler: 'mathjs',
        type: 'line'
      }
    }]
  });
  /** */
});

$('#wzrd').load('partials/wzrd.html');

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


//$('#brcdn').load('partials/brcdn-module.html .panel.panel-primary', function () {
//  clipboard();
//});
//
//function clipboard() {
//  ZeroClipboard.config( { swfPath: "//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.2.0/ZeroClipboard.swf" } );
//  var elements = [].slice.call(document.querySelectorAll('[data-clipboard-text]'));
//  var client = new ZeroClipboard(elements);
//  client.on('ready', function (event) {
//    elements.forEach(function (el) {
//      el.addEventListener('click', function (e) {
//        e.preventDefault();
//      }, false);
//    });
//    client.on('aftercopy', function (e) {
//      e.target.setAttribute('class', 'btn btn-sm btn-success');
//      setTimeout(function () {
//        e.target.setAttribute('class', 'btn btn-sm btn-primary');
//      }, 200);
//    });
//  });
//}
