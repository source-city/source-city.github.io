define(['vendor/three'], function (THREE) {


  return city;

  function city() {

    var scene = new THREE.Scene();

    scene.addBuilding = function (building) {
      
      var geometry, material, mesh;
      
      geometry = new THREE.BoxGeometry(building.foundations, building.height, building.foundations);
      material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    return scene;
  }


});
