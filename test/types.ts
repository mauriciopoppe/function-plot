// test with `npx check-dts`
import functionPlot from '../src/'

functionPlot({
  target: '#playground',
  data: [
    {
      graphType: 'text',
      location: [1, 1],
      text: 'hello world'
    },
    {
      graphType: 'text',
      location: [-1, -1],
      text: 'foo bar',
      attr: {
        'text-anchor': 'end'
      }
    }
  ]
})

functionPlot({
  target: '#playground',
  coordinateSystem: 'polar',
  polar: {
    grid: true,
    radiusDomain: [0, 3],
    radialTicks: 5,
    angularTicks: 12,
    angularLabels: true,
    angleUnit: 'degrees',
    radiusTickFormat: (value) => value.toFixed(1),
    angleTickFormat: (value) => value + '°'
  },
  data: [
    {
      r: '2 * sin(4 * theta)',
      fnType: 'polar',
      graphType: 'polyline'
    }
  ]
})
