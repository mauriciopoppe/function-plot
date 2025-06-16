[![image](https://user-images.githubusercontent.com/1616682/93912098-23060300-fcb8-11ea-823f-be8dfe9c24b9.png)](http://mauriciopoppe.github.io/function-plot/)

<p align="center">
  <a href="https://mauriciopoppe.github.io/function-plot/">
    <img src="https://img.shields.io/badge/homepage-red" alt="js-standard-style">
  </a>
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

[Check all the examples in the homepage](https://mauriciopoppe.github.io/function-plot/)

## Resources

- [API](https://mauriciopoppe.github.io/function-plot/docs/functions/default-1.html)
- [Want to know how it works? Read the design docs](./design/)
  - [Render pipeline](./design/pipeline.md)
  - [Web workers](./design/web-workers.md)

## License

2015-2023 MIT © Mauricio Poppe

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmauriciopoppe%2Ffunction-plot.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmauriciopoppe%2Ffunction-plot?ref=badge_large)
