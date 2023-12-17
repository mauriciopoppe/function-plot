import { FunctionPlotDatum } from '../types'
import Worker from 'web-worker'

interface IntervalTask {
  d: FunctionPlotDatum
  xCoords: Array<number>

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
      if (Object.hasOwn(global, 'process') && process.env.JEST_WORKER_ID) {
        continue
      }
      // NOTE: new URL(...) cannot be a variable!
      // This is a requirement for the webpack worker loader
      const worker = new Worker(
        new URL(/* webpackChunkName: "asyncIntervalEvaluator" */ './interval.worker.ts', import.meta.url),
        { type: 'module' }
      )
      worker.onmessage = (messageEvent) => {
        const { samples, nTask } = messageEvent.data
        this.resolves[nTask](samples)
        delete this.resolves[nTask]
        this.idleWorkers.push(worker)
        this.drain()
      }
      this.idleWorkers.push(worker)
    }
  }

  queue(task: IntervalTask) {
    task.nTask = this.nTasks
    this.nTasks += 1
    this.tasks.push(task)
    const p = new Promise((resolve) => {
      this.resolves[task.nTask] = resolve
    })
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
      idleWorker.postMessage({ d: dStripped, xCoords: task.xCoords, nTask: task.nTask })
    }
  }

  hasWork() {
    return this.tasks.length > 0 && this.idleWorkers.length > 0
  }
}

export { IntervalWorkerPool }
