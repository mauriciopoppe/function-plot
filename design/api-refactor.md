# API Refactor: Scenes, Marks, and Views

Status: proposal; core API direction settled, implementation details remain.

This document is the concrete API and implementation proposal for the
`main`/2.0 line. Repository-level philosophy and the durable decisions behind
these seams live in [vision.md](./vision.md).

## Core concepts

```text
Scene       owns declarative composition and render inputs
SceneNode   internal ownership/lifecycle protocol
Mark        public visual extension contract
Group       optional composite mark/container
Source      mathematical or static input consumed by a mark
Sampler     compiles/evaluates a source and returns sampled data
Coordinate  internal built-in scales, projection, axes, grid, ticks, inverse
            mapping, and coordinate-aware decorations
View        internal runtime owner for interaction, coordinates, and rendering
Renderer    turns prepared geometry into SVG, Canvas, or another output
```

The intended pipeline is:

```text
source -> sampler/transform -> prepared geometry -> mark -> renderer
```

The existing [compile/evaluate/render pipeline](./pipeline.md) remains useful,
but the render stage should no longer require a D3 selection.

## Declarative convenience API

The preferred user-facing syntax should be mark-oriented:

```js
import * as Plot from 'function-plot'

const plot = Plot.plot({
  title: 'Trigonometry',
  x: { domain: [-10, 10], grid: true },
  y: { domain: [-2, 2], grid: true },
  marks: [
    Plot.lineY('sin(x)', { stroke: 'steelblue' }),
    Plot.lineY('cos(x)', { stroke: 'tomato' }),
    Plot.ruleY(0, { strokeOpacity: 0.3 })
  ]
})

document.querySelector('#plot').replaceChildren(plot)
```

`marks` is always explicit, even when the scene contains one mark, and
`marks: []` is valid. Individual marks do not expose a `.plot()` shorthand;
composition enters through
`Plot.plot({ marks: [...] })` or `Plot.scene({ marks: [...] })`.

`Plot.plot(spec)` is convenience syntax for creating a scene and rendering a
new output. The caller owns inserting or replacing that output:

```js
const scene = Plot.scene({
  x: { domain: [-10, 10] },
  marks: [Plot.lineY('sin(x)')]
})

const plot = scene.render({ renderer: 'svg' })
document.querySelector('#plot').replaceChildren(plot)
```

`marks` is construction-time declarative input. Once normalized, the entries
become children of the scene graph. It should not be a second, ambiguous mutable
store alongside `scene.add()`.

The scene is a mutable composition builder before rendering; calling `add()` or
`remove()` changes what the next render produces. Rendering does not create a
live declarative update channel, and mutating a scene does not implicitly
change output that has already been inserted into the UI.

A mounted view has runtime state that can change without changing the scene
specification:

<!-- prettier-ignore -->
| Change | Owner | Result |
|---|---|---|
| add/remove marks or change plot composition | caller-owned `Scene` | caller renders a replacement output |
| zoom, pan, pointer position, viewport size | mounted `View` | internal rerender using the same scene |
| source or data changes | caller/framework | caller renders a replacement output |

The ownership rule is explicit:

- `Scene` owns requested domains, coordinate-system options, mark definitions,
  source definitions, and other declarative inputs.
- `View` owns current domains after zoom/pan, instantiated scales, viewport
  dimensions, interaction transforms, and derived rendering metadata.
- `PrepareContext` exposes the current view state to marks without giving marks
  permission to mutate the scene specification.

The detached render result is already interactive when returned. `Plot.plot()`
creates the internal `View`, attaches zoom/pan/pointer listeners to the output,
and initializes the renderer before returning. The caller only inserts the
result, for example `div.append(plot)`; there is no public mount handshake.

When a view is rendered from a scene, the scene's requested coordinate options
are inputs to the initial view state; subsequent interaction changes belong to
the view. Re-rendering from a new scene resets view state to the scene's
requested initial state by default. Preserving interaction state is an
explicit advanced operation owned by the caller.

