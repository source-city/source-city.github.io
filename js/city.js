define(['vendor/three', 'vendor/underscore'], function (THREE, _) {


  return city;

  function city() {

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 1000, 5000);
    var buildings = [];

    function addBuilding(building) {

      var geometry, material, mesh;

      geometry = new THREE.BoxGeometry(building.foundations, building.height, building.foundations);
      material = new THREE.MeshLambertMaterial({
        color: 0xcccccc
      });

      mesh = new THREE.Mesh(geometry, material);
      mesh.receiveShadow = true;
      mesh.translateY(building.height / 2);
      mesh.translateX(building.x);
      mesh.translateZ(building.y);
      mesh.building = building;
      buildings.push(mesh);
      scene.add(mesh);
      
    }
    
    function addFloor() {
      
        var maxValue = _(buildings).max(max);
      
        function max(b){
          return Math.max(Math.abs(b.building.x), Math.abs(b.building.y)) + b.building.foundations/2;
        }
      
        var geometry, material;
      
        geometry = new THREE.BoxGeometry(max(maxValue)*2.4, 10, max(maxValue)*2.4);
        material = new THREE.MeshLambertMaterial({
          color: 0xcccccc
        });

        var floor = new THREE.Mesh(geometry, material);
        floor.receiveShadow = true;
        floor.translateY(-10);
        scene.add(floor);
    }

    return {
      scene : scene,
      addFloor : addFloor,
      addBuilding : addBuilding,
      buildings : buildings
    };
  }


});
