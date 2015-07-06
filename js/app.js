/*global THREE, THREEx, Floater */
/*jslint browser: true, devel: true, passfail: false, eqeq: false, plusplus: true, sloppy: true, vars: true*/

var camera, scene, renderer, windowResize;
var canvasWidth, canvasHeight, canvasRatio, dpr;
var cameraControls, effectController;
var clock = new THREE.Clock();
var floater;
var sound;
var threeObject;
var planeMesh;

function fillScene() {
    scene = new THREE.Scene();

//    floater = new Floater({
//        anchors: 4,
//        fieldHeight: canvasHeight,
//        fieldWidth: canvasWidth,
//        walls: true,
//        linesBetween: ['01', '12', '23', '30'],
//        segments: 70,
//        relationshipsBetween: ['01', '12', '23', '30']
//    });
    floater = new Floater({
        anchors: 8,
        dimensions: 3,
        fieldHeight: canvasHeight,
        fieldWidth: canvasWidth,
        linesBetween: ['01', '12', '23', '30', '45', '56', '67'],
        segments: 70,
        relationshipsBetween: ['01', '12', '23', '30', '45', '56', '46']
    });

    threeObject = new Floater.ThreeObject(floater);

    // Lights
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
}

function init() {
    // Renderer sizing
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvasRatio = canvasWidth / canvasHeight;
    dpr = window.devicePixelRatio || 1;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setPixelRatio(dpr);
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0xf7c2d9, 1);

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera(30, canvasRatio, 1, 1000000);
    camera.position.set(0, 0, 1500);

    // Orbit and Pan controls
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

    var windowResize = THREEx.WindowResize(renderer, camera);

    // Sound
    sound = new SoundVisualiser({source : 'microphone'});
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
    floater.microphoneJitter(floater, sound.getData());
    floater.animateAnchors(floater);
    threeObject.updateLines(threeObject);
    threeObject.updateConnectors(threeObject);
    threeObject.floaterObj.rotation.z = clock.elapsedTime / 10;
    render();
}


window.onload = function () {
    init();
    fillScene();
    addToDOM();
    animate();
};

