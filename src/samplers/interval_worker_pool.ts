import { FunctionPlotDatum } from '../types'
import Worker from 'web-worker'

interface IntervalTask {
  d: FunctionPlotDatum
  lo: number
  hi: number
  n: number
  nGroup: number
  interval2d: Float32Array

  // internal
  valid?: boolean
  nTask?: number
}

class IntervalWorkerPool {
  private tasks: Array<IntervalTask>
  private idleWorkers: Array<Worker>
  private resolves: Map<number, (value: any) => void>
  private rejects: Map<number, (value: any) => void>
  private nTasks: number

  constructor(nThreads: number) {
    this.nTasks = 0
    this.idleWorkers = []
    this.tasks = []
    this.resolves = new Map()
    this.rejects = new Map()

    for (let i = 0; i < nThreads; i += 1) {
      // NOTE: new URL(...) cannot be a variable!
      // This is a requirement for the webpack worker loader
      const worker = new Worker(
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

  terminate() {
    for (let i = 0; i < this.idleWorkers.length; i += 1) {
      this.idleWorkers[i].terminate()
    }
  }

  queue(task: IntervalTask): Promise<ArrayBuffer> {
    task.nTask = this.nTasks
    task.valid = true

    for (let i = 0; i < this.tasks.length; i += 1) {
      if (this.tasks[i].d.index === task.d.index && this.tasks[i].nGroup === task.nGroup) {
        this.tasks[i].valid = false
      }
    }

    // new task
    this.tasks.push(task)

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

      // console.log(`working on task ${task.nTask}`)
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

export { IntervalWorkerPool }
