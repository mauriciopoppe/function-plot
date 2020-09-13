import { hsl as d3Hsl } from 'd3-color'

// var d3 = window.d3
const Globals = {
  COLORS: [
    'steelblue',
    'red',
    '#05b378', // green
    'orange',
    '#4040e8', // purple
    'yellow',
    'brown',
    'magenta',
    'cyan'
  ].map(function (v) {
    return d3Hsl(v)
  }),
  DEFAULT_WIDTH: 550,
  DEFAULT_HEIGHT: 350,
  TIP_X_EPS: 1
}

Globals.DEFAULT_ITERATIONS = null
Globals.MAX_ITERATIONS = Globals.DEFAULT_WIDTH * 4

// module.exports.Globals = Globals
export default Globals