Advanced callers may transfer a serializable view-state snapshot:

```js
const state = view.captureState()

const next = Plot.plot(nextSpec, {
  viewState: state
})
```

`ViewState` has a versioned envelope and a coordinate-system discriminator:

```js
{
  version: 1,
  coordinateSystem: 'cartesian',
  // coordinate-system-specific portable interaction state
}
```

It contains portable interaction state such as coordinate domains or zoom
transforms. It does not contain DOM nodes, renderer instances, sampler
workers, compiled functions, or other implementation-owned caches. Importing a
snapshot must validate its version and coordinate-system tag against the new
scene and reject incompatible values. There is no silent clamping or partial
application of a snapshot.

Applying an invalid snapshot throws `InvalidViewStateError`. The error should
identify the snapshot version, coordinate-system tag, or field path that was
incompatible, along with the expected and received values when practical.

## Scene mutation

The scene owns an ordered collection of nodes during construction. `add()`
appends to the default content layer in z-order:

```js
const curve = Plot.lineY('sin(x)', { id: 'sine' })
const scene = Plot.scene({ marks: [curve] })

const zero = Plot.ruleY(0)
scene.add(zero)
scene.remove(curve)
```

If layer placement matters, make it explicit rather than relying on hidden
conventions:

```js
scene.add(Plot.grid(), { layer: 'background' })
scene.add(Plot.text('peak', { x: 1, y: 1 }), { layer: 'overlay' })
```

Groups provide a more general composition mechanism:

```js
scene.add(Plot.group([Plot.lineY('sin(x)'), Plot.derivative('cos(x)')], { name: 'analysis', visible: true }))
```

An initial implementation can expose only `scene.add`, `scene.remove`, and a
read-only inspection method if needed. These operations affect future renders;
they do not mutate an already-rendered output. Parent/child bookkeeping and
traversal do not need to be part of the public interface. A focused `Group`
abstraction can be added if multiple real features need nested composition.

## Sources and marks

Function plot has more meaningful source types than a generic table. The public
API should use factories instead of exposing all combinations of `fnType` and
`graphType`:

```js
Plot.lineY('x^2')
Plot.intervalY('1 / x')
Plot.points([
  [0, 0],
  [1, 1]
])
Plot.parametric({ x: 'cos(t)', y: 'sin(t)' })
Plot.polar({ r: '2 * sin(4 * theta)' })
Plot.implicit('x^2 + y^2 - 1')
```

The factories may create a complete mark for convenience. Internally, they
should still separate the source from the mark so that users can reuse an
expensive source:

```js
const sine = Plot.source.linear('sin(x)')

scene.add(Plot.lineY(sine), Plot.derivative(sine), Plot.secant(sine, { x0: 1 }))
```

This also gives derivative and secant a natural composition model instead of
having them mutate or synthesize hidden datum objects.

## Custom marks

The mark contract should describe behavior, not inheritance. The minimum
renderer-neutral contract is:

```ts
type Mark = {
  prepare(context: PrepareContext): PreparedGeometry | Promise<PreparedGeometry>
}
```

`prepare` is the working name for the required geometry-preparation operation.
It is preferable to `render`, which would incorrectly imply that a mark owns a
renderer or DOM selection. The view may call it repeatedly for the same mark
when viewport state changes, so it must be safe to recompute geometry and must
not mutate the scene specification or the `PrepareContext`. A returned promise
may be resolved asynchronously; the view owns generation/cancellation handling
and must ignore stale results.

The initial contract does not require `render`, `update`, `setSource`,
`invalidate`, `mount`, `add`, `remove`, or `hitTest` methods. Rendering belongs
to the renderer, composition belongs to the scene, and interaction can use
prepared geometry plus coordinate-system state. Mark identity, ordering,
index, color allocation, and renderer handles are scene or view bookkeeping,
not mark methods or required public fields.

