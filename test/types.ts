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
