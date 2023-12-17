# Compile-Eval-Render Pipeline

> Summary of the render process that happens on every tick (pan/zoom) in the graph.

## Compile-Eval-Render pipeline for intervals

Let's assume we call functionPlot with the following configuration (note that `graphType: 'interval'` is the default):

```
functionPlot({
  target: '#playground',
  data: [
    { fn: 'x^2' }
  ]
})
```

There are multiple compute heavy steps that happen in the rendering pipeline:

- Compile + Eval
  - compile `fn` to a *-eval function (see [interval-arithmetic-eval](https://github.com/mauriciopoppe/interval-arithmetic-eval)
  or [built-in-math-eval](https://github.com/mauriciopoppe/built-in-math-eval))
  - The [above is cached]() so that when `functionPlot` is invoked it isn't
  the compilation isn't run many times.
  - [use `nSamples`](https://github.com/mauriciopoppe/function-plot/blob/b46e07c3281bce5b6bff00050ba3d6a16795a483/src/evaluate.ts#L40)
  to create [`nSamples` equally distinct points](https://github.com/mauriciopoppe/function-plot/blob/b46e07c3281bce5b6bff00050ba3d6a16795a483/src/samplers/interval.ts#L17),
  e.g. `[x_0, x_1, ..., x_{n_samples - 1}]`
  - In `O(n)`, iterate over all the points and evaluate each them against the compiled function evaluator (created in the preparation stage),
    return a data structure that encodes the result (`Array<Array<[Interval, Interval]> | null>`)
- Render
  - In `O(n)` iterate over all the results and create a [`<path d={rectanglePaint} />`](https://github.com/mauriciopoppe/function-plot/blob/b46e07c3281bce5b6bff00050ba3d6a16795a483/src/graph-types/interval.ts#L96)
  where `rectanglePaint` is a [series of commands](https://github.com/mauriciopoppe/function-plot/blob/b46e07c3281bce5b6bff00050ba3d6a16795a483/src/graph-types/interval.ts#L68)
    of the form `M <x> <y> v <width>` which move to `(x, y)` and paint a rectangle of width `width`.

## Perf stats

Using `npm run perf:pipeline`:

```
compile and eval 1000 x 1,163 ops/sec ±0.26% (98 runs sampled)
compile and eval 1000 x 1,172 ops/sec ±0.46% (97 runs sampled)
compile and eval 1000 x 1,164 ops/sec ±0.23% (96 runs sampled)

drawPath 1000 x 8,398 ops/sec ±0.58% (99 runs sampled)
drawPath 1000 x 8,392 ops/sec ±0.53% (97 runs sampled)
drawPath 1000 x 8,266 ops/sec ±0.55% (96 runs sampled)
```
