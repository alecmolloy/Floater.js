Floater.ThreeObject = function (floaterGeometry) {
    this.floaterGeometry = floaterGeometry;
    this.floaterObj = new THREE.Object3D();
    this.anchors = [];
    this.lines = new THREE.Object3D();
    this.relationships = new THREE.Object3D();


    this.lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0080ff
    });

    this.createAnchors(this);
    this.createLines(this);
    this.createConnectors(this);

    this.floaterObj.add(this.lines, this.relationships);
    scene.add(this.floaterObj);
};

Floater.ThreeObject.prototype.createAnchors = function (self) {
    for (var i = 0; i < self.floaterGeometry.anchors.length; i++) {
        var anchor = new THREE.Vector3(0, 0, 0);
        self.anchors.push(anchor);
    }
}

Floater.ThreeObject.prototype.updateAnchors = function (self) {
    for (var i = 0; i < self.anchors.length; i++) {
        for (var iDimension = 0; iDimension < 3; iDimension++) {
            var dimension = ['x', 'y', 'z'][iDimension];
            var dimensionValue = self.floaterGeometry.anchors[i].vector[dimension] + self.floaterGeometry.anchors[i].jitter[dimension];
            self.anchors[i][dimension] = dimensionValue;
        }
    }
    // TODO: Make sure vertices get updated
}

Floater.ThreeObject.prototype.createLines = function (self) {
    for (var i = 0; i < self.floaterGeometry.lines.length; i++) {
        var lineGeometry = new THREE.Geometry();

        var anchor1Index = self.floaterGeometry.lines[i].anchor1.index;
        var anchor2Index = self.floaterGeometry.lines[i].anchor2.index;
        lineGeometry.vertices.push(self.anchors[anchor1Index]);
        lineGeometry.vertices.push(self.anchors[anchor2Index]);

        var lineMesh = new THREE.Line(lineGeometry, self.lineMaterial);
        self.lines.add(lineMesh);
    }
        self.updateLines(self);
}

Floater.ThreeObject.prototype.updateLines = function (self) {
    for (var line = 0; line < self.floaterGeometry.lines.length; line++) { // Iterate through all lines
        self.lines.children[line].geometry.verticesNeedUpdate = true;
    }
}

Floater.ThreeObject.prototype.createConnectors = function (self) {
    for (var relationship = 0; relationship < self.floaterGeometry.relationships.length; relationship++) {
        // Create vectors for each segment point
        var segments = new THREE.Object3D();
        for (var connectorPoint = 0; connectorPoint < self.floaterGeometry.relationships[relationship].line1.connectorPoints.length; connectorPoint++) {
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
    for (relationship = 0; relationship < self.floaterGeometry.relationships.length; relationship++) {
        for (connector = 0; connector < self.floaterGeometry.segments; connector++) {
            var connectorPoint1 = self.floaterGeometry.relationships[relationship].line1.connectorPoints[connector];
            var connectorPoint2 = self.floaterGeometry.relationships[relationship].line2.connectorPoints[connector];
            for (var iDimension = 0; iDimension < 3; iDimension++) {
                var dimension = ['x', 'y', 'z'][iDimension];
                self.relationships.children[relationship].children[connector].geometry.vertices[0][dimension] = connectorPoint1[dimension];
                self.relationships.children[relationship].children[connector].geometry.vertices[1][dimension] = connectorPoint2[dimension];
            }
            self.relationships.children[relationship].children[connector].geometry.verticesNeedUpdate = true;
        }
    }
}
