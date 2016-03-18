define(['vendor/three', 'vendor/underscore', 'city'], function (THREE, _, City) {

  return {
    buildCity: buildCity
  };

  function buildCity(data) {

    var camera, renderer;

    var city = new City();
    _(layout(data)).each(function(b){
      city.addBuilding(b);
    });

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

    camera.position.z = 1000;
    camera.position.x = 500;
    camera.position.y = 1000;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0xf5f5f5 );

    var light = new THREE.AmbientLight(0x404040); // soft white light
    light.castShadow = true;
    city.add(light);

    var sun = new THREE.DirectionalLight( 0xffffff, 1.2 );
    sun.castShadow = true;
    sun.position.set( 1, 2, 3 );
    city.add(sun);

    animate();

    return renderer.domElement;

    function animate() {

      requestAnimationFrame(animate);
      renderer.render(city, camera);

    }
  }
  
  function layout(data){
    
    var layout = [];
    var point = {x: 0, y: 0};
    var directions = [left, up, right, down];
    var direction = left;
    var i = 0;
    
    data = _(data).sortBy(function(b){ return -b.foundations * b.height; });
    for(i=0; i<data.length; i++){

      b = data[i];
      _.extend(b, point);
      layout.push(b);

      if(i < data.length - 1){
        point = findNextValidPoint(i, i + 1);
      }
      
      function findNextValidPoint(branch, i){
        var n = data[i];

        var delta = (data[branch].foundations/2 + n.foundations/2) * 1.6;

        var nextDirection = turnForward(direction);
        var prevDirection = turnBackward(direction);
        var sameDirection = direction;

        if(isValidLocationFor(n, nextDirection(point, delta))){
          direction = nextDirection;
          return direction(point, delta);
        } else if(isValidLocationFor(n, sameDirection(point, delta))){
          direction = sameDirection;
          return direction(point, delta);
        } else if(isValidLocationFor(n, prevDirection(point, delta))){
          direction = prevDirection;
          return direction(point, delta);
        } else {
          return findNextValidPoint(branch-1, i);
        }
      }
    }
    
    return layout;
    
    function turnForward(direction){
      return directions[(directions.indexOf(direction) + 1) % 4];
    }
    function turnBackward(direction){
      return directions[(directions.indexOf(direction) + 3) % 4];
    }
    
    function left(p, delta){
      return {x : p.x - delta, y: p.y};
    }
    function right(p, delta){
      return {x : p.x + delta, y: p.y};
    }
    function up(p, delta){
      return {x : p.x, y: p.y + delta};
    }
    function down(p, delta){
      return {x : p.x, y: p.y - delta};
    }
    
    function isValidLocationFor(building, point){
      
      return !_(layout).find(colliding);
      
      function colliding(b){
        var a = {x: point.x, y: point.y, foundations: building.foundations};
        return _(cornersOf(b)).find(inside(a)) || _(cornersOf(a)).find(inside(b));
      }

      function cornersOf(b){
        return [
          { x: b.x - b.foundations/2, y: b.y - b.foundations/2},
          { x: b.x - b.foundations/2, y: b.y + b.foundations/2},
          { x: b.x + b.foundations/2, y: b.y - b.foundations/2},
          { x: b.x + b.foundations/2, y: b.y + b.foundations/2}
        ];
      }
      
      function inside(a){
        
        return function(point){
          return (point.x < a.x + a.foundations/2 && point.x > a.x - a.foundations/2) &&
                (point.y < a.y + a.foundations/2 && point.y > a.y - a.foundations/2);
        }
        
      }
    }
    
  }

});
