# function-plot

[![NPM][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-blue)](https://github.com/feross/standard)

[![image](https://user-images.githubusercontent.com/1616682/93912098-23060300-fcb8-11ea-823f-be8dfe9c24b9.png)](http://mauriciopoppe.github.io/function-plot/)

Function Plot is a powerful library built on top of <a href="http://d3js.org/">D3.js</a> whose purpose
is to render functions with little configuration (think of it as a little clone of Google's plotting
utility: [y = x * x](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=y+%3D+x+%5E+2)

The library currently supports interactive line charts and scatterplots, whenever the graph scale is modified the function
is evaluated again with the new bounds, result: infinite graphs!

[![Edit function-plot (forked)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/function-plot-forked-15xiy?fontsize=14&hidenavigation=1&theme=light)

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

[`All the available options are described in the docs`](http://mauriciopoppe.github.io/function-plot/docs/)

## License

2015-2020 MIT © Mauricio Poppe

[npm-image]: https://img.shields.io/npm/v/function-plot.svg?style=flat
[npm-url]: https://npmjs.org/package/function-plot
[travis-image]: https://travis-ci.org/mauriciopoppe/function-plot.svg?branch=master
[travis-url]: https://travis-ci.org/github/mauriciopoppe/function-plot
