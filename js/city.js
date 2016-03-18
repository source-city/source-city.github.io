define(['vendor/three'], function (THREE) {


  return city;

  function city() {

    var scene = new THREE.Scene();

    scene.addBuilding = function (building) {
      
      var geometry, material, mesh;
      
      geometry = new THREE.BoxGeometry(building.foundations, building.height, building.foundations);
      material = new THREE.MeshLambertMaterial({
        color: 0xff0000
      });

      mesh = new THREE.Mesh(geometry, material);
      mesh.receiveShadow = true;
      scene.add(mesh);
    };

    return scene;
  }


});
