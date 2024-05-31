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

### Improvement 1: Do the compute heavy operations in parallel inside web workers

The first perf improvement is on `evaluate(d, 'fn', { x })` which
can be packed inside a worker with enough code to evaluate a given set of x-coordinates.

To parallelize the work, we can create `n` web workers and assign them a subset
of the overall x-coordinates to evaluate.

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

Back on main, let's say we have a space of n samples in `[x_0, x_1, ..., x_{nSamples-1}]`,
we can divide the space into `nGroup` groups (in the following example 4 groups), we can do:

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

### Improvement 2: Avoid data serialization between main and web workers

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

Because we're no longer doing IO and just passing reference to array buffers
created in main the time complexity became `O(nSamples / 4)`!

### Improvement 3: Don't do work that's no longer needed.

After implementing improvement 2 in the UI I saw that if I panned or
zoomed in/out too fast the graph would fail to keep up rendering, after some
debugging I found out that it's because the worker pool cannot keep up with
the amount of tasks queued whenever there's a zoom/pan operation.

An interesting observation about tasks is that they belong to a section
of the space to render, let's use the following notation to show that
we queued a task for a subsection of the entire linear space to render.

```
// In the following notation
// - the head of the queue (where items exit) is index 0
// - the tail of the queue (where items enter) is len(q)

// 1 eval run queues 4 tasks to evaluate 4 x-coordinate section e.g. s0, s1, s2, s3
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
┌─────────┬──────────────────────────────────────────────────┬─────────┬────────────────────┬──────────┬─────────┐
│ (index) │                    Task Name                     │ ops/sec │ Average Time (ns)  │  Margin  │ Samples │
├─────────┼──────────────────────────────────────────────────┼─────────┼────────────────────┼──────────┼─────────┤
│    0    │  'nSamples=350 nGroups=4 compile and eval sync'  │ '2,937' │ 340425.4411823333  │ '±3.19%' │  1469   │
│    1    │ 'nSamples=350 nGroups=4 compile and eval async'  │ '4,668' │ 214188.47730510856 │ '±2.22%' │  2336   │
│    2    │  'nSamples=350 nGroups=8 compile and eval sync'  │ '3,137' │ 318775.3316169335  │ '±1.66%' │  1569   │
│    3    │ 'nSamples=350 nGroups=8 compile and eval async'  │ '5,369' │ 186219.94458985285 │ '±1.34%' │  2685   │
│    4    │ 'nSamples=350 nGroups=12 compile and eval sync'  │ '3,350' │ 298459.92100551765 │ '±0.61%' │  1676   │
│    5    │ 'nSamples=350 nGroups=12 compile and eval async' │ '4,380' │ 228261.84164384138 │ '±1.02%' │  2191   │
└─────────┴──────────────────────────────────────────────────┴─────────┴────────────────────┴──────────┴─────────┘
┌─────────┬──────────────────────────────────────────────────┬─────────┬────────────────────┬──────────┬─────────┐
│ (index) │                    Task Name                     │ ops/sec │ Average Time (ns)  │  Margin  │ Samples │
├─────────┼──────────────────────────────────────────────────┼─────────┼────────────────────┼──────────┼─────────┤
│    0    │  'nSamples=750 nGroups=4 compile and eval sync'  │ '1,571' │ 636432.5236424842  │ '±0.71%' │   786   │
│    1    │ 'nSamples=750 nGroups=4 compile and eval async'  │ '3,355' │ 298030.69186295883 │ '±1.17%' │  1678   │
│    2    │  'nSamples=750 nGroups=8 compile and eval sync'  │ '1,571' │  636292.834469987  │ '±0.71%' │   786   │
│    3    │ 'nSamples=750 nGroups=8 compile and eval async'  │ '4,287' │ 233236.9109143072  │ '±0.84%' │  2144   │
│    4    │ 'nSamples=750 nGroups=12 compile and eval sync'  │ '1,575' │ 634616.2916137482  │ '±0.67%' │   788   │
│    5    │ 'nSamples=750 nGroups=12 compile and eval async' │ '3,157' │ 316739.58808882016 │ '±1.62%' │  1579   │
└─────────┴──────────────────────────────────────────────────┴─────────┴────────────────────┴──────────┴─────────┘
┌─────────┬───────────────────────────────────────────────────┬─────────┬────────────────────┬──────────┬─────────┐
│ (index) │                     Task Name                     │ ops/sec │ Average Time (ns)  │  Margin  │ Samples │
├─────────┼───────────────────────────────────────────────────┼─────────┼────────────────────┼──────────┼─────────┤
│    0    │  'nSamples=1800 nGroups=4 compile and eval sync'  │  '652'  │ 1533380.1012155842 │ '±0.91%' │   327   │
│    1    │ 'nSamples=1800 nGroups=4 compile and eval async'  │ '1,652' │ 605112.0328499587  │ '±0.19%' │   827   │
│    2    │  'nSamples=1800 nGroups=8 compile and eval sync'  │  '654'  │ 1526956.4139406856 │ '±0.84%' │   328   │
│    3    │ 'nSamples=1800 nGroups=8 compile and eval async'  │ '1,457' │ 685947.2553425855  │ '±2.72%' │   729   │
│    4    │ 'nSamples=1800 nGroups=12 compile and eval sync'  │  '651'  │ 1535945.0213016907 │ '±0.91%' │   326   │
│    5    │ 'nSamples=1800 nGroups=12 compile and eval async' │ '1,455' │ 687077.8581270804  │ '±4.92%' │   728   │
└─────────┴───────────────────────────────────────────────────┴─────────┴────────────────────┴──────────┴─────────┘
┌─────────┬───────────────────────────────────────────────────┬─────────┬────────────────────┬──────────┬─────────┐
│ (index) │                     Task Name                     │ ops/sec │ Average Time (ns)  │  Margin  │ Samples │
├─────────┼───────────────────────────────────────────────────┼─────────┼────────────────────┼──────────┼─────────┤
│    0    │  'nSamples=3600 nGroups=4 compile and eval sync'  │  '322'  │ 3098335.157941889  │ '±0.93%' │   162   │
│    1    │ 'nSamples=3600 nGroups=4 compile and eval async'  │  '766'  │ 1305091.271797816  │ '±2.86%' │   384   │
│    2    │  'nSamples=3600 nGroups=8 compile and eval sync'  │  '323'  │ 3086716.6026138966 │ '±0.87%' │   162   │
│    3    │ 'nSamples=3600 nGroups=8 compile and eval async'  │ '1,259' │ 793736.3344525535  │ '±1.51%' │   630   │
│    4    │ 'nSamples=3600 nGroups=12 compile and eval sync'  │  '324'  │ 3079811.3697145614 │ '±0.83%' │   163   │
│    5    │ 'nSamples=3600 nGroups=12 compile and eval async' │ '1,014' │ 985531.5207498246  │ '±3.75%' │   509   │
└─────────┴───────────────────────────────────────────────────┴─────────┴────────────────────┴──────────┴─────────┘
```

The eval pipeline is now parallelized into groups and sent to the web worker pool,
there's a ~3 performance improvement using web workers + transferrable
typed arrays + split of the evaluation section

### Visual results

**Sync render**

```javascript
functionPlot({
  target: '#playground',
  width: window.innerWidth,
  height: window.innerHeight,
  data: [
    { fn: 'x^2', nSamples: window.innerWidth * 5, sampler: 'interval' },
    { fn: 'sin(x)', nSamples: window.innerWidth * 5, sampler: 'interval' },
    { fn: '1/x', nSamples: window.innerWidth * 5, sampler: 'interval' }
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
    { fn: 'x^2', nSamples: window.innerWidth * 5, sampler: 'asyncInterval' },
    { fn: 'sin(x)', nSamples: window.innerWidth * 5, sampler: 'asyncInterval' },
    { fn: '1/x', nSamples: window.innerWidth * 5, sampler: 'asyncInterval' }
  ]
})
```

![render async](https://github.com/mauriciopoppe/function-plot/assets/1616682/56432b1b-5dd4-4296-b251-68bf05cf5caf)
