import React, { useEffect, useRef } from 'react'
import functionPlot from '../'
import { FunctionPlotOptions } from '../types'
import Highlight, { defaultProps } from "prism-react-renderer";
import github from 'prism-react-renderer/themes/github';

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

export const Render: React.FC<{ id?: string, content: string, noCode?: boolean }> = ({ id, content, noCode }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.textContent = content

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  });

  return (
    <div style={{ display: 'flex' }}>
      {noCode ? null : <div style={{ flex: '50%' }}>
        <Highlight {...defaultProps} theme={github} code={content} language="jsx">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>}
      {id ? <div style={{ flex: '50%' }} id={id} /> : null}
    </div>
  )
}
