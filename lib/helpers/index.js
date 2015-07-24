/**
 * Created by mauricio on 4/8/15.
 */
'use strict'
var d3 = window.d3
var derivative = require('./derivative')
var secant = require('./secant')
var extend = require('extend')

module.exports = function (options) {
  // mark this type of datum as private
  var extended = extend(true, { isHelper: true }, options)

  function helper (selection) {
    selection.each(function () {
      var el = d3.select(this)
      el.call(derivative(extended))
      el.call(secant(extended))
    })
  }

  return helper
}
