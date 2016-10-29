'use strict';

// functionPlot({
//   target: '#playground',
//   data: [{
//     fn: 'x^2'
//   }]
// })

functionPlot({
  target: '#playground',
  // yAxis: { invert: true, },
  // xAxis: { invert: true, },
  data: [
    { fn: '2^x', sampler: 'builtIn', graphType: 'polyline'}
  ]
})

// functionPlot({
//   target: '#playground',
//   width: 1200,
//   height: 400,
//   data: [{
//     fn: 'x^2'
//   }]
// })

// var instance = functionPlot({
//   title: 'test',
//   target: '#playground',
//   grid: true,
//   data: [{
//     fn: 'x * x + y * y - 1',
//     fnType: 'implicit'
//   }]
// })
//instance.on('programmatic-zoom', function () {
//  console.log('end')
//})

// // linked graphs
// var a = functionPlot({
//   target: '#linked-a-multiple',
//   height: 250,
//   xAxis: {domain: [-10, 10]},
//   data: [{ fn: 'x * x' }]
// })
// var b = functionPlot({
//   target: '#linked-b-multiple',
//   height: 250,
//   xAxis: {domain: [-20, 20]},
//   data: [{ fn: '2 * x' }]
// })
// a.addLink(b)
// b.addLink(a)

//// annotation test
//functionPlot({
//  target: '#playground',
//  data: [{
//    fn: 'x * x'
//  }],
//  annotations: [{
//    x: 2,
//    text: 'x = 2'
//  }, {
//    y: 2,
//    text: 'y = 2'
//  }]
//});

//// implicit
//functionPlot({
//  target: '#playground',
//  data: [{
//    fn: 'x * x + y * y - 1',
//    fnType: 'implicit'
//  }]
//});
