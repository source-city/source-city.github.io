define(['vendor/three', 'vendor/underscore', 'city', 'vendor/TrackballControls'], function (THREE, _, City, TrackballControls) {

    return {
        buildCity : buildCity
    };

    function buildCity(buildings) {

        var camera, renderer;
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        var city = new City();

        _(layout(buildings)).each(function (building) {
            city.addBuilding(building);
        });
        var floor = city.addFloor();
        $('#viewer-progress-bar').addClass('hide');
        $('#city-viewer').removeClass('hide');

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 0;
        camera.position.x = floor.size * 0.8;
        camera.position.y = floor.size / 3;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        var container = document.createElement('div');

        renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xf0f0ff);
        var light = new THREE.AmbientLight(0x404040); // soft white light
        light.castShadow = true;
        city.scene.add(light);
        var sun = new THREE.DirectionalLight(0xffffff, 1.0);
        sun.castShadow = true;
        sun.position.set(1, 2, 3);
        city.scene.add(sun);

        var controls = createControls();
        var prevSelected;

        animate();

        container.appendChild(renderer.domElement);

        renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);

        return container;

        function animate() {

            requestAnimationFrame(animate);
            controls.update();
            render();
        }

        function render() {
            camera.up = new THREE.Vector3(0, 1, 0);
            renderer.render(city.scene, camera);
        }

        function onDocumentMouseMove(event) {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            //
            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(city.buildings);
            var newLegend = '';

            if (prevSelected) {
              prevSelected.material.color.setHex(0xcccccc);
            }
            if (intersects.length > 0) {
                var selected = intersects[0].object;
                selected.material.color.setHex(0xb83a6b);
                newLegend = selected.building.label;
                prevSelected = selected;
            }
            document.getElementById('legend').innerHTML = newLegend;
        }

        function createControls() {
            var controls = new TrackballControls(camera);
            controls.rotateSpeed = 2.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.noZoom = false;
            controls.noPan = false;
            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;
            controls.keys = [65, 83, 68];
            controls.addEventListener('change', render);
            return controls;
        }

    }

    function layout(buildings) {
        if (buildings.length < 1) {
            return;
        }
        var layoutBuildings = [];
        buildings = _(buildings).sortBy(function (building) {
            return -building.foundations * building.height * building.height;
        });

        var directions = [moveLeft, moveUp, moveRight, moveDown];

        var moveInCurrentDirection = moveLeft;
        var currentRectangle = square(newPoint(0, 0), buildings[0].foundations);

        for (var buildingIndex = 0; buildingIndex < buildings.length; buildingIndex++) {
            var currentBuilding = buildings[buildingIndex];
            _.extend(currentBuilding, currentRectangle);
            layoutBuildings.push(currentBuilding);
            if (buildingIndex < buildings.length - 1) {
                currentRectangle = findValidRectangleFor(buildingIndex, buildingIndex + 1);
            }
        }

        return layoutBuildings;

        function newPoint(x, y) {
            return {
                x: x,
                y: y
            };
        }

        function square(center, length) {
            var halfLength = length / 2;
            return {
                x: center.x,
                y: center.y,
                leftTop: newPoint(center.x - halfLength, center.y - halfLength),
                rightBottom: newPoint(center.x + halfLength, center.y + halfLength)
            };
        }

        function findValidRectangleFor(branch, index) {

            var currentlyPlacedBuilding = buildings[index];
            var lastPlacedBuilding = buildings[branch];
            var pointOfLastPlacedBuilding = newPoint(lastPlacedBuilding.x, lastPlacedBuilding.y);
            var distance = (lastPlacedBuilding.foundations / 2 + currentlyPlacedBuilding.foundations / 2) * 1.6;

            var moveInNextDirection = turnClockwise(moveInCurrentDirection);
            var moveInPreviousDirection = turnCounterclockwise(moveInCurrentDirection);
            var moveInSameDirection = moveInCurrentDirection;
            var rectangleCandidate;
            if (isValid(rectangleCandidate = moveInNextDirection(currentlyPlacedBuilding, pointOfLastPlacedBuilding, distance))) {
                moveInCurrentDirection = moveInNextDirection;
                return rectangleCandidate;
            } else if (isValid(rectangleCandidate = moveInSameDirection(currentlyPlacedBuilding, pointOfLastPlacedBuilding, distance))) {
                moveInCurrentDirection = moveInSameDirection;
                return rectangleCandidate;
            } else if (isValid(rectangleCandidate = moveInPreviousDirection(currentlyPlacedBuilding, pointOfLastPlacedBuilding, distance))) {
                moveInCurrentDirection = moveInPreviousDirection;
                return rectangleCandidate;
            } else {
                moveInCurrentDirection = moveInPreviousDirection;
                return findValidRectangleFor(branch - 1, index);
            }
        }

        function turnClockwise(direction) {
            return directions[(directions.indexOf(direction) + 1) % 4];
        }

        function turnCounterclockwise(direction) {
            return directions[(directions.indexOf(direction) + 3) % 4];
        }

        function moveLeft(building, point, distance) {
            return square(movePointLeft(point, distance), building.foundations);
        }

        function moveRight(building, point, distance) {
            return square(movePointRight(point, distance), building.foundations);
        }

        function moveUp(building, point, distance) {
            return square(movePointUp(point, distance), building.foundations);
        }

        function moveDown(building, point, distance) {
            return square(movePointDown(point, distance), building.foundations);
        }

        function movePointLeft(point, distance) {
            return newPoint(point.x - distance, point.y);
        }

        function movePointRight(point, distance) {
            return newPoint(point.x + distance, point.y);
        }

        function movePointUp(point, distance) {
            return newPoint(point.x, point.y + distance);
        }

        function movePointDown(point, distance) {
            return newPoint(point.x, point.y - distance);
        }

        function isValid(rectangle) {

            return !_(layoutBuildings).find(intersecting);

            function intersecting(layoutBuilding) {
                return intersects(rectangle, layoutBuilding);
            }

            function intersects(left, right) {
                return (left.rightBottom.x > right.leftTop.x) && (right.rightBottom.x > left.leftTop.x) &&
                (left.rightBottom.y > right.leftTop.y) && (right.rightBottom.y > left.leftTop.y);
            }
        }
    }

});
