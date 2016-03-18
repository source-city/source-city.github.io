requirejs.config({
  baseUrl: 'js',
  urlArgs: 'ts=' + (new Date()).getTime(),
  shim: {
    'vendor/three': {
      exports: 'THREE'
    },
    'vendor/underscore': {
      exports: '_'
    },
    'vendor/jquery': {
      exports: '$'
    }
  }
});

require(['city-architect'], function (cityArchitect) {

//  var data = [
//    {
//      label: 'com.bla.BlaBla',
//      metrics: {
//        loc: 100,
//        dependencies: 7
//      }
//    }
//  ];

  var data = [
    { foundations: 100, height: 200},
    { foundations: 150, height: 300},
    { foundations: 250, height: 150},
    { foundations: 150, height: 150},
    { foundations: 100, height: 200},
    { foundations: 100, height: 300},
    { foundations: 150, height: 300},
    { foundations: 150, height: 300},
    { foundations: 170, height: 200},
    { foundations: 50, height: 100},
    { foundations: 50, height: 100},
    { foundations: 50, height: 100},
    { foundations: 50, height: 100},
    { foundations: 50, height: 100},
    { foundations: 50, height: 100},
    { foundations: 50, height: 100},
    { foundations: 50, height: 100},
    { foundations: 80, height: 100},
    { foundations: 80, height: 100},
    { foundations: 80, height: 100},
    { foundations: 80, height: 100},
    { foundations: 80, height: 100},
    { foundations: 80, height: 100},
    { foundations: 100, height: 200},
    { foundations: 200, height: 250},
    { foundations: 100, height: 120},
    { foundations: 100, height: 100},
    { foundations: 80, height: 250},
    { foundations: 90, height: 250},
    { foundations: 200, height: 250},
    { foundations: 90, height: 250},
    { foundations: 90, height: 250},
    { foundations: 90, height: 250},
    { foundations: 90, height: 250},
    { foundations: 90, height: 250},
    { foundations: 90, height: 250},
    { foundations: 90, height: 250},
    { foundations: 90, height: 250},
    { foundations: 90, height: 250},
    { foundations: 90, height: 250}
  ];
  
  var city = cityArchitect.buildCity(data);
  document.body.appendChild(city);

});
