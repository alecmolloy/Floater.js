/*global THREE, Coordinates, document, window*/

var camera, scene, renderer, windowResize;
var canvasWidth, canvasHeight, canvasRatio;
var cameraControls, effectController;
var clock = new THREE.Clock();
var anchorA, anchorB, anchorC;
var points = [];
var lineMesh, planeMesh;

// Create the field of points
function generateField() {
    // Initialise points
    anchorA = new THREE.Vector3(Math.random() * canvasWidth - (canvasWidth / 2), 0, Math.random() * canvasHeight - (canvasHeight / 2));
    anchorB = new THREE.Vector3(Math.random() * canvasWidth - (canvasWidth / 2), 0, Math.random() * canvasHeight - (canvasHeight / 2));
    anchorC = new THREE.Vector3(Math.random() * canvasWidth - (canvasWidth / 2), 0, Math.random() * canvasHeight - (canvasHeight / 2));
}

function fillScene() {
    scene = new THREE.Scene();

    // Lights
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Line
    var lineGeometry = new THREE.Geometry();
    generateField();
    lineGeometry.vertices.push(anchorA);
    lineGeometry.vertices.push(anchorB);
    lineGeometry.vertices.push(anchorC);

    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0080ff
    });

    lineMesh = new THREE.Line(lineGeometry, lineMaterial);

    scene.add(lineMesh);

    console.log(lineMesh);

    // Screen
    var planeGeometry = new THREE.PlaneBufferGeometry(canvasWidth, canvasHeight);

    var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xf7c2d9,
        side: THREE.DoubleSide
    });

    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    planeMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    planeMesh.translateZ(5);

    scene.add(planeMesh);
}

function init() {
    // Renderer sizing
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvasRatio = canvasWidth / canvasHeight;
    dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setPixelRatio(dpr)
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(dpr)
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0xffffff, 1);

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera(30, canvasRatio, 1, 1000000);
    camera.position.set(0, 1500, 0);

    // Orbit and Pan controls
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

    var windowResize = THREEx.WindowResize(renderer, camera);
}

function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}

function animate() {
    window.requestAnimationFrame(animate);

    // Move points
    lineMesh.geometry.verticesNeedUpdate = true;
    lineMesh.geometry.vertices.forEach(function (vertice) {
        vertice.y = Math.sin(clock.elapsedTime) * 10 + 10;
        vertice.x += Math.sin(clock.elapsedTime/2) / 10;
        vertice.z += Math.sin(clock.elapsedTime/2) / 10;
    });

    render();
}

function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera);
}


window.onload = function () {
    init();
    fillScene();
    addToDOM();
    animate();
};
