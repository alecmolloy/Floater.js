Floater.ThreeObject = function (floaterGeometry) {
    this.floaterGeometry = floaterGeometry;
    this.floaterObj = new THREE.Object3D();
    this.anchors = [];
    this.lines = new THREE.Object3D();
    this.relationships = new THREE.Object3D();

    this.lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0080ff
    });

    this.createAnchors();
    this.createLines();
    this.createConnectors();

    this.floaterObj.add(this.lines, this.relationships);
    scene.add(this.floaterObj);
};

Floater.ThreeObject.prototype.createAnchors = function () {
    for (var i = this.anchors.length; i < this.floaterGeometry.anchors.length; i++) {
        var anchor = new THREE.Vector3(0, 0, 0);
        this.anchors.push(anchor);
    }
}

Floater.ThreeObject.prototype.destroyAnchor = function (index) {
    index = index || this.anchors.length - 1;
    var destroyedAnchor = this.anchors.splice(index, 1)[0];
    this.checkLines(index);
    return destroyedAnchor;
}

Floater.ThreeObject.prototype.checkAnchors = function () {
    while (this.anchors.length !== this.floaterGeometry.anchors.length) {
        if (this.anchors.length > this.floaterGeometry.anchors.length) {
            this.destroyAnchor();
        } else if (this.anchors.length < this.floaterGeometry.anchors.length) {
            this.createAnchors();
        }
    }
}

Floater.ThreeObject.prototype.updateAnchorPositions = function () {
    for (var i = 0; i < this.floaterGeometry.anchors.length; i++) {
        for (var iDimension = 0; iDimension < 3; iDimension++) {
            var dimension = ['x', 'y', 'z'][iDimension];
            var dimensionValue = this.floaterGeometry.anchors[i].vector[dimension] + this.floaterGeometry.anchors[i].jitter[dimension];
            this.anchors[i][dimension] = dimensionValue;
        }
    }
}

Floater.ThreeObject.prototype.createLines = function () {
    for (var i = 0; i < this.floaterGeometry.lines.length; i++) {
        var lineGeometry = new THREE.Geometry();

        var anchor1Index = this.floaterGeometry.lines[i].anchor1.index;
        var anchor2Index = this.floaterGeometry.lines[i].anchor2.index;
        lineGeometry.vertices.push(this.anchors[anchor1Index]);
        lineGeometry.vertices.push(this.anchors[anchor2Index]);

        var lineMesh = new THREE.Line(lineGeometry, this.lineMaterial);
        this.lines.add(lineMesh);
    }
    this.updateLines();
}

Floater.ThreeObject.prototype.destroyLine = function (index) {
    index = index || this.lines.children.length;
    var destroyed = this.lines.children.splice(index,1);
    this.checkConnectors(index);
}

Floater.ThreeObject.prototype.checkLines = function (index) {
    for (var line = 0; line < this.floaterGeometry.lines.length; line++) {
        if (this.floaterGeometry.lines[line].anchor1.index === index) {
            this.destroyLine(line);
        }
    }
}

Floater.ThreeObject.prototype.updateLines = function () {
    for (var line = 0; line < this.lines.children.length; line++) { // Iterate through all lines
        this.lines.children[line].geometry.verticesNeedUpdate = true;
    }
}

Floater.ThreeObject.prototype.createConnectors = function () {
    for (var relationship = 0; relationship < this.floaterGeometry.relationships.length; relationship++) {
        // Create vectors for each segment point
        var segments = new THREE.Object3D();
        for (var connectorPoint = 0; connectorPoint < this.floaterGeometry.segments; connectorPoint++) {
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

Floater.ThreeObject.prototype.destroyConnectors = function () {
    for (var relationship = this.floaterGeometry.relationships.length; relationship < this.relationships.children.length; relationship++) {
        var popped = this.relationships.children.pop()[0];
    }
}

Floater.ThreeObject.prototype.checkConnectors = function (index) {
    for (var relationship = this.floaterGeometry.relationships.length; relationship < this.relationships.children.length; relationship++) {
        console.log(this.floaterGeometry.relationships[i]);
    }
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