`dispose` is a reasonable name for releasing owned resources, but it is not in
the initial mark contract. The detached-render-result model currently has no
reliable public mark lifecycle signal, and the current built-in datums do not
need per-mark disposal once subscriptions and worker cancellation are owned by
the view.

`PrepareContext` provides current view coordinate state, viewport dimensions,
sampler access, invalidation, and shared caches. It must not expose a D3
selection, SVG node, or Canvas context, and it must not provide a path for
mutating the scene specification.

The initial mark contract does not include a frame-time or animation-clock
input. A mark may be recomputed when view state changes, especially when pan
or zoom changes the scales, domain, viewport, or sampling requirements.

`PreparedGeometry` should initially cover the primitives function-plot needs:

- paths and segmented paths;
- points and point batches;
- rectangles and rectangle batches;
- circles and arcs;
- text;
- style and accessibility metadata.

### Resource ownership audit

The current datum types do not generally own resources that need explicit
cleanup:

<!-- prettier-ignore -->
| Current datum/helper | What it allocates or retains | Initial disposal decision |
|---|---|---|
| polyline, scatter, text, annotation | evaluated arrays, compiled-expression caches, SVG elements, and vector marker definitions | no mark disposal; released with the render result and ordinary references |
| interval, including implicit interval evaluation | typed arrays, promises, and possible worker-pool tasks | cancellation/generation belongs to the internal `View` and sampler pool |
| parametric, polar, and vector data | specialized polyline evaluation or SVG marker geometry | no separate lifecycle; use the owning mark/view lifecycle |
| derivative and secant helpers | derived helper geometry whose parameters can depend on pointer state | pointer subscriptions belong to the internal `View`; marks receive current interaction state during preparation |
| tooltip and zoom interaction | DOM listeners, D3 zoom state, and chart event subscriptions | internal `View` concern, not a mark method |

The main non-GC concerns are event subscriptions and asynchronous worker
tasks, not the datum objects or generated geometry themselves. The new
`prepare` operation should be side-effect-free from the scene's perspective;
the view should own subscriptions and cancellation. This keeps `dispose`
outside the initial mark contract while leaving a concrete path to add it if a
real resource-owning custom mark appears.

Pointer-driven helpers such as derivative and secant should follow the same
rule. `updateOnMouseMove` is a view interaction concern: the view tracks the
pointer, invalidates affected geometry, and invokes mark preparation with the
current interaction state. A mark must not register a listener on the view or
chart emitter during preparation.

The interaction contract has three possible shapes:

<!-- prettier-ignore -->
| Shape | Advantages | Costs |
|---|---|---|
| Generic read-only `context.interaction` snapshot | one renderer-neutral seam; shared semantics for pointer, hover, selection, and future interactions; no mark-owned subscriptions | expands the public contract early; needs precise coordinate semantics; any interaction change can invalidate more marks than necessary |
| Mark-specific listener or interaction methods | interactive behavior stays local to the mark; no generic context object | leaks view/event ownership into marks; duplicates hit testing and cleanup; requires a lifecycle contract |
| Internal interaction state only at first | smallest public surface; lets built-in helpers prove the model before stabilizing it | custom interactive marks cannot use the feature initially; built-ins need an internal adapter until a second use case appears |

The selected v1 direction is the third option: keep interaction state internal
while moving built-in pointer behavior into the view. If a user-defined
interactive mark becomes a real use case, expose a narrow read-only interaction
snapshot through `PrepareContext`, not event subscriptions or mark-specific
lifecycle methods.

Users should be able to contribute a mark by passing any object satisfying the
contract directly to `marks` or `scene.add()`. Marks do not need to implement
parent/child bookkeeping. A factory helper is useful for users who prefer a
named constructor:

```js
const customMark = Plot.mark({
  prepare(context) {
    return makeGeometry(context)
  }
})
```

