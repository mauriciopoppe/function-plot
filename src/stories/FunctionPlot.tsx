import React, { useEffect, useRef } from 'react'
import functionPlot from '../'
import { FunctionPlotOptions } from '../types'

export interface FunctionPlotProps {
  options?: FunctionPlotOptions
}

export const FunctionPlot: React.FC<FunctionPlotProps> = React.memo(({ options }) => {
  const rootEl = useRef(null)

  useEffect(() => {
    try {
      functionPlot(Object.assign({}, options, { target: rootEl.current }))
    } catch (e) {}
  })

  return (<div ref={rootEl} />)
}, () => false)

