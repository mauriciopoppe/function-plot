# Design Documentation

These documents describe the architecture and API direction of function-plot.
Read them in this order when contributing to the next API generation:

1. [Vision](./vision.md) — durable principles and repository-level philosophy.
2. [API refactor](./api-refactor.md) — concrete public contracts, lifecycle
   semantics, and implementation seams.
3. [Render pipeline](./pipeline.md) — the current compile, sample/evaluate,
   and render architecture.
4. [Web workers](./web-workers.md) — asynchronous interval sampling and worker
   performance considerations.

The current `src/` implementation is the legacy v1-style API being migrated.
Use the vision and API refactor documents to guide new API work; use the
pipeline and worker notes to understand compatibility constraints and the
existing implementation.
