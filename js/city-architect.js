define(['vendor/three', 'city'], function (THREE, City) {

  return {
    buildCity: buildCity
  };

  function buildCity(/*data*/) {

    var camera, renderer;

    var city = new City();
    city.addBuilding({
      x: 0,
      y: 0,
      foundations: 200,
      height: 400
    });
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    
    camera.position.z = 1000;
    camera.position.x = 500;
    camera.position.y = 500;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    animate();
    
    return renderer.domElement;

    function animate() {

      requestAnimationFrame(animate);
      renderer.render(city, camera);

    }
  }

});