Renderer-specific output can be an explicit optional capability, but should
not be required for ordinary marks.

## Rendering and ownership

`Plot.plot()` must never add defaults, compiled expressions, generated ids, or
other runtime state to the object supplied by the caller. The scene owns a
normalized internal representation.

Each declarative render creates a new normalized scene and output:

```js
const nextPlot = Plot.plot({
  marks: [Plot.lineY('x')]
})

container.replaceChildren(nextPlot)

const replacement = Plot.plot({
  title: 'Quadratic',
  tip: { xLine: true, yLine: true },
  marks: [Plot.lineY('x^2'), Plot.derivative('2 * x', { updateOnPointer: true })]
})

container.replaceChildren(replacement)
```

`Plot.plot(spec)` must leave `spec` untouched. It may normalize defaults,
compile expressions, and allocate runtime state internally, but that state is
owned by the returned render result or by an explicitly created `Scene`.

Scene composition remains imperative before rendering:

```js
scene.add(Plot.ruleY(0))
scene.remove(oldMark)
```

If the same scene is rendered again after composition changes, the new output
is a fresh render and the caller replaces the previous output. Asynchronous
sampler results must be associated with an internal generation or cancellation
token so stale worker results cannot overwrite newer scene state.

The same internal render pipeline may be reused for view-state changes. That
reuse is an implementation detail of the mounted `View`, not a public promise
of incremental reconciliation between two scene specifications.

### Render result lifecycle

These operations should have distinct meanings:

- `Plot.scene(spec)` creates an unmounted scene.
- `scene.render(options)` creates a render result from the current scene.
- `Plot.plot(spec)` is shorthand for scene creation plus one render.
- The caller inserts, replaces, or removes the detached render result.
- The caller may use the returned host element's native `remove()` method to
  detach it.
- `scene.render(options)` may be called again, but produces a new output rather
  than incrementally updating a previous one.

`plot` is the high-level construction convenience; `render` is the explicit
render operation. The returned output is a real host element, so callers can
use its native `remove()` operation to detach it. This is not a
library-specific disposal operation. A `View` may still be needed internally
for zoom, pointer interaction, and renderer resources, but it is not the
public mounting or update surface.

There are three distinct removal concerns:

- `scene.remove(mark)` changes an unrendered scene's composition.
- `plot.remove()` detaches the rendered host element from its parent.
- Resource disposal is an internal lifecycle concern and is not part of the
  initial public mark contract.

## Coordinate systems

Cartesian coordinates are the default and use the concise `x` and `y` options.
Other systems become explicit objects:

```js
Plot.scene({
  coordinateSystem: 'polar',
  r: { domain: [0, 2], grid: true },
  theta: { domain: [0, 2 * Math.PI], labels: true },
  marks: [Plot.polar({ r: '2 * sin(4 * theta)' })]
})
```

A coordinate system owns scales, projection, inverse projection, ticks, axes,
grid generation, aspect-ratio behavior, and coordinate-aware interactions and
decorations. The initial coordinate systems are built-in implementations, not
public extension contracts. Axes, ticks, and grids are not ordinary marks in
the scene's content collection. This makes polar grids a natural
coordinate-system decoration rather than a special case in `Chart`.

Marks represent plotted content such as curves, intervals, points, text, and
annotations. A coordinate system may expose options or focused factories for
custom coordinate decorations without making those decorations part of the
ordinary mark list.

The first version should support one coordinate system per viewport. Multiple
coordinate systems can later be represented by nested viewports or groups.

## Migration from the current main API

The current `Chart` combines scene state, DOM ownership, D3 scales, zoom,
tooltips, data joins, and rendering. The current `Mark.render(selection)` method
is therefore a useful historical seam but not a sufficient renderer boundary.

Migration can be incremental:

1. Extract `Scene`, an internal `View`, `Mark`, and internal built-in
   `CoordinateSystem` implementations. Keep any node-ownership protocol
   internal.
