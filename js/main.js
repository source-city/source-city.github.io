requirejs.config({
  baseUrl: 'js',
  urlArgs: 'ts=' + (new Date()).getTime(),
  shim: {
    'vendor/three': {
      exports: 'THREE'
    }//,
//    'vendor/underscore': {
//      exports: '_'
//    }
  }
});

require(['city-architect'], function (cityArchitect) {

  var data = [
    {
      label: 'com.bla.BlaBla',
      metrics: {
        loc: 100,
        dependencies: 7
      }
    }
  ];

  var city = cityArchitect.buildCity(data);
  document.body.appendChild(city);

});
