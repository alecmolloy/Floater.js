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
var gui, params;

function fillScene() {
    scene = new THREE.Scene();

    //    floater = new Floater({
    //        anchors: 3,
    //        fieldHeight: canvasHeight,
    //        fieldWidth: canvasWidth,
    //        linesBetween: ['01', '12'],
    //        segments: 10,
    //        speed: .5,
    //        relationshipsBetween: ['01']
    //    });
    //    floater = new Floater({
    //        anchors: 8,
    //        dimensions: 3,
    //        fieldHeight: canvasHeight,
    //        fieldWidth: canvasWidth,
    //        linesBetween: ['01', '12', '23', '30', '45', '56', '67'],
    //        segments: 40,
    //        relationshipsBetween: ['01', '12', '23', '30', '45', '56', '46']
    //    });
    floater = new Floater({
        anchors: 4,
        dimensions: 3,
        fieldHeight: canvasHeight,
        fieldWidth: canvasWidth,
        linesBetween: ['01', '23'],
        segments: 40,
        relationshipsBetween: ['01']
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
    renderer.setClearColor(0xfcdeeb, 1);
    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera(30, canvasRatio, 1, 1000000);
    camera.position.set(0, 0, 1500);

    // Orbit and Pan controls
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

    var windowResize = THREEx.WindowResize(renderer, camera);

    // Sound
    sound = new SoundVisualiser({
        source: 'microphone',
        smoothingTimeConstant: .87,
        minDecibels: -90
    });

}

function setupStats() {
    // GUI
    params = {
        anchors: floater.anchors.length,
        segments: floater.segments,
    };
    var gui = new dat.GUI({
        height: 5 * 32 - 1
    });
    gui.add(params, 'anchors')
        .min(1)
        .max(50)
        .step(1)
        .onFinishChange(function () {
            console.log(floater);
            var checkFloaterAnchors = floater.checkAnchors.bind(floater);
            var auditThreeAnchors = threeObject.auditFloater.bind(threeObject);
            checkFloaterAnchors(params.anchors);
            auditThreeAnchors();
        }); // check if i need to remove or add anchors
    gui.add(params, 'segments')
        .min(0)
        .onFinishChange(function () {
            floater.segments = params.segments;
        }); // check if the number of segments needs to be changed

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
    floater.microphoneJitter(floater, sound.getData(sound));
    floater.animateAnchors(floater);
    threeObject.updateAnchorPositions(threeObject);
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
    setupStats();
};
