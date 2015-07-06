/*jslint browser: true, devel: true, passfail: false, eqeq: false, plusplus: true, sloppy: true, vars: true*/

/*

Floater.js: by Alec Molloy.

Inspired by Dale Seymour's Book: "Introduction to Line Designs" Published by Dale Seymour Publications (1 Jun, 1990). ISBN: 0866515798

Floater.js is a JavaScript object that when instantiated, becomes a *Floater*. A Floater can have many *anchor points*. Anchor points can have *lines* drawn between them. A line can be *related* to other lines. These relationships mean that each line will have *connector lines* drawn between them. How many connector lines are drawn are dependent upon the *segments* property for each relationship.

For an example of a very basic floater, please see example.png.

In the example, you can see the three anchor points. From those anchor points, the two first lines are drawn. (They happen to share an anchor point, and so the lines join each other.) These two lines are defined as being related, with 10 segments. You can count the 10 evenly-spaced points on each line that then are turned into anchor points for 10 lines that are drawn to the opposite point on the related line.

Floaters are drawn with only straight lines, but the more segments drawn, the more it looks like a parabolic curve.

*/

/**
 *  Floater
 *
 *  @class Floater
 *  @constructor
 *  @param config {Object}
 *  @param config.dimensions {Number}
 *  @param config.fieldHeight {Number}
 *  @param config.anchors {Number}
 *  @param config.linesBetween {String[]}
 *  @param config.segments {Number}
 *  @param config.relationshipsBetween {String[]}
 */
function Floater(config) {
    this.dimensions = config.dimensions || 3;
    this.dimensionNames = ['x', 'y'];
    if (this.dimensions === 3) {
        this.dimensionNames.push('z');
    }

    this.field = {
        x: window.innerHeight,
        y: window.innerHeight,
        z: window.innerHeight
    };
    this.segments = config.segments;

    // Generate anchor array
    this.anchors = [];
    for (var anchor = 0; anchor < config.anchors; anchor++) {
        this.createAnchor();
    }

    // Line
    this.lines = [];
    for (var lineBetween = 0; lineBetween < config.linesBetween.length; lineBetween++) {
        var anchor1 = this.anchors[config.linesBetween[lineBetween].slice(0, 1)];
        var anchor2 = this.anchors[config.linesBetween[lineBetween].slice(1, 2)];
        this.createLine(anchor1, anchor2);
    }

    // Create relationships
    this.relationships = [];
    for (var relationshipBetween = 0; relationshipBetween < config.relationshipsBetween.length; relationshipBetween++) {
        var line1 = this.lines[config.relationshipsBetween[relationshipBetween].slice(0, 1).charCodeAt() - 48]; // Store first line
        var line2 = this.lines[config.relationshipsBetween[relationshipBetween].slice(1, 2).charCodeAt() - 48]; // Store second line
        this.createRelationship(line1, line2);
    }
}

/*
 *  Anchor constructor
 *  @param {Object} vector x, y, z coördinates for the anchor point
 *  @param {Object} jitter x, y, z translation vector for the anchor point's jitter
 *  @param {Number} index Which number vector this is
 *  @param {Object} eVector The "euclidean vector" for the anchor point's movement. Essentially the direction and speed of the anchor point.
 */

Floater.Anchor = function (vector, jitter, index, eVector) {
    this.vector = {
        x: vector.x,
        y: vector.y
    };
    if (vector.z) {
        this.vector.z = vector.z;
    }
    this.jitter = {
        x: jitter.x,
        y: jitter.y
    };
    if (jitter.z) {
        this.jitter.z = jitter.z;
    }
    this.index = index;
    this.eVector = eVector;
};

/*
 *  Animates all anchor point positions
 *  @param {Object} this The parent Floater object
 */

Floater.prototype.animateAnchors = function () {
    for (var anchor = 0; anchor < this.anchors.length; anchor++) {
        this.updateAnchorPosition(this.anchors[anchor]);
    }
    this.updateSegments();
}

/*
 *  Updates an anchor point position on their euclidean vectors
 *  @param {Object} this The parent Floater object
 *  @param {Object} anchor The anchor point which will be translated in the direction and magnitude of its euclidean vector.
 */

