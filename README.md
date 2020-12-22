[![image](https://user-images.githubusercontent.com/1616682/93912098-23060300-fcb8-11ea-823f-be8dfe9c24b9.png)](http://mauriciopoppe.github.io/function-plot/)

<p align="center">
  <a href="https://npmjs.org/package/function-plot">
    <img src="https://img.shields.io/npm/v/function-plot.svg?style=flat" alt="NPM">
  </a>
  <a href="https://travis-ci.com/github/mauriciopoppe/function-plot">
    <img src="https://travis-ci.com/mauriciopoppe/function-plot.svg?branch=master" alt="Build Status">
  </a>
<a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fmauriciopoppe%2Ffunction-plot?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmauriciopoppe%2Ffunction-plot.svg?type=shield"/></a>
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-blue" alt="js-standard-style">
  </a>
  <a href="https://www.chromatic.com/component?appId=5f6ab5a952e6b600226e8eaa&amp;name=Examples">
    <img src="https://camo.githubusercontent.com/4c64e07178937065fd61d9ba90de13291394dd56/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f73746f7279626f6f6b6a732f6272616e64406d61737465722f62616467652f62616467652d73746f7279626f6f6b2e737667" alt="storybook">
  </a>
</p>

---

Function Plot is a powerful library built on top of <a href="http://d3js.org/">D3.js</a> whose purpose
is to render functions with little configuration, think of it as a little clone of Google's plotting
utility: [y = x * x](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=y+%3D+x+%5E+2)

The library currently supports interactive line charts and scatterplots, whenever the graph scale is modified the function
is evaluated again with the new bounds, result: infinite graphs!

[![Edit function-plot](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/muddy-cdn-ibl5x?fontsize=14&hidenavigation=1&theme=light)

[![image](https://user-images.githubusercontent.com/1616682/93041565-a9a84980-f601-11ea-900e-4e6809b5fa96.png)](https://observablehq.com/@mauriciopoppe/function-plot),

Thanks to [@liuyao12](https://github.com/liuyao12) for the initial version of the Observable notebook, you can check his own version here https://beta.observablehq.com/@liuyao12/function-plot

## Installation

```sh
npm install function-plot
```

## Examples

[`Examples in the homepage`](http://mauriciopoppe.github.io/function-plot/)

## API

```javascript
import functionPlot from 'function-plot'
functionPlot(options)
```

[`All the available options are described in the docs`](https://mauriciopoppe.github.io/function-plot/docs/interfaces/_src_types_.functionplotoptions.html)

## License

2015-2020 MIT © Mauricio Poppe


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmauriciopoppe%2Ffunction-plot.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmauriciopoppe%2Ffunction-plot?ref=badge_large)
