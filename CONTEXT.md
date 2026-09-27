# Function Plot API Domain

This context defines the vocabulary for composing, updating, and rendering
function plots in the next public API.

## Composition

**Scene**:
A user-owned composition of ordered visual marks plus shared plotting state.
It is independent of a mounted DOM target and is mutable until rendered.
Declarative changes create a replacement render rather than updating an
existing output. A scene may contain no marks when only coordinate-system
decorations or an empty plotting surface are needed.

_Avoid_: chart instance

**Scene specification**:
The declarative composition and render inputs that describe what a plot should
contain, including marks, sources, scales, and presentation options.

_Avoid_: view state, chart instance

**Mark**:
A visual participant in a scene that turns plot state and source data into
renderable geometry through the public extension contract.

_Avoid_: graph type, layer

**View**:
A mounted presentation of a scene that connects it to a target, interaction
state, and a renderer. It is not a declarative update handle.

_Avoid_: plot, chart

**Render result**:
A detached SVG, Canvas, or other renderer output produced from a scene. The
caller owns inserting, replacing, and removing it from the UI; interaction
listeners and internal view state are initialized before the result is
returned.

_Avoid_: mounted chart, view update

**View state**:
Runtime state of a mounted presentation, including zoom, pan, pointer
position, viewport dimensions, scales, and renderer metadata. View-state
changes may trigger internal rerenders without changing the scene
specification; pan and zoom can require marks to recompute their geometry.
Pointer-driven helper behavior is also owned by view state rather than by
mark-owned event subscriptions.

_Avoid_: scene specification, update spec

**Coordinate state**:
The mutable runtime coordinate state owned by a `View`, including current
domains after pan or zoom, instantiated scales, viewport dimensions, and
derived metadata. It is initialized from a scene specification but is not
written back into that specification. A new declarative render initializes
fresh coordinate state; transferring it between views is an explicit advanced
operation.

_Avoid_: scene domain, options cache

**View-state snapshot**:
A serializable capture of portable interaction state, such as coordinate
domains or zoom transforms, that can be explicitly applied to another render.
It has a schema version and coordinate-system tag, and excludes DOM nodes,
renderer instances, workers, compiled functions, and other runtime resources.
Applying an incompatible snapshot is rejected rather than clamped or partially
applied.

_Avoid_: scene specification, renderer cache

**Group**:
A possible composite mark that owns nested marks when real use cases require
nested composition. It is not currently a required general-purpose hierarchy.

_Avoid_: scene node

## Plot data

**Source**:
Mathematical or static input consumed by one or more marks, such as an
expression, point collection, parametric pair, or polar expression.

_Avoid_: datum, graph type

**Coordinate system**:
The built-in plotting context that maps data coordinates to the viewport and
owns scales, projections, inverse mapping, axes, ticks, grids, and other
coordinate-aware decorations. Coordinate systems are internal implementations
in the initial public API.

_Avoid_: axis mark, grid mark, chart options, public coordinate-system adapter

**Prepared geometry**:
Renderer-neutral visual primitives produced by a mark for a particular view
state, such as paths, points, rectangles, text, or arcs.

_Avoid_: SVG selection, render output
