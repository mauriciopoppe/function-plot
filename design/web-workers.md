# Faster evaluation with web workers

## Problem Statement

A problem with the [compile-eval-render pipeline](./pipeline.md) is
the amount of work done in the `compile-eval` phase, from the perf numbers
it's 8 times slower than the `render` phase.

The `eval` phase is an [embarrassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel)
program and in the web/node we can use web workers to solve it!

## Design

Initially let's cover intervals only, in particular when `fnType: 'linear'`,
out of scope: interval sampler for implicit or the builtIn sampler.

The entrypoint is [`interval1d`](https://github.com/mauriciopoppe/function-plot/blob/f296ff644713eb5a7b89e43ccd9d08458368a8ae/src/samplers/interval.ts#L116),
it does the following compute heavy operations:

```javascript
const samples: SamplerResultGroup = []
const xCoords = utils.space(xAxis, range, nSamples) // O(nSamples)
for (i = 0; i < xCoords.length - 1; i += 1) {
  const x = { lo: xCoords[i], hi: xCoords[i + 1] }
  const y = evaluate(d, 'fn', { x }) // O(nSamples * evaluate)
  samples.push([x, y])
}

// asymptote determination O(nSamples)
for (i = 1; i < samples.length - 1; i += 1) {
  // lots of O(1) operations...
}
```

The first perf improvement is on `evaluate(d, 'fn', { x })` which
can be packed inside a worker and evaluated with a section of the
entire space

```
// myWorker.js
import workerpool from 'workerpool'
import interval from 'src/helpers/eval'

function evaluate(d, fnString, scope) {
  return interval(d, fnString, scope)
}

workerpool.worker({ evaluate })
```

let's say we divide the space into 4 groups, we can do:

```javascript
// Proposal: splits an array of nSample numbers into an Array<Array<number>>
// where the top array has 4 elements and each element has a disjoint
// group of the samples e.g. (closed interval)
//
// - [0, nSamples/4]
// - [nSamples/4, 2*nSamples/4]
// - [2*nSamples/4, 3*nSamples/4]
// - [3*nSamples/4, nSamples]
//
// NOTE: The last entry in each group is present in two groups (last one in current group)
// and first one in next group
const xCoords = utils.intervalSpace(lo, hi, nSamples, 4) // O(nSamples)

// then we invoke a webworker and send the data expecting 4 results
// e.g. using https://www.npmjs.com/package/workerpool
const pool = workerpool.pool(__dirname + '/myWorker.js');

await Promise.all([
  pool.exec('evaluate', xCoords[0], 'fn'),
  pool.exec('evaluate', xCoords[1], 'fn'),
  pool.exec('evaluate', xCoords[2], 'fn'),
  pool.exec('evaluate', xCoords[3], 'fn'),
])
```

The time complexity became `4*O(nSamples / 4) + 4*O(data in) + 4*O(data out)`,
given that we're doing all of these in parallel the constant term `4` becomes `1`,
therefore the time complexity is `O(nSamples / 4) + O(data in) + O(data out)`
