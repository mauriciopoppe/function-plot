import functionPlot from '../../src'

// snippets is a list of tests to run in:
// - the image snapshot tests.
// - to test typescript types.
const snippets = [
  {
    testName: 'should render an x^2 graph',
    fn: function () {
      functionPlot({
        target: '#playground',
        data: [{ fn: 'x^2', graphType: 'polyline' }]
      })
    }
  },
  {
    testName: 'should render with additional options',
    fn: function () {
      // prettier-ignore
      functionPlot({
        target: '#playground',
        title: 'quadratic with options',
        width: 580,
        height: 400,
        disableZoom: true,
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
      })
    }
  },
  {
    testName: 'should render a grid',
    fn: function () {
      // prettier-ignore
      functionPlot({
        target: '#playground',
        xAxis: {
          label: 'real'
        },
        yAxis: {
          label: 'imaginary'
        },
        grid: true,
        data: [
          { fn: 'sqrt(1 - x * x)' },
          { fn: '-sqrt(1 - x * x)' }
        ]
      })
    }
  },
  {
    testName: 'should render distinct domains',
    fn: function () {
      // prettier-ignore
      functionPlot({
        target: '#playground',
        yAxis: { domain: [-1, 1] },
        xAxis: { domain: [8, 24] },
        data: [{
          fn: 'sin(x)'
        }]
      })
    }
  },
  {
    testName: 'should evaluate with multiple samples',
    fn: function () {
      functionPlot({
        target: '#playground',
        data: [
          {
            fn: 'sin(x)',
            nSamples: 1000
          }
        ]
      })
    }
  },
  {
    testName: 'should render annotations',
    fn: function () {
      // prettier-ignore
      functionPlot({
        target: '#playground',
        yAxis: { domain: [-1, 9] },
        data: [{
          fn: 'x^2'
        }],
        annotations: [{
          x: -1
        }, {
          x: 1,
          text: 'x = 1'
        }, {
          y: 2,
          text: 'y = 2'
        }]
      })
    }
  },
  {
    testName: 'should render closed paths',
    fn: function () {
      // prettier-ignore
      functionPlot({
        target: '#playground',
        xAxis: { domain: [-2, 12] },
        data: [{
          fn: '3 + sin(x)',
          range: [2, 8],
          closed: true
        }]
      })
    }
  },
  {
    testName: 'should render logarithmic scales',
    fn: function () {
      functionPlot({
        target: '#playground',
        xAxis: {
          type: 'log',
          domain: [0.01, 1]
        },
        yAxis: {
          domain: [-100, 100]
        },
        grid: true,
        data: [
          {
            fn: '1/x * cos(1/x)',
            // to make it look like a definite integral
            closed: true
          }
        ]
      })
    }
  },
  {
    testName: 'should render text',
    fn: function () {
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
    }
  },
  {
    testName: 'should destroy the svg node on destroy',
    fn: function () {
      const instance = functionPlot({
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
      instance.destroy()
    }
  },
  {
    testName: 'should render x^2 [async]',
    fn: function () {
      const nSamples = 1000
      functionPlot.withWebWorkers(8)
      functionPlot({
        target: '#playground',
        data: [
          { fn: 'x^2', sampler: 'asyncInterval', nSamples },
          { fn: 'x^3', sampler: 'asyncInterval', nSamples },
          { fn: '1/x', sampler: 'asyncInterval', nSamples },
          { fn: 'sin(x)', sampler: 'asyncInterval', nSamples }
        ]
      })
    }
  },
  {
    testName: 'should render with different postition of the axes',
    fn: function () {
      // prettier-ignore
      functionPlot({
        target: '#playground',
        title: 'quadratic with different axes position',
        width: 580,
        height: 400,
        xAxis: {
          position: 'sticky'
        },
        yAxis: {
          position: 'left'
        },
        data: [{
          fn: 'x^2'
        }]
      })
    }
  }
]

export { snippets }