Floater.prototype.updateAnchorPosition = function (anchor) {
    for (var iDimension = 0; iDimension < this.dimensions; iDimension++) {
        var dimension = this.dimensionNames[iDimension];
        if (anchor.vector[dimension] >= this.field[dimension] / 2 || anchor.vector[dimension] <= 0 - this.field[dimension] / 2) {
            anchor.eVector[dimension] *= -1; // Reverse the sign so that it bounces and goes the other way
        }
        anchor.vector[dimension] += anchor.eVector[dimension];
    }
};
/*
 *  Line constructor
 *  @param {Object} anchor1 first anchor point for line
 *  @param {Object} anchor2 second anchor point for line
 *  @param {Number} index
 */

Floater.Line = function (anchor1, anchor2, index) {
    this.index = index;
    this.anchor1 = anchor1; // Anchor
    this.anchor2 = anchor2; // Anchor
    this.connectorPoints = [];
};

/*
 *  Connector Point constructor
 *  @param {Object} vector coordinates for connector point
 */

Floater.ConnectorPoint = function (vector) {
    this.x = vector.x || 0; // Point
    this.y = vector.y || 0; // Point
    this.z = vector.z || 0; // Point
};

/*
 *  Creates an Anchor. An anchor has a vector (where it is in space), its jitter (a translation of how far it should be from its calculated position), and a eVector (euclidean vector: the direction and speed of the anchor point)
 *  @param {Object} this The parent floater object
 */

Floater.prototype.createAnchor = function () {
    var vector = {
        x: null,
        y: null
    };
    var jitter = {
        x: null,
        y: null
    };
    var eVector = {
        x: null,
        y: null
    };
    if (this.dimensions === 3) {
        vector.z = null;
        jitter.z = null;
        eVector.z = null;
    }

    // Calculate random vectors within the given field, and euclidean vectors
    for (var iDimension = 0; iDimension < this.dimensions; iDimension++) {
        var dimension = this.dimensionNames[iDimension];
        vector[dimension] = Math.round(Math.random() * (this.field[dimension]) - this.field[dimension] / 2);
        eVector[dimension] = (Math.random() * 2) - 1;
    }

    // Create Anchor object from vector and euclidean ector
    var anchor = new Floater.Anchor(vector, jitter, this.anchors.length, eVector);

    // Push the new anchor into the anchor array
    return this.anchors.push(anchor);
};

/*
 *  Destroys Anchor
 *  @param {Object} this The parent floater object
 *  @param {Number} [index=this.anchors.length] The index of the anchor to be destroyed. Defaults to last anchor point in anchor array.
 */

Floater.prototype.destroyAnchor = function (index) {
    index = index || (this.anchors.length - 1); // Defaults to last anchor in array
    var destroyedAnchor = this.anchors.splice(index, 1); // Remove the anchor from the array
    Floater.checkLines(destroyedAnchor); // Check to see if there are lines affected by this removal

    return destroyedAnchor;
};

/*
 *  Creates Line
 *  @param {Object} this The parent floater object
 *  @param {Object} anchor1 The first anchor point with which to create a line
 *  @param {Object} anchor2 The second anchor point with which to create a line
 */

Floater.prototype.createLine = function (anchor1, anchor2) {
    var line = new Floater.Line(anchor1, anchor2, this.lines.length);
    return this.lines.push(line);
};

/*
 *  Destroys Line
 *  @param {Object} this The parent floater object
 *  @param {Number} [index=this.lines.length] The index of the line to be destroyed. Defaults to last line in line array.
 */

Floater.prototype.destroyLine = function (index) {
    index = index || (this.lines.length - 1); // Defaults to last anchor in array
    var destroyedLine = this.lines.splice(index, 1); // Remove the anchor from the array
    Floater.checkRelationships(destroyedLine); // Check to see if there are lines affected by this removal

    return destroyedLine;
};

/*
 *  Check to see if there are lines affected by the removal of anchor points
 *  @param {Object} this The parent floater object
 *  @param {Object} destroyedAnchor A copy of an anchor point that has just been destroyed
 */

Floater.prototype.checkLines = function (destroyedAnchor) {
    for (var i = 0; i < this.lines.length; i++) {
        if (this.lines[i].anchor1.index === destroyedAnchor.index ||
            this.lines[i].anchor2.index === destroyedAnchor.index) { // Looks to see if the current line has an anchor point that no longer exists
            var destroyedLine = this.lines.splice(i, 1); // Removes the line and stores it in a variable
            Floater.checkRelationships(destroyedLine); // Check to see if there are relationships affected by this removal
        }
    }
};

