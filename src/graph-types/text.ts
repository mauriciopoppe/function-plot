import { Selection } from 'd3-selection'
import { hsl as d3Hsl } from 'd3-color'

import { color } from '../utils.mjs'

import { Mark } from './mark.js'
import { TextFunction } from '../types.js'

export class Text extends Mark {
  location: [number, number]
  text: ''

  constructor(options: any) {
    super(options)
    this.location = options.location
    this.text = options.text
  }

  render(selection: Selection<any, TextFunction, any, any>) {
    const innerSelection = selection.selectAll('text.fn-text').data([this.location])
    const innerSelectionEnter = innerSelection.enter().append('text').attr('class', `fn-text fn-text-${this.index}`)

    const computeColor = color(this, this.index)

    // enter + update
    innerSelection
      .merge(innerSelectionEnter)
      .attr('fill', d3Hsl(computeColor.toString()).brighter(1.5).formatHex())
      .attr('x', (d) => this.chart.meta.xScale(d[0]))
      .attr('y', (d) => this.chart.meta.yScale(d[1]))
      .text(() => this.text)

    if (this.attr) {
      for (const k in this.attr) {
        selection.attr(k, this.attr[k])
      }
    }

    // exit
    innerSelection.exit().remove()
  }
}

export function text(options: any) {
  return new Text(options)
}
