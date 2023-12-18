import { FunctionPlotDatum } from '../types'
import Worker from 'web-worker'

interface IntervalTask {
  d: FunctionPlotDatum
  lo: number
  hi: number
  n: number
  interval2d: Float32Array

  // internal
  nTask?: number
}

class IntervalWorkerPool {
  private tasks: Array<IntervalTask>
  private idleWorkers: Array<Worker>
  private resolves: Map<number, (value: any) => void>
  private nTasks: number

  constructor(nThreads: number) {
    this.nTasks = 0
    this.idleWorkers = []
    this.tasks = []
    this.resolves = new Map()

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
    this.tasks.push(task)
    const p: Promise<ArrayBuffer> = new Promise((resolve) => {
      this.resolves[task.nTask] = resolve
    })
    this.nTasks += 1
    this.drain()
    return p
  }

  drain() {
    while (this.hasWork()) {
      const task = this.tasks.shift()
      const idleWorker = this.idleWorkers.shift()

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
