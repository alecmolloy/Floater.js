/*global THREE, THREEx, Floater */
/*jslint browser: true, devel: true, passfail: false, eqeq: false, plusplus: true, sloppy: true, vars: true*/

var camera, scene, renderer, windowResize;
var canvasWidth, canvasHeight, canvasRatio, dpr;
var originX, originY;
var cameraControls, effectController;
var clock = new THREE.Clock();
var floater;
var lines = [],
    connectors = [],
    planeMesh;
var i, j;

// Create the field of points


function fillScene() {
    scene = new THREE.Scene();


    // Makes a square, four anchor points with four lines
    floater = new Floater({
        fieldWidth: canvasWidth,
        fieldHeight: canvasHeight,
        anchors: 4,
        linesBetween:           [   '01',  '12',   '23',   '30' ],
        segments:               [   100,   100,    100,    100  ],
        relationshipsBetween:   [   '01',  '12',   '23',   '30' ]
    })


    /*
    // Makes an incomplete triangle, three anchor points with two lines
    floater = new Floater({
        fieldWidth: canvasWidth,
        fieldHeight: canvasHeight,
        anchors: 3,
        linesBetween:           [   '01',  '12' ],
        segments:               [   25          ],
        relationshipsBetween:   [   '01'        ]
    })
    */

    floater.relationshipArray.forEach(function () {
        connectors.push([]);
    });

    // Lights
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0080ff
    });

    // Draw Lines
    for (i = 0; i < floater.lineArray.length; i++) {
        var lineGeometry = new THREE.Geometry();

        // Create vectors for points 1 and 2
        var anchor1X = originX + floater.lineArray[i].anchor1.x;
        var anchor1Y = originY + floater.lineArray[i].anchor1.y;
        var anchor1 = new THREE.Vector3(anchor1X, 0, anchor1Y);
        var anchor2X = originX + floater.lineArray[i].anchor2.x;
        var anchor2Y = originY + floater.lineArray[i].anchor2.y;
        var anchor2 = new THREE.Vector3(anchor2X, 0, anchor2Y);

        lineGeometry.vertices.push(anchor1);
        lineGeometry.vertices.push(anchor2);

        var lineMesh = new THREE.Line(lineGeometry, lineMaterial);
        lines.push(lineMesh);
        scene.add(lines[i]);
    }


    // Draw connectors
    for (i = 0; i < floater.relationshipArray.length; i++) {
        console.log('drawing connector' + i);
        // Create vectors for each segment point
        for (j = 0; j < floater.relationshipArray[i].line1.connectorPoints.length; j++) {
            // Access line 1's connector point coördinates and store them in a vertice
            var connectorX1 = originX + floater.relationshipArray[i].line1.connectorPoints[j].x;
            var connectorY1 = originY + floater.relationshipArray[i].line1.connectorPoints[j].y;
            var connector1 = new THREE.Vector3(connectorX1, 0, connectorY1);

            // Access line 2's connector point coördinates and store them in a vertice
            var connectorX2 = originX + floater.relationshipArray[i].line2.connectorPoints[j].x;
            var connectorY2 = originY + floater.relationshipArray[i].line2.connectorPoints[j].y;
            var connector2 = new THREE.Vector3(connectorX2, 0, connectorY2);

            // Create a geometry and add the two created vertices
            var connectorGeometry = new THREE.Geometry();
            connectorGeometry.vertices.push(connector1);
            connectorGeometry.vertices.push(connector2);

            // Create a mesh out of the geometry and standard line material
            var connectorMesh = new THREE.Line(connectorGeometry, lineMaterial);

            // Add the mesh to the connectors array
            connectors[i].push(connectorMesh);

            // Add the connector it to the scene, times the index by 1 + i because we are pushing in values to the arry in a nested loop
            scene.add(connectors[i][j]);
        }
    }

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
    render();
}


window.onload = function () {
    init();
    fillScene();
    addToDOM();
    animate();
};
