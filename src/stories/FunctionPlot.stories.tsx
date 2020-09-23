import React from 'react'
import { Story, Meta } from '@storybook/react'

import { FunctionPlot, FunctionPlotProps } from './FunctionPlot'

export default {
  title: 'Examples/Hello World',
  component: FunctionPlot,
  argTypes: {
    options: { control: 'object' }
  }
} as Meta;

const Template: Story<FunctionPlotProps> = (args) => <FunctionPlot {...args} />

export const HelloWorld = Template.bind({});
HelloWorld.args = {
  options: {
    data: [{ fn: 'x^2' }]
  }
}

export const AdditionalOptions = Template.bind({})
AdditionalOptions.args = {
  options: {
    width: 580,
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

