/**
 * Created by mauricio on 3/29/15.
 */
var d3 = window.d3;
module.exports = {
  COLORS: ['steelblue', 'red', 'orange', 'green', 'yellow'].map(function (v) {
    return d3.hsl(v);
  }),
  LIMIT: 1000
};
