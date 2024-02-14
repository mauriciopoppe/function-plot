import Worker from 'web-worker'

import { FunctionPlotDatum } from '../types.js'

interface IntervalTask {
  d: FunctionPlotDatum
  lo: number
  hi: number
  n: number
  nGroup: number
  interval2d: Float32Array

  // internal
  valid: boolean
  nTask: number

  // backpressure is the algorithm to use when there
  // are a lot of tasks pending in the queue
  backpressure?: 'invalidate' | 'none'
}

export enum BackpressureStrategy {
  None = 'none',
  InvalidateSeenScan = 'invalidateSeenScan',
  InvalidateSeenMap = 'invalidateSeenMap',
  InvalidateSeenLimit = 'invalidateSeenLimit'
}

function getTaskId(task: IntervalTask) {
  if (typeof task.d.index === 'undefined') {
    throw new Error(`invariant: datum ${task.d} must have an index set but it wasn't set.`)
  }
  return task.d.index * 1000 + task.nGroup
}

export class IntervalWorkerPool {
  private tasks: Array<IntervalTask>
  private idleWorkers: Array<Worker>
  private resolves: Map<number, (value: any) => void>
  private rejects: Map<number, (value: any) => void>
  private taskIdToIdx: Map<number, Array<IntervalTask>>
  private nTasks: number
  private backpressure: BackpressureStrategy

  constructor(nThreads: number) {
    this.nTasks = 0
    this.idleWorkers = []
    this.tasks = []
    this.resolves = new Map()
    this.rejects = new Map()
    this.backpressure = BackpressureStrategy.InvalidateSeenScan
    this.taskIdToIdx = new Map()

    for (let i = 0; i < nThreads; i += 1) {
      // NOTE: new URL(...) cannot be a variable!
      // This is a requirement for the webpack worker loader
      // @ts-ignore
      const worker = new Worker(
        // @ts-ignore
        new URL(/* webpackChunkName: "asyncIntervalEvaluator" */ './interval.worker.mjs', import.meta.url),
        { type: 'module' }
      )
      worker.onmessage = (messageEvent) => {
        const { interval2d, nTask } = messageEvent.data
        this.resolves[nTask](interval2d)
        delete this.resolves[nTask]
        this.idleWorkers.push(worker)
        this.drain()
      }
      this.idleWorkers.push(worker)
    }
  }

  setBackpressure(backpressure: BackpressureStrategy): IntervalWorkerPool {
    this.backpressure = backpressure
    return this
  }

  terminate() {
    for (let i = 0; i < this.idleWorkers.length; i += 1) {
      this.idleWorkers[i].terminate()
    }
  }

  queue(task: IntervalTask): Promise<ArrayBuffer> {
    task.nTask = this.nTasks
    task.valid = true

    if (this.backpressure === BackpressureStrategy.None) {
      // push a new task to the queue regardless of its capacity.
      this.tasks.push(task)
    }

    // invalidate cache with a linear scan.
    if (this.backpressure === BackpressureStrategy.InvalidateSeenScan) {
      // push a new task after invalidating all the previous ones
      for (let i = 0; i < this.tasks.length; i += 1) {
        if (getTaskId(this.tasks[i]) === getTaskId(task)) {
          this.tasks[i].valid = false
        }
      }
      this.tasks.push(task)
    }

    // invalidate backpressure with map
    if (this.backpressure === BackpressureStrategy.InvalidateSeenMap) {
      // push a new task after invalidating all the previous ones (with a map)
      const taskId = getTaskId(task)
      if (!this.taskIdToIdx.has(taskId)) {
        this.taskIdToIdx.set(taskId, [])
      }
      const oldTasks = this.taskIdToIdx.get(taskId)
      while (oldTasks.length > 0) {
        const oldTask = oldTasks.shift()
        oldTask.valid = false
      }
      oldTasks.push(task)
      this.tasks.push(task)
    }

    // invalidate cache with capacity
    if (this.backpressure === BackpressureStrategy.InvalidateSeenLimit) {
      // keep the capacity bounded to at most 100 items
      for (let i = this.tasks.length - 100; i >= 0; i -= 1) {
        this.tasks[i].valid = false
      }
      this.tasks.push(task)
    }

    const p: Promise<ArrayBuffer> = new Promise((resolve, reject) => {
      this.resolves[task.nTask] = resolve
      this.rejects[task.nTask] = reject
    })
    this.nTasks += 1
    this.drain()
    return p
  }

  drain() {
    while (this.hasWork()) {
      const task = this.tasks.shift()
      if (!task.valid) {
        // This task is no longer valid (because there's a newer task)
        // resolve with the input value.
        this.resolves[task.nTask](task.interval2d.buffer)
        continue
      }
      const idleWorker = this.idleWorkers.shift()
      // dStripped is a serializable copy of the datum `d`.
      const dStripped: any = {}
      dStripped.fn = task.d.fn
      dStripped.scope = task.d.scope
      idleWorker.postMessage(
        // prettier-ignore
        {
          d: dStripped,
          lo: task.lo,
          hi: task.hi,
          n: task.n,
          nTask: task.nTask,
          interval2d: task.interval2d
        },
        [task.interval2d.buffer]
      )
    }
  }

  hasWork() {
    return this.tasks.length > 0 && this.idleWorkers.length > 0
  }
}
