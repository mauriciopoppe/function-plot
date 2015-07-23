'use strict';

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

// implicit
//functionPlot({
//  target: '#playground',
//  data: [{
//    fn: 'x * x + y * y - 1',
//    implicit: true
//  }]
//});

/*
 "x!"         // throwing an error
 "x^2 - 2"
 "x^2 - x"
 "x^0.5"      // todo
 "pow(x,0.5)" // todo
 "x * pi"
 "x + exp(1)"
 "x + exp(exp(1))"
 "gamma(x)"         // not implemented
 "cube(2x)"         // (2x)^3

 This equation fails online also:

 "x^x"
 */

functionPlot({
  target: '#playground',
  data: [
    //{ fn: 'sin(exp(x))', graphOptions: {sampler: 'mathjs', type: 'line'}, samples: 4000 },
    //{ fn: 'tan(x)', graphOptions: {sampler: 'mathjs', type: 'line'}, samples: 5000 },
    { fn: 'gamma(x)', graphOptions: {sampler: 'mathjs', type: 'line'} },
    //{ fn: 'sin(x/2)' },
    //{ fn: 'cos(x)' },
    //{ fn: 'tan(x)' },
    //{ fn: 'cos(x) + sin(x/4)' }
  ]
});

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
//    parametric: true,
//    graphOptions: {
//      type: 'line'
//    }
//  }]
//});

//functionPlot({
//  target: '#playground',
//  yDomain: [-1.897959183, 1.897959183],
//  xDomain: [-3, 3],
//  data: [{
//    r: 'sin(6 theta) + 2',
//    polar: true,
//    graphOptions: {
//      type: 'line'
//    }
//  }]
//});
