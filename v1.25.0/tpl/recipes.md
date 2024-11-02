### Evaluate a function at some value `x`

```javascript
const y = functionPlot.$eval.builtIn(datum, fnProperty, scope)
```

Where `datum` is an object that has a function to be evaluated in the property `fnProperty` ,
to eval this function we need an `x` value which is sent through the scope

e.g.

```javascript
const datum = {
  fn: 'x^2'
}
const scope = {
  x: 2
}
const y = functionPlot.$eval.builtIn(datum, 'fn', scope)
```

Every element of the `data` property sent to `functionPlot` is saved on `instance.options.data`,
if you want to get the evaluated values of all the elements here run

```javascript
const instance = functionPlot( ... )
instance.options.data.forEach(function (datum) {
  const datum = {
    fn: 'x^2'
  }
  const scope = {
    // a value for x
    x: 2
  }
  const y = functionPlot.$eval.builtIn(datum, 'fn', scope)
}
```

### Maintain aspect ratio

Given the `xDomain` values you can compute the corresponding `yDomain` values to main
the aspect ratio between the axes

```javascript
function computeYScale (width, height, xScale) {
  const xDiff = xScale[1] - xScale[0]
  const yDiff = height * xDiff / width
  return [-yDiff / 2, yDiff / 2]
}

const width = 800
const height = 400

// desired xDomain values
const xScale = [-10, 10]

functionPlot({
  width: width,
  height: height,
  xDomain: xScale,
  yDomain: computeYScale(width, height, xScale),

  target: '#demo',
  data: [{
    fn: 'x^2',
    derivative: {
      fn: '2x',
      updateOnMouseMove: true
    }
  }]
})
```

### Changing the format of the values shown on the axes

```javascript
const instance = functionPlot({
  target: '#complex-plane',
  xLabel: 'real',
  yLabel: 'imaginary'
})
// old format
const format = instance.meta.yAxis.tickFormat()
const imaginaryFormat = function (d) {
  // new format = old format + ' i' for imaginary
  return format(d) + ' i'
}
// update format
instance.meta.yAxis.tickFormat(imaginaryFormat)
// redraw the graph
instance.draw()
```

### React Component

```typescript jsx
import React, { useEffect, useRef } from 'react'
import functionPlot, { FunctionPlotOptions } from 'function-plot'

export interface FunctionPlotProps {
  options?: FunctionPlotOptions
}

export const FunctionPlot: React.FC<FunctionPlotProps> = React.memo(({ options }) => {
  const rootEl = useRef(null)

  useEffect(() => {
    try {
      functionPlot(Object.assign({}, options, { target: rootEl.current }))
    } catch (e) {}
  })

  return (<div ref={rootEl} />)
}, () => false))
```

### Styling

Selectors (sass)

```sass
.function-plot {
  .x.axis {
    .tick {
      line {
        // grid's vertical lines
      }
      text {
        // x axis labels
      }
    }
    path.domain {
      // d attribute defines the graph bounds
    }
  }

  .y.axis {
    .tick {
      line {
        // grid's horizontal lines
      }
      text {
        // y axis labels
      }
    }
    path.domain {
      // d attribute defines the graph bounds
    }
  }
}
```
