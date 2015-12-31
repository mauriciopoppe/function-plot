'use strict';

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
var a = functionPlot({
  target: '#linked-a-multiple',
  height: 250,
  xAxis: {domain: [-10, 10]},
  data: [{ fn: 'x * x' }]
})
var b = functionPlot({
  target: '#linked-b-multiple',
  height: 250,
  xAxis: {domain: [-20, 20]},
  data: [{ fn: '2 * x' }]
})
a.addLink(b)
b.addLink(a)

//var instance = functionPlot({
//  target: '#playground',
//  xDomain: [0.01, 1],
//  yDomain: [-100, 100],
//  data: [{
//    fn: '1/x * cos(1/x)',
//    closed: true
//  }],
//  plugins: [
//    functionPlot.plugins.definiteIntegral()
//  ]
//})
//instance.on('definite-integral', function (datum, i, value, a, b) {
//  console.log(value, a, b)
//})


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

//// parametric:
//functionPlot({
//  target: '#playground',
//  yDomain: [-1.897959183, 1.897959183],
//  xDomain: [-3, 3],
//  data: [{
//    //x: 'cos(5t)',
//    //y: 'sin(3t)',
//
//
//    //y=(cosq)(e^(cosq)-2cos4q-(sin(q/12))^5)
//    //x=(sinq)(e^(cosq)-2cos4q-(sin(q/12))^5)
//    x: 'sin(t) * (exp(cos(t)) - 2 cos(4t) - sin(t/12)^5)',
//    y: 'cos(t) * (exp(cos(t)) - 2 cos(4t) - sin(t/12)^5)',
//    range: [-10 * Math.PI, 10 * Math.PI],
//    fnType: 'parametric',
//    graphType: 'polyline'
//  }]
//});

//// polar
//functionPlot({
//  target: '#playground',
//  yDomain: [-1.897959183, 1.897959183],
//  xDomain: [-3, 3],
//  data: [{
//    r: 'sin(6 theta) + 2',
//    fnType: 'polar',
//    graphType: 'polyline'
//  }]
//});

//// update
//var options = {
//  target: '#playground',
//  data: [{
//    fn: 'x'
//  }]
//};
//var instance
//document.querySelector('#update').addEventListener('click', function () {
//  if (!options.title) {
//    // add a title, a tip and change the function to y = x * x
//    options.title = 'hello world';
//    options.tip = {
//      xLine: true,
//      yLine: true
//    };
//    options.data[0] = {
//      fn: 'x * x',
//      derivative: {
//        fn: '2 * x',
//        updateOnMouseMove: true
//      }
//    }
//  } else {
//    // remove the title and the tip
//    // update the function to be y = x
//    delete options.title;
//    delete options.tip;
//    options.data[0] =  {
//      fn: 'x'
//    }
//  }
//  functionPlot(options);
//});
//instance = functionPlot(options);
//instance.on('eval', function (data, i, isHelper) {
//  if (!isHelper) {
//    console.log(data, i)
//  }
//})

// points
//functionPlot({
//  target: '#playground',
//  data: [{
//    points: [
//      [1, 1],
//      [2, 1],
//      [2, 2],
//      [1, 2],
//      [1, 1]
//    ],
//    fnType: 'points',
//    graphType: 'polyline'
//  }]
//});
