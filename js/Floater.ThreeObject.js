Floater.ThreeObject = function (floaterGeometry) {
    this.floaterGeometry = floaterGeometry;
    this.floaterObj = new THREE.Object3D();
    this.anchors = [];
    this.lines = new THREE.Object3D();
    this.relationships = new THREE.Object3D();

    this.lineMaterial = new THREE.LineBasicMaterial({
        //        color: 0x0080ff
        color: 0xffffff
    });

    this.createAnchors();
    this.createLines();
    this.createConnectors();

    this.floaterObj.add(this.lines, this.relationships);
    scene.add(this.floaterObj);
};

Floater.ThreeObject.prototype.auditFloater = function () {
    var anchors = this.auditAnchors();
    var lines = this.auditLines(anchors);
    var connectors = this.auditConnectors(lines);
    console.log(anchors);
    console.log(lines);
    console.log(connectors);
}

Floater.ThreeObject.prototype.createAnchors = function () {
    for (var i = this.anchors.length; i < this.floaterGeometry.anchors.length; i++) {
        var anchor = new THREE.Vector3(0, 0, 0);
        this.anchors.push(anchor);
    }
}

Floater.ThreeObject.prototype.destroyAnchor = function (index) {
    index = index || [this.anchors.length - 1];
    console.log('%cDestroying anchor ' + index, 'color: rebeccapurple');
    for (var i = 0; i < index.length; i++) {
        var destroyedAnchor = this.anchors.splice(index, 1)[0];
    }
}

Floater.ThreeObject.prototype.auditAnchors = function () {
    if (this.anchors.length > this.floaterGeometry.anchors.length) {
        var anchors = [];
        console.log('%cThere are too many anchors', 'color: rebeccapurple');
        for (var i = 0; i < (this.anchors.length - this.floaterGeometry.anchors.length); i++) {
            anchors.push(this.anchors.length - i);
        }
        return anchors;
    }
    if (this.anchors.length < this.floaterGeometry.anchors.length) {
        while (this.anchors.length !== this.floaterGeometry.anchors.length) {
            console.log('%cChecking for anchors', 'color: rebeccapurple');
            console.log('%cThere are too few anchors', 'color: rebeccapurple');
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
    index = index || [this.anchors.length - 1];
    console.log('%cDestroying line ' + index, 'color: rebeccapurple');
    for (var i = 0; i < index.length; i++) {
        var destroyedLine = this.lines.splice(index, 1)[0];
    }
}

Floater.ThreeObject.prototype.auditLines = function (anchors) {
    console.log(anchors);
    console.log('%cChecking lines for anchors ' + anchors, 'color: rebeccapurple');
    var lines = [];
    for (var line = 0; line < this.floaterGeometry.lines.length; line++) {
        for (var index = 0; index < anchors.length; index++) {
            if (this.floaterGeometry.lines[line].anchor1.index === anchors[index] ||
                this.floaterGeometry.lines[line].anchor2.index === anchors[index]) {
                console.log('%cFound anchor ' + index + ' in line ' + line + ', destroying', 'color: rebeccapurple');
                lines.push(line);
            }
        }
    }
    return lines;
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
    index = index || [this.connectors.length - 1];
    console.log('%cDestroying connector ' + index, 'color: rebeccapurple');
    for (var i = 0; i < index.length; i++) {
        var destroyedConnectors = this.connectors.splice(index, 1)[0];
    }
}

Floater.ThreeObject.prototype.auditConnectors = function (lines) {
    var connectors = [];
    console.log('%cChecking connectors for lines ' + lines, 'color: rebeccapurple');
    for (var connector = this.floaterGeometry.relationships.length; connector < this.relationships.children.length; connector++) {
        for (var line = 0; line < lines.length; line++) {
            connectors.push(relationship);
        }
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
