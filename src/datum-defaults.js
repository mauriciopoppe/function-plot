var isObject = require('is-object')

module.exports = function (d) {
  if (!isObject(d)) {
    throw Error('datum is not an object')
  }

  // default graphType uses boxes i.e. 2d intervals
  if (!(d.hasOwnProperty('graphType'))) {
    d.graphType = 'interval'
  }

  // if the graphType is not `interval` then the sampler is `builtIn`
  // because the interval sampler returns a box instead of a point
  if (!(d.hasOwnProperty('sampler'))) {
    d.sampler = d.graphType !== 'interval'
      ? 'builtIn'
      : 'interval'
  }

  // TODO: handle default fnType
  // default `fnType` is linear
  if (!(d.hasOwnProperty('fnType'))) {
    d.fnType = 'linear'
  }

  return d
}