2. Implement a Cartesian coordinate system around current behavior.
3. Keep the SVG renderer and adapt existing graph types to prepare geometry.
4. Replace public `data`/`fnType`/`graphType` composition with mark factories.
5. Implement polar coordinates and polar grid as the first new coordinate
   system.
6. Add a shared display-list or geometry layer.
7. Implement Canvas using the same scene and prepared geometry.

A temporary v1-datum adapter may remain at the boundary, but it should not
shape the new internal model.

## Deferred design questions

These questions do not block a first vertical slice. Use conservative defaults
and promote an item to an architectural decision only when implementation or a
real use case makes the tradeoff concrete:

- Which view-state values belong in the serializable snapshot, and what
  coordinate-system-specific fields should it contain?
- Should the initial `marks` input accept only a flat array of mark instances,
  or also nested arrays and functions returning marks?
- What is the smallest `PreparedGeometry` vocabulary that covers the existing
  SVG marks and a first custom mark?
- How should hit testing work consistently across SVG and Canvas?
- Should a custom mark declare data-space dependencies, or should the view
  conservatively recompute all marks after viewport interactions?
- If nested composition becomes common, should `Group` be public, or remain an
  internal implementation detail of `Scene` and composite marks?
- Should renderer selection be explicit, or should SVG remain the default?

The following behavior is already settled: a rendered output is detached and
immutable from the scene's perspective; callers may mutate a scene and render
another fresh output, but no existing output is updated in place.

## Contract summary

The implementation should satisfy these accepted decisions; their rationale is
in [vision.md](./vision.md):

1. `Plot.plot(spec)` is the concise Observable-style entry point.
2. `Plot.scene(spec)` creates an unmounted, mutable scene builder.
3. `marks` is declarative initialization; `scene.add/remove` are runtime scene
   construction operations that affect the next render only.
4. Every render uses an explicit `marks` collection; marks do not expose a
   `.plot()` shorthand.
5. `Scene` is the deep public module for composition, invalidation, and
   lifecycle; it does not expose declarative `update()`.
6. `Mark` is the public extension contract; hierarchy and ownership details
   remain internal.
7. `render()` creates a new output from the current scene; there is no
   `scene.plot()` or `view.update()`. The caller owns mounting and replacing
   detached render results.
8. User input objects are never mutated or used as runtime caches.
9. `Scene` owns declarative intent while `View` owns mutable runtime
   coordinates, interaction state, and derived metadata.
10. Declarative changes replace rendered output rather than reconcile marks in
    place; scene mutations affect only a subsequent render.
11. New declarative renders reset view state to the scene's requested initial
    state; state transfer is explicit and advanced.
12. Advanced callers can transfer a serializable `ViewState` snapshot; it
    contains portable interaction state, not renderer or sampler resources, and
    incompatible snapshots are rejected.
13. Marks prepare renderer-neutral geometry and may be contributed by users.
14. Axes, ticks, grids, and coordinate-aware decorations belong to the
    `CoordinateSystem`, while marks represent plotted content.
15. Coordinate systems are built-in and internal initially; `Mark` is the main
    public extension point.
16. Interaction state is internal initially; built-in pointer behavior belongs
    to `View` and does not expand the public mark contract.
17. Function sources and visual marks are separate internally, even when a
    convenience factory combines them publicly.

## Implementation readiness

There are no hard architectural blockers for a first implementation. The
smallest useful vertical slice is:

1. `Plot.plot({ marks: [...] })` returning a detached interactive SVG result.
2. `Scene` construction with `add()` and `remove()` before rendering.
3. A Cartesian built-in coordinate system with runtime view-owned scales.
4. A minimal `Mark.prepare(context)` contract and prepared paths, points, and
   text.
5. Internal zoom/pan recomputation with no public declarative update method.

Canvas, polar coordinates, serializable state transfer, custom interaction
state, and broader geometry/hit-testing contracts can follow as separate
increments.
