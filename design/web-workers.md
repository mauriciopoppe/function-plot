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

```javascript
// myWorker.js
import interval from 'src/helpers/eval'

self.onmessage = (d, xCoords) => {
  for (let i = 0; i < xCoords.length - 1; i += 1) {
    const x = { lo: xCoords[i], hi: xCoords[i + 1] }
    const y = interval(d, 'fn', { x })
    samples.push([x, y])
  }

  self.postMessage({ samples })
}
```

Let's say we divide the space into 4 groups, we can do:

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

// let's create a web worker pool of 8 workers
const pool = new IntervalWorkerPool(8)

await Promise.all([
  // pool.queue queues a task
  // after it's queued, the worker pool will check if there's a
  // worker available to process the task.
  pool.queue({ d, xCoords[0] }),
  pool.queue({ d, xCoords[1] }),
  pool.queue({ d, xCoords[2] }),
  pool.queue({ d, xCoords[3] }),
])
```

The time complexity became `4*O(nSamples / 4) + 4*O(data in) + 4*O(data out)`,
given that we're doing all of these in parallel the constant term `4` becomes `1`,
therefore the time complexity is `O(nSamples / 4) + O(data in) + O(data out)`

### Improvement 1: Avoid data serialization between main and web workers

Every time the worker pool makes the call `worker.postMessage` it's serializing
`xCoords` and sending it to the worker, the worker processes the message
evaluating the function at different points and then calling `self.postMessage`
which is serializing the data again back to the main thread, we're paying
an I/O penalty equal to `O(data in) + O(data out)`

The following ideas eliminate the I/O serialization

- `xCoords` doesn't need to be computed in the main thread,
  the web worker has enough information to create its own xCoords.
- The evaluation data sent from the web worker doesn't need to originate
  in the web worker, instead, the main thread can create a typed array
  and share it with the worker through an ownership transfer operation.

Using the ideas above:

```javascript
// myWorker.js
import interval from 'src/helpers/eval'
import { linspace } from 'src/utils'

self.onmessage = (d, lo, hi, n, in /* The typed array */) => {
  // every 4 consecutive elements represent a rectangle to draw x_lo, x_hi, y_lo, y_hi
  const out = new Float32Array(in)
  const xCoords = linspace(lo, hi, n)

  // outIdx is the index in out
  let outIdx = 0
  for (let i = 0; i < xCoords.length - 1; i += 1, outIdx += 4) {
    const x = { lo: xCoords[i], hi: xCoords[i + 1] }
    const y = interval(d, 'fn', { x })
    out[outIdx + 0] = xCoords[i]
    out[outIdx + 1] = xCoords[i + 1]
    // might return [-Infinity, Infinity] if the interval is a whole interval
    out[outIdx + 2] = y.lo
    out[outIdx + 3] = y.hi
  }

  self.postMessage({ out }, [out.buffer])
}
```

```javascript
// main thread

// create 4 Float32Arrays that correspond to 4 groups to share with workers.
const group = []
for (let i = 0; i < 4; i += 1) {
  group.push(new Float32Array(4 * nSamples/nGroups))
}

// let's create a web worker pool of 8 workers
const pool = new IntervalWorkerPool(8)

const typedArraysFromWebWorker = await Promise.all([
  // pool.queue queues a task
  // after it's queued, the worker pool will check if there's a
  // worker available to process the task.
  pool.queue({ d, lo: lo+step*0, hi: lo+step*1, group[0] }),
  pool.queue({ d, lo: lo+step*1, hi: lo+step*2, group[1] }),
  pool.queue({ d, lo: lo+step*2, hi: lo+step*3, group[2] }),
  pool.queue({ d, lo: lo+step*3, hi: lo+step*4, group[3] }),
])

for (let i = 0; i < typedArraysFromWebWorker.length; i += 1) {
  groups[i] = new Float32Array(typedArraysFromWebWorker[i])
}
```

### Improvement 2: Don't do work that's not needed because it's not needed anymore

After implementing improvement 1 in the UI I saw that if I panned or
zoomed in/out too fast the graph would fail to keep up, after some
debugging I found out that it's because the worker pool cannot keep up with
the amount of tasks queued whenever there's a zoom/pan operation.

An interesting observation about tasks is that they belong to a section
of the space to render, let's use the following notation to show that
we queued a task for a subsection of the entire linear space to render.

```
// 1 eval run queues tasks for section s0, s1, s2, s3, all disjoint.
q = [s0, s1, s2, s3]
```

If we zoom/pan we are queueing the same sections with different args
(different `lo`, `hi`, etc).

```
                                          V
q = [s0, s1, s2, s3, s0, s1, s2, s3, ..., s0, s1, s2, s3]
```

In this queue, items to the left of `V` are obsolete and no longer need
to be rendered, therefore we can remove them from the queue.

## Results

### Performance numbers

```
┌─────────┬───────────────────────────────┬─────────┬───────────────────┬──────────┬─────────┐
│ (index) │           Task Name           │ ops/sec │ Average Time (ns) │  Margin  │ Samples │
├─────────┼───────────────────────────────┼─────────┼───────────────────┼──────────┼─────────┤
│    0    │    'compile and eval 1800'    │  '580'  │ 1722027.912172665 │ '±4.33%' │   291   │
│    1    │ 'async compile and eval 1800' │ '1,803' │ 554487.5565495037 │ '±4.89%' │   902   │
└─────────┴───────────────────────────────┴─────────┴───────────────────┴──────────┴─────────┘
```

The eval pipeline is now parallelized into groups and sent to the web worker pool,
there's a 3.1x performance improvement using
web workers + transferrable typed arrays + split of the evaluation section

### Visual results

**Sync render**

```javascript
functionPlot({
  target: '#playground',
  width: window.innerWidth,
  height: window.innerHeight,
  data: [
    { fn: 'x^2', nSamples: window.innerWidth*5, sampler: 'interval' },
    { fn: 'sin(x)', nSamples: window.innerWidth*5, sampler: 'interval' },
    { fn: '1/x', nSamples: window.innerWidth*5, sampler: 'interval' },
  ]
})
```

![render sync](https://github.com/mauriciopoppe/function-plot/assets/1616682/db33228b-4180-4a7a-8c30-5904dccb2bc6)


**Async render**

```javascript
functionPlot.withWebWorkers(8)
functionPlot({
  target: '#playground',
  width: window.innerWidth,
  height: window.innerHeight,
  data: [
    { fn: 'x^2', nSamples: window.innerWidth*5, sampler: 'asyncInterval' },
    { fn: 'sin(x)', nSamples: window.innerWidth*5, sampler: 'asyncInterval' },
    { fn: '1/x', nSamples: window.innerWidth*5, sampler: 'asyncInterval' },
  ]
})
```

![render async](https://github.com/mauriciopoppe/function-plot/assets/1616682/56432b1b-5dd4-4296-b251-68bf05cf5caf)

