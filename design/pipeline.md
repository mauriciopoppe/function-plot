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
  - compile `fn` to a \*-eval function (see [interval-arithmetic-eval](https://github.com/mauriciopoppe/interval-arithmetic-eval)
    or [built-in-math-eval](https://github.com/mauriciopoppe/built-in-math-eval)), the evaluated function is added to the configuration object
    which becomes.

```
{
  "target": "#playground",
  "data": [
    {
      "fn": "x^2",
      "interval_Expression_fn": "x^2",
      "interval_Compiled_fn": {
        "code": "return $$mathCodegen.functionProxy($$mathCodegen.getProperty(\"pow\", scope, ns), \"pow\")($$mathCodegen.getProperty(\"x\", scope, ns), ns.factory(2))",
        "eval": function(scope) {
          scope = scope || {};
          $$processScope(scope);
          return $$mathCodegen.functionProxy(
            $$mathCodegen.getProperty("pow", scope, ns), "pow")($$mathCodegen.getProperty("x", scope, ns), ns.factory(2)
          )
        }
      },
    }
  ]
}
```

- The [above interval\_ prefixed values are cached](https://github.com/mauriciopoppe/function-plot/blob/7e885aed9a7c6adf6f40823eb457d687efc08a8a/src/helpers/eval.mjs#L73) so that when `functionPlot` is invoked the compilation isn't run many times.
- [use `nSamples`](https://github.com/mauriciopoppe/function-plot/blob/b46e07c3281bce5b6bff00050ba3d6a16795a483/src/evaluate.ts#L40)
  to create [`nSamples` equally distinct points](https://github.com/mauriciopoppe/function-plot/blob/b46e07c3281bce5b6bff00050ba3d6a16795a483/src/samplers/interval.ts#L17),
  e.g. `[x_0, x_1, ..., x_{n_samples - 1}]`
- In `O(n)`, iterate over all the points and [evaluate](https://github.com/mauriciopoppe/function-plot/blob/317bea18fb0298d11ecbaa3da53b824a3091ed1a/src/helpers/eval.mjs#L108) each them against the compiled function evaluator (created in the preparation stage),
  return a data structure that encodes the result (`Array<Array<[Interval, Interval]> | null>`)
- Render
  - In `O(n)` iterate over all the results and create a [`<path d={rectanglePaint} />`](https://github.com/mauriciopoppe/function-plot/blob/b46e07c3281bce5b6bff00050ba3d6a16795a483/src/graph-types/interval.ts#L96)
    where `rectanglePaint` is a [series of commands](https://github.com/mauriciopoppe/function-plot/blob/b46e07c3281bce5b6bff00050ba3d6a16795a483/src/graph-types/interval.ts#L68)
    of the form `M <x> <y> v <width>` which move to `(x, y)` and paint a rectangle of width `width`.

## Perf stats

Using `npm run perf:pipeline` for `fn: 1/x`:

```
┌─────────┬───────────────────────────────┬─────────┬────────────────────┬──────────┬─────────┐
│ (index) │           Task Name           │ ops/sec │ Average Time (ns)  │  Margin  │ Samples │
├─────────┼───────────────────────────────┼─────────┼────────────────────┼──────────┼─────────┤
│    0    │    'compile and eval 1000'    │ '1,002' │ 997696.8855496896  │ '±4.88%' │   502   │
│    1    │ 'async compile and eval 1000' │ '2,300' │ 434699.05905056576 │ '±3.51%' │  1151   │
└─────────┴───────────────────────────────┴─────────┴────────────────────┴──────────┴─────────┘
┌─────────┬─────────────────┬─────────┬────────────────────┬──────────┬─────────┐
│ (index) │    Task Name    │ ops/sec │ Average Time (ns)  │  Margin  │ Samples │
├─────────┼─────────────────┼─────────┼────────────────────┼──────────┼─────────┤
│    0    │ 'drawPath 1000' │ '8,375' │ 119393.74110532468 │ '±1.32%' │  4188   │
└─────────┴─────────────────┴─────────┴────────────────────┴──────────┴─────────┘
```
