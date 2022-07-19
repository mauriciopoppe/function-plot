import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'

import { FunctionPlot, FunctionPlotProps } from './FunctionPlot'

export default {
  title: 'Examples',
  component: FunctionPlot,
  argTypes: {
    options: { control: 'object' }
  }
} as Meta;

const Template: Story<FunctionPlotProps> = (args: any) => <FunctionPlot {...args} />

export const PlottingACurve = Template.bind({});
PlottingACurve.args = {
  options: {
    data: [{ fn: 'x^2' }]
  }
}

export const AdditionalOptions = Template.bind({})
AdditionalOptions.args = {
  options: {
    width: 600,
    height: 400,
    title: 'hello world',
    xAxis: {
      label: 'x - axis',
      domain: [-6, 6]
    },
    yAxis: {
      label: 'y - axis'
    },
    data: [{
      fn: 'x^2'
    }]
  }
}
