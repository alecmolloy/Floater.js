Floater.ThreeObject = function (floaterGeometry) {
    this.floaterGeometry = floaterGeometry;
    this.floaterObj = new THREE.Object3D();
    this.lines = new THREE.Object3D();
    this.relationships = new THREE.Object3D();


    this.lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0080ff
    });

    this.createLines(this);
    this.createConnectors(this);

    this.floaterObj.add(this.lines, this.relationships);
    scene.add(this.floaterObj);
};

Floater.ThreeObject.prototype.createLines = function (self) {
    for (i = 0; i < self.floaterGeometry.lines.length; i++) {
        var lineGeometry = new THREE.Geometry();

        var anchor1 = new THREE.Vector3(0, 0, 0);
        var anchor2 = new THREE.Vector3(0, 0, 0);
        lineGeometry.vertices.push(anchor1);
        lineGeometry.vertices.push(anchor2);

        var lineMesh = new THREE.Line(lineGeometry, self.lineMaterial);
        self.lines.add(lineMesh);
    }
    self.updateLines(self);
}

Floater.ThreeObject.prototype.updateLines = function (self) {
    for (i = 0; i < self.floaterGeometry.lines.length; i++) { // Iterate through all lines
        for (j = 1; j <= 2; j++) { // Iterate through all vertices
            var currentAnchor = 'anchor' + j;

            // Create vectors for anchor
            var anchorX = originX + self.floaterGeometry.lines[i][currentAnchor].x;
            var anchorY = originY + self.floaterGeometry.lines[i][currentAnchor].y;

            // Fill in new values
            self.lines.children[i].geometry.vertices[j - 1].x = anchorX;
            self.lines.children[i].geometry.vertices[j - 1].z = anchorY;
        }
        self.lines.children[i].geometry.verticesNeedUpdate = true;
    }
}

Floater.ThreeObject.prototype.microphoneInput = function (self, dataArray) {
    for (i = 0; i < self.floaterGeometry.lines.length; i++) { // Iterate through all lines
        for (j = 1; j <= 2; j++) { // Iterate through all vertices
            self.lines.children[i].geometry.vertices[j - 1].y = dataArray[i * 2];
        }
    }
}


Floater.ThreeObject.prototype.createConnectors = function (self) {
    for (i = 0; i < self.floaterGeometry.relationships.length; i++) {
        // Create vectors for each segment point
        var segments = new THREE.Object3D();
        for (j = 0; j < self.floaterGeometry.relationships[i].line1.connectorPoints.length; j++) {
            var connector1 = new THREE.Vector3(0, 0, 0);
            var connector2 = new THREE.Vector3(0, 0, 0);

            // Create a geometry and add the two created vertices
            var connectorGeometry = new THREE.Geometry();
            connectorGeometry.vertices.push(connector1);
            connectorGeometry.vertices.push(connector2);

            // Create a mesh out of the geometry and standard line material
            var connectorMesh = new THREE.Line(connectorGeometry, self.lineMaterial);

            // Add the connector to the scene
            segments.add(connectorMesh);
        }
        self.relationships.add(segments);
    }
    self.updateConnectors(self);
}

Floater.ThreeObject.prototype.updateConnectors = function (self) {
    for (i = 0; i < self.floaterGeometry.relationships.length; i++) {
        for (j = 0; j < self.floaterGeometry.relationships[i].line1.connectorPoints.length; j++) {
            // Access the line's connector point coördinates and store them
            var connector1X = originX + self.floaterGeometry.relationships[i].line1.connectorPoints[j].x;
            var connector1Y = originY + self.floaterGeometry.relationships[i].line1.connectorPoints[j].y;
            var connector2X = originX + self.floaterGeometry.relationships[i].line2.connectorPoints[j].x;
            var connector2Y = originY + self.floaterGeometry.relationships[i].line2.connectorPoints[j].y;

            // Fill in new values
            self.relationships.children[i].children[j].geometry.vertices[0].x = connector1X;
            self.relationships.children[i].children[j].geometry.vertices[0].z = connector1Y;
            self.relationships.children[i].children[j].geometry.vertices[1].x = connector2X;
            self.relationships.children[i].children[j].geometry.vertices[1].z = connector2Y;
            self.relationships.children[i].children[j].geometry.verticesNeedUpdate = true;
        }
    }
}
