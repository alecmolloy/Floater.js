/*global THREE, THREEx, Floater */
/*jslint browser: true, devel: true, passfail: false, eqeq: false, plusplus: true, sloppy: true, vars: true*/

var camera, scene, renderer, windowResize;
var canvasWidth, canvasHeight, canvasRatio, dpr;
var originX, originY;
var cameraControls, effectController;
var clock = new THREE.Clock();
var floater;
var threeObject;
var planeMesh;

function fillScene() {
    scene = new THREE.Scene();

//    floater = new Floater({
//        fieldWidth: canvasWidth,
//        fieldHeight: canvasHeight,
//        anchors: 3,
//        linesBetween:           [   '01',  '12' ],
//        segments:               [   10          ],
//        relationshipsBetween:   [   '01'        ]
//    })

    floater = new Floater({
        anchors: 4,
        fieldHeight: canvasHeight,
        fieldWidth: canvasWidth,
        linesBetween: ['01', '12', '23', '30'],
        segments: [100, 100, 100, 100],
        relationshipsBetween: ['01', '12', '23', '30']
    });

    threeObject = new Floater.ThreeObject(floater);

    // Lights
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

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
    dpr = window.devicePixelRatio || 1;

    originX = -canvasWidth / 2;
    originY = -canvasHeight / 2;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setPixelRatio(dpr);
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

function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera);
}

function animate() {
    window.requestAnimationFrame(animate);
    floater.animateAnchors(floater);
    threeObject.updateLines(threeObject);
    threeObject.updateConnectors(threeObject);
    render();
}


window.onload = function () {
    init();
    fillScene();
    addToDOM();
    animate();
};
