define(['vendor/three'], function (THREE) {


  return city;

  function city() {

    var scene = new THREE.Scene();

    var geometry, material;

    geometry = new THREE.BoxGeometry(2000, 10, 2000);
    material = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });

    var floor = new THREE.Mesh(geometry, material);
    floor.receiveShadow = true;
    floor.translateY(-10);
    scene.add(floor);

    scene.addBuilding = function (building) {

      var geometry, material, mesh;

      geometry = new THREE.BoxGeometry(building.foundations, building.height, building.foundations);
      material = new THREE.MeshLambertMaterial({
        color: 0xff0000
      });

      mesh = new THREE.Mesh(geometry, material);
      mesh.receiveShadow = true;
      mesh.translateY(building.height / 2);
      mesh.translateX(building.x);
      mesh.translateZ(building.y);
      scene.add(mesh);
    };

    return scene;
  }


});
