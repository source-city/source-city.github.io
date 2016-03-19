define(['vendor/three', 'vendor/underscore', 'city', 'vendor/TrackballControls'], function (THREE, _, City, TrackballControls) {

    return {
        buildCity : buildCity
    };

    function buildCity(data) {

        var camera, renderer;
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        var city = new City();

        _(layout(data)).each(function (b) {
            city.addBuilding(b);
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
              console.log('prev', prevSelected.material.color);
              prevSelected.material.color.setHex(0xcccccc);
              console.log('prev', prevSelected.material.color);
            }
            if (intersects.length > 0) {
                var selected = intersects[0].object;
                selected.material.color.setHex(0xb83a6b);
                console.log('next', selected.material.color);
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

    function layout(data) {

        var layoutElements = [];
        var point = {
            x : 0,
            y : 0
        };
        var directions = [left, up, right, down];
        var direction = left;
        var i;

        data = _(data).sortBy(function (b) {
            return -b.foundations * b.height;
        });
        for (i = 0; i < data.length; i++) {

            var b = data[i];
            _.extend(b, point);
            layoutElements.push(b);

            if (i < data.length - 1) {
                point = findNextValidPoint(i, i + 1);
                if (!point) {
                    break;
                }
            }


        }

        function findNextValidPoint(branch, i) {

            if (branch === 0 && i !== 1) {
                return false;
            }

            var n = data[i];
            var lastPlacedBuilding = data[branch];
            var lastPoint = {
                x : lastPlacedBuilding.x,
                y : lastPlacedBuilding.y
            };
            var delta = (lastPlacedBuilding.foundations / 2 + n.foundations / 2) * 1.6;

            var nextDirection = turnForward(direction);
            var prevDirection = turnBackward(direction);
            var sameDirection = direction;

            if (isValidLocationFor(n, nextDirection(lastPoint, delta))) {
                direction = nextDirection;
                return direction(lastPoint, delta);
            } else if (isValidLocationFor(n, sameDirection(lastPoint, delta))) {
                direction = sameDirection;
                return direction(lastPoint, delta);
            } else if (isValidLocationFor(n, prevDirection(lastPoint, delta))) {
                direction = prevDirection;
                return direction(lastPoint, delta);
            } else {
                direction = prevDirection;
                return findNextValidPoint(branch - 1, i);
            }
        }

        return layoutElements;

        function turnForward(direction) {
            return directions[(directions.indexOf(direction) + 1) % 4];
        }

        function turnBackward(direction) {
            return directions[(directions.indexOf(direction) + 3) % 4];
        }

        function left(p, delta) {
            return {
                x : p.x - delta,
                y : p.y
            };
        }

        function right(p, delta) {
            return {
                x : p.x + delta,
                y : p.y
            };
        }

        function up(p, delta) {
            return {
                x : p.x,
                y : p.y + delta
            };
        }

        function down(p, delta) {
            return {
                x : p.x,
                y : p.y - delta
            };
        }

        function isValidLocationFor(building, point) {

            return !_(layoutElements).find(colliding);

            function colliding(b) {
                var a = {
                    x : point.x,
                    y : point.y,
                    foundations : building.foundations
                };
                return _(cornersOf(b)).find(inside(a)) || _(cornersOf(a)).find(inside(b));
            }

            function cornersOf(b) {

                return [
                    {
                        x : b.x - b.foundations / 2,
                        y : b.y - b.foundations / 2
                    },
                    {
                        x : b.x - b.foundations / 2,
                        y : b.y + b.foundations / 2
                    },
                    {
                        x : b.x + b.foundations / 2,
                        y : b.y - b.foundations / 2
                    },
                    {
                        x : b.x + b.foundations / 2,
                        y : b.y + b.foundations / 2
                    }
                ];
            }

            function inside(a) {

                return function (point) {
                    return (point.x < a.x + a.foundations / 2 && point.x > a.x - a.foundations / 2) &&
                        (point.y < a.y + a.foundations / 2 && point.y > a.y - a.foundations / 2);
                };

            }
        }

    }

});