/*
 *  Creates a relationship
 *  @param {Object} this The parent floater object
 *  @param {Object} line1 The first line with which to create a relationship
 *  @param {Object} line2 The second line with which to create a relationship
 */

Floater.prototype.createRelationship = function (line1, line2) {
    var i = this.relationships.length;
    this.relationships.push({
        line1: line1,
        line2: line2
    });

    // Create Segments
    this.createSegments(i);
    return this.relationships[i];
};

/*
 *  Destroys Line
 *  @param {Object} this The parent floater object
 *  @param {Number} [index=this.lines.length] The index of the line to be destroyed. Defaults to last line in line array.
 */

Floater.prototype.destroyRelationship = function (index) {
    index = index || (this.relationships.length - 1); // Defaults to last anchor in array
    this.relationships.splice(index, 1); // Remove the anchor from the array
};

/*
 *  Check to see if there are relationships affected by the removal of lines
 *  @param {Object} this The parent floater object
 *  @param {Object} destroyedLine A copy of a line that has just been destroyed
 */

Floater.prototype.checkRelationships = function (destroyedLine) {
    for (var relationship = 0; i < this.relationships.length; i++) {
        if (this.relationships[relationship].line1.index === destroyedLine.index ||
            this.relationships[relationship].line2.index === destroyedLine.index) { // Looks to see if the current relationship has a line that no longer exists
            this.relationships.splice(relationship, 1); // Removes the line
        }
    }
};

/*
 *
 *  Creates segment endpoint positions, and also how many segments there are for a given relationship
 *  @param {Object} this The parent floater object
 *  @param {Number} relationship Which relationship whose segments you want to update
 *  @param {Number} [segments=this.relationships[index].segments] The number of segments you want to update the relationship to have
 */

Floater.prototype.createSegments = function (relationship, segments) {
    var newSegments = segments || this.segments;

    for (var line in this.relationships[relationship]) { // allows us to access each line's key using bracket notation
        if (this.relationships[relationship][line].connectorPoints.length === 0) {
            for (var segment = 0; segment <= this.segments; segment++) {
                var connector = new Floater.ConnectorPoint({
                    x: null,
                    y: null,
                    z: null
                });
                this.relationships[relationship][line].connectorPoints.push(connector);
            }
        }
    }
    this.updateSegments();
    return this.segments;
};

/*
 *  Updates the positions of segments
 *  @param {Object} this The parent floater object
 */

Floater.prototype.updateSegments = function () {
    for (var relationship = 0; relationship < this.relationships.length; relationship++) {
        for (var iLine in this.relationships[relationship]) {
            var line = this.relationships[relationship][iLine];
            var anchor1 = line.anchor1;
            var anchor2 = line.anchor2;
            for (var segment = 0; segment < this.segments; segment++) {
                for (var iDimension = 0; iDimension < this.dimensions; iDimension++) {
                    var dimension = this.dimensionNames[iDimension];
                    var anchor1D = anchor1.vector[dimension] + anchor1.jitter[dimension];
                    var anchor2D = anchor2.vector[dimension] + anchor2.jitter[dimension];
                    var dimensionValue = ((anchor2D - anchor1D) / this.segments) * segment + anchor1D;
                    line.connectorPoints[segment][dimension] = dimensionValue;
                }
            }
        }
    }
    return this.segments;
};

/*
 *  Updates the jitter property of each anchor with sound data.
 *  @param {Object} this The parent floater object
 */

Floater.prototype.microphoneJitter = function () {
    for (var anchor = 0; anchor < this.anchors.length; anchor++) {
        this.anchors[anchor].jitter.x = Math.pow(sound.dataArray[0], 3) / 50000;
        this.anchors[anchor].jitter.y = Math.pow(sound.dataArray[7], 3) / 50000;
        this.anchors[anchor].jitter.z = Math.pow(sound.dataArray[15], 3) / 50000;
    }
}

/*
 *  Reports on the current status of the floater
 */

Floater.prototype.report = function () {
    console.log('Anchors: ');
    console.log(this.anchors);
    console.log('Lines: ');
    console.log(this.lines);
    console.log("Relationships: ");
    console.log(this.relationships);
};
