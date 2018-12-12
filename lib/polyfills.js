// issue: https://github.com/maurizzzio/function-plot/issues/6
// solution: the line type is selecting the derivative line when the content is re-drawn, then when the
// derivative was redrawn an already selected line (by the line type) was used thus making a single line
// disappear from the graph, to avoid the selection of the derivative line the selector needs to
// work only for immediate children which is done with `:scope >`
// src: http://stackoverflow.com/questions/6481612/queryselector-search-immediate-children
/*eslint-disable */
;(function (doc, proto) {
  try { // check if browser supports :scope natively
    doc.querySelector(':scope body')
  } catch (err) { // polyfill native methods if it doesn't
    ['querySelector', 'querySelectorAll'].forEach(function (method) {
      var native = proto[method]
      proto[method] = function (selectors) {
        if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
          var id = this.id // remember current element id
          this.id = 'ID_' + Date.now() // assign new unique id
          selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
          var result = doc[method](selectors)
          this.id = id // restore previous id
          return result
        } else {
          return native.call(this, selectors) // use native code for other selectors
        }
      }
    })
  }
})(window.document, Element.prototype)
/* eslint-enable */
