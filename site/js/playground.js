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
var instance = functionPlot({
  target: '#playground',
  data: [
    { fn: 'x' },
    { fn: 'x^2' }
  ]
});

//instance.on('tip:update', function () {
//  console.log(arguments)
//})
