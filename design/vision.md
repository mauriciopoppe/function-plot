# Function Plot API Vision

Status: working vision.

This document captures the durable philosophy behind the next function-plot
API. The concrete proposal, contracts, examples, and implementation seams are
in [api-refactor.md](./api-refactor.md).

## Purpose

Function-plot should make mathematical visualization composable without
turning itself into a general-purpose graphics engine. The library's value is
the depth of its mathematical pipeline—expression compilation, sampling,
interval arithmetic, discontinuity handling, viewport-aware recomputation, and
interaction—behind a small, renderer-independent composition interface.

## Durable principles

### Composition over configuration

A plot is a composition of marks, not a large configuration object whose
fields implicitly select every behavior. `marks` is always explicit, including
when it is empty. A mark represents plotted content; coordinate systems own
coordinate semantics and decorations such as axes, ticks, and grids.

### Declarative rendering is replacement

The declarative API describes one render. `Plot.plot(spec)` produces a new,
detached, interactive render result; the caller or UI framework inserts,
replaces, and removes that result. There is no public declarative `update()`
operation and no mutation of caller-owned specifications.

### Scene intent is separate from view state

`Scene` owns declarative composition and requested initial coordinate options.
The internal `View` owns mutable runtime state such as pan, zoom, current
domains, scales, dimensions, pointer state, and derived metadata. Interaction
may recompute geometry internally without changing the scene specification.

New declarative renders start from their requested initial state. Advanced
callers may explicitly transfer a versioned, coordinate-system-tagged,
serializable view-state snapshot; incompatible snapshots fail loudly.

### Keep the extension seam small

`Mark` is the main public extension point. A mark initially needs only a
renderer-neutral geometry-preparation operation. It should not own scene
hierarchy, renderer selections, event subscriptions, or speculative lifecycle
methods. New capabilities enter the contract only when a real custom-mark use
case demonstrates the need.

### Put ownership where behavior lives

The scene owns composition. The view owns interaction subscriptions, runtime
coordinate state, invalidation, and cancellation. The renderer owns conversion
of prepared geometry into SVG, Canvas, or another output. Coordinate systems
own projection and coordinate-aware decorations. This keeps each seam deep and
prevents marks from becoming shallow adapters to every subsystem.

### Preserve the mathematical core across renderers

Sampling and evaluation should not know whether the output is SVG or Canvas.
Marks prepare geometry; renderers consume it. SVG is the first implementation,
but the internal geometry seam should not make a later renderer rewrite the
mathematical pipeline.

### Prefer explicit advanced operations

The common path should remain small and Observable-style. Advanced operations
such as scene mutation before rendering and view-state transfer are explicit.
The API should not add general scene-graph, interaction, or cleanup machinery
until a concrete feature needs it.

## Mental model

```text
Scene specification -> Scene -> prepared geometry -> detached render result
                                      ^
                                      |
                         internal View state and recomputation
```

Public concepts are `Plot`, `Scene`, `Mark`, and the detached render result.
The initial implementations of `View`, `CoordinateSystem`, `Renderer`, and
ownership bookkeeping remain internal.

## Influences and boundaries

Observable Plot supplies the compositional mark model and replace-by-render
integration pattern ([What is Plot?](https://observablehq.github.io/plot/what-is-plot),
[marks](https://observablehq.github.io/plot/features/marks)). MetricsGraphics
reinforces concise centralized defaults ([API](https://metricsgraphicsjs.org/mg-api)).
Three.js is useful only as inspiration for internal ownership and lifecycle
bookkeeping ([Object3D](https://threejs.org/docs/pages/Object3D.html));
function-plot is not becoming a generic object hierarchy or 3D scene engine.

The vision explicitly does not include Observable Plot's complete tabular
channel/transform grammar, public user-defined coordinate systems, a general
scene graph, or a renderer-specific mark contract.

## Initial implementation bias

Start with the smallest vertical slice that proves the seams: Cartesian SVG,
explicit marks, detached interactive output, internal view-owned pan/zoom,
renderer-neutral paths/points/text, and the existing mathematical samplers.
Defer Canvas, polar coordinates, public interaction state, custom coordinate
systems, broad hit-testing contracts, and mark disposal until their concrete
use cases are implemented.
