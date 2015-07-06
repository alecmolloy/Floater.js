Floater.ThreeObject = function (floaterGeometry) {
    this.floaterGeometry = floaterGeometry;
    this.floaterObj = new THREE.Object3D();
    this.lines = new THREE.Object3D();
    this.relationships = new THREE.Object3D();


    this.lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0080ff
    });

    this.createLines();
    this.createConnectors();

    this.floaterObj.add(this.lines, this.relationships);
    scene.add(this.floaterObj);
};

Floater.ThreeObject.prototype.createLines = function () {
    for (i = 0; i < this.floaterGeometry.lines.length; i++) {
        var lineGeometry = new THREE.Geometry();

        var anchor1 = new THREE.Vector3(0, 0, 0);
        var anchor2 = new THREE.Vector3(0, 0, 0);
        lineGeometry.vertices.push(anchor1);
        lineGeometry.vertices.push(anchor2);

        var lineMesh = new THREE.Line(lineGeometry, this.lineMaterial);
        this.lines.add(lineMesh);
    }
    this.updateLines();
}

Floater.ThreeObject.prototype.updateLines = function () {
    for (var line = 0; line < this.floaterGeometry.lines.length; line++) { // Iterate through all lines
        for (var vertice = 1; vertice <= 2; vertice++) { // Iterate through all vertices
            var anchor = 'anchor' + vertice;
            var currentAnchor = this.floaterGeometry.lines[line][anchor];
            for (var iDimension = 0; iDimension < 3; iDimension++) {
                var dimension = ['x', 'y', 'z'][iDimension];
                var dimensionValue = currentAnchor.vector[dimension] + currentAnchor.jitter[dimension];
                this.lines.children[line].geometry.vertices[vertice - 1][dimension] = dimensionValue;
            }
        }
        this.lines.children[line].geometry.verticesNeedUpdate = true;
    }
}

Floater.ThreeObject.prototype.createConnectors = function () {
    for (var relationship = 0; relationship < this.floaterGeometry.relationships.length; relationship++) {
        // Create vectors for each segment point
        var segments = new THREE.Object3D();
        for (var connectorPoint = 0; connectorPoint < this.floaterGeometry.relationships[relationship].line1.connectorPoints.length; connectorPoint++) {
            var connector1 = new THREE.Vector3(0, 0, 0);
            var connector2 = new THREE.Vector3(0, 0, 0);

            // Create a geometry and add the two created vertices
            var connectorGeometry = new THREE.Geometry();
            connectorGeometry.vertices.push(connector1);
            connectorGeometry.vertices.push(connector2);

            // Create a mesh out of the geometry and standard line material
            var connectorMesh = new THREE.Line(connectorGeometry, this.lineMaterial);

            // Add the connector to the scene
            segments.add(connectorMesh);
        }
        this.relationships.add(segments);
    }
    this.updateConnectors();
}

Floater.ThreeObject.prototype.updateConnectors = function () {
    for (relationship = 0; relationship < this.floaterGeometry.relationships.length; relationship++) {
        for (connector = 0; connector < this.floaterGeometry.segments; connector++) {
            var connectorPoint1 = this.floaterGeometry.relationships[relationship].line1.connectorPoints[connector];
            var connectorPoint2 = this.floaterGeometry.relationships[relationship].line2.connectorPoints[connector];
            for (var iDimension = 0; iDimension < 3; iDimension++) {
                var dimension = ['x', 'y', 'z'][iDimension];
                this.relationships.children[relationship].children[connector].geometry.vertices[0][dimension] = connectorPoint1[dimension];
                this.relationships.children[relationship].children[connector].geometry.vertices[1][dimension] = connectorPoint2[dimension];
            }
            this.relationships.children[relationship].children[connector].geometry.verticesNeedUpdate = true;
        }
    }
}
