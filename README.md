[![image](https://user-images.githubusercontent.com/1616682/93912098-23060300-fcb8-11ea-823f-be8dfe9c24b9.png)](http://mauriciopoppe.github.io/function-plot/)

<p align="center">
  <a href="https://npmjs.org/package/function-plot">
    <img src="https://img.shields.io/npm/v/function-plot.svg?style=flat" alt="NPM">
  </a>
<a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fmauriciopoppe%2Ffunction-plot?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmauriciopoppe%2Ffunction-plot.svg?type=shield"/></a>
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-blue" alt="js-standard-style">
  </a>
</p>

---

function-plot is a powerful library built on top of <a href="http://d3js.org/">D3.js</a> whose purpose
is to render functions with little configuration, think of it as a little clone of Google's plotting
utility: [y = x \* x](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=y+%3D+x+%5E+2)

The library currently supports interactive line charts and scatterplots, whenever the graph scale is modified the function
is evaluated again with the new bounds, result: infinite graphs!

[![Edit function-plot](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/muddy-cdn-ibl5x?fontsize=14&hidenavigation=1&theme=light)

[![image](https://user-images.githubusercontent.com/1616682/93041565-a9a84980-f601-11ea-900e-4e6809b5fa96.png)](https://observablehq.com/@mauriciopoppe/function-plot),

Thanks to [@liuyao12](https://github.com/liuyao12) for the initial version of the Observable notebook, you can check his own version here https://beta.observablehq.com/@liuyao12/function-plot

## Installation

```sh
npm install function-plot
```

## Usage

```javascript
import functionPlot from 'function-plot'
functionPlot({
  target: '#root',
  data: [
    {
      fn: 'x^2',
      derivative: {
        fn: '2*x',
        updateOnMouseMove: true
      }
    }
  ]
})
```

## Resources

- [All examples in the homepage](https://mauriciopoppe.github.io/function-plot/)
- [API docs](https://mauriciopoppe.github.io/function-plot/docs/functions/default-1.html)
- [Want to know how it works? Read the design docs](./design/)
  - [Render pipeline](./design/pipeline.md)
  - [Web workers](./design/web-workers.md)

## License

2015-2023 MIT © Mauricio Poppe

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmauriciopoppe%2Ffunction-plot.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmauriciopoppe%2Ffunction-plot?ref=badge_large)
