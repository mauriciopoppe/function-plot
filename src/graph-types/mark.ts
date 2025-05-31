import { Chart } from '../index.js'

export interface Attr {
  [key: string]: any
}

export class Mark {
  id: string
  index: number
  color: string
  attr: Attr

  chart: Chart

  constructor(options: any) {
    this.id = options.id
    this.index = options.index
    this.attr = options.attr
    this.color = options.color
  }

  render(selection: any) {}
}
