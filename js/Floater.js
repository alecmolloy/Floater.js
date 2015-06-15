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
 * Floater
 *
 * @class Floater
 * @constructor
 * @param config {Object}
 * @param config.fieldWidth {Number}
 * @param config.fieldHeight {Number}
 * @param config.anchors {Number}
 * @param config.linesBetween {String[]}
 * @param config.segments {Number[]}
 * @param config.relationshipsBetween {String[]}
 */


function Floater(config) {
    this.fieldWidth = config.fieldWidth || window.innerWidth; // int
    this.fieldHeight = config.fieldHeight || window.innerHeight; // int
    this.segments = config.segments;

    // Generate anchor array
    this.anchors = [];
    for (var i = 0; i < config.anchors; i++) {
        this.createAnchor(this);
    }

    // Line
    this.lines = [];
    for (var i = 0; i < config.linesBetween.length; i++) {
        var anchor1 = this.anchors[config.linesBetween[i].slice(0, 1)];
        var anchor2 = this.anchors[config.linesBetween[i].slice(1, 2)];
        this.createLine(this, anchor1, anchor2);
    }

    // Create relationships
    this.relationships = [];
    for (var i = 0; i < config.relationshipsBetween.length; i++) {
        var line1 = this.lines[config.relationshipsBetween[i].slice(0, 1).charCodeAt() - 48]; // Store first line
        var line2 = this.lines[config.relationshipsBetween[i].slice(1, 2).charCodeAt() - 48]; // Store second line
        this.createRelationship(this, line1, line2);
    }
}

/*
 *     Anchor constructor
 *     @param {Object} x x coordinate for anchor point
 *     @param {Object} y y coordinate for anchor point
 *     @param {Number} index
 *     @param {Number} vector The vector for the anchor point's movement
 */

Floater.prototype.Anchor = function (x, y, index, vector) {
    this.x = x;
    this.y = y;
    this.index = index;
    this.vector = vector;
};

/*
 *    Updates anchor point positions given a vector
 *    @param {Object} self The parent Anchor object
 *     @param {Number[]} self.vector The vector for the anchor point. The anchor point will be translated in this direction.
 */

Floater.prototype.animateAnchors = function (self) {
    for (var i = 0; i < self.anchors.length; i++) {
        self.anchors[i].updatePosition(self.anchors[i]);
    }
    self.updateSegments(self);
}

/*
 *    Updates anchor point positions given a vector
 *    @param {Object} self The parent Anchor object
 *     @param {Number[]} self.vector The vector for the anchor point. The anchor point will be translated in this direction.
 */

Floater.prototype.Anchor.prototype.updatePosition = function (self) {
    self.x += self.vector.x;
    self.y += self.vector.y;
}

/*
 *     Line constructor
 *     @param {Object} anchor1 first anchor point for line
 *     @param {Object} anchor2 second anchor point for line
 *     @param {Number} index
 */

Floater.prototype.Line = function (anchor1, anchor2, index) {
    this.index = index;
    this.anchor1 = anchor1; // Anchor
    this.anchor2 = anchor2; // Anchor
    this.connectorPoints = [];
};

/*
 *     Connector Point constructor
 *     @param {Number} x x coordinate for connector point
 *     @param {Number} y y coordinate for connector point
 */

Floater.prototype.ConnectorPoint = function (x, y) {
    this.x = x; // Point
    this.y = y; // Point
};

/*
 *   Creates Anchor
 *   @param {Object} self The parent floater object
 */

Floater.prototype.createAnchor = function (self) {
    // Calculate random (x, y) coördinates within the given field
    var x = Math.round(Math.random() * self.fieldWidth);
    var y = Math.round(Math.random() * self.fieldHeight);

    // Create random 2D vector
    var vector = {
        x: 0,
        y: 0
    };

    for (key in vector) {
        var sign = Math.random() > .5 ? 1 : -1;
        vector[key] = parseFloat((Math.random() * sign).toPrecision(2));
    }


    // Create Anchor object from (x, y) coördinates
    var anchor = new self.Anchor(x, y, self.anchors.length, vector);

    // Push the new anchor into the anchor array
    return self.anchors.push(anchor);
}

/*
 *   Destroys Anchor
 *   @param {Object} self The parent floater object
 *   @param {Number} [index=self.anchors.length] The index of the anchor to be destroyed. Defaults to last anchor point in anchor array.
 */

Floater.prototype.destroyAnchor = function (self, index) {
    index = index || (self.anchors.length - 1); // Defaults to last anchor in array
    var destroyedAnchor = self.anchors.splice(index, 1); // Remove the anchor from the array
    Floater.checkLines(self, destroyedAnchor); // Check to see if there are lines affected by this removal

    return destroyedAnchor;
};

/*
 *   Creates Line
 *   @param {Object} self The parent floater object
 *   @param {Object} anchor1 The first anchor point with which to create a line
 *   @param {Object} anchor2 The second anchor point with which to create a line
 */

Floater.prototype.createLine = function (self, anchor1, anchor2) {
    var line = new self.Line(anchor1, anchor2, self.lines.length);
    return self.lines.push(line);
};

/*
 *   Destroys Line
 *   @param {Object} self The parent floater object
 *   @param {Number} [index=self.lines.length] The index of the line to be destroyed. Defaults to last line in line array.
 */

Floater.prototype.destroyLine = function (self, index) {
    index = index || (self.lines.length - 1); // Defaults to last anchor in array
    var destroyedLine = self.lines.splice(index, 1); // Remove the anchor from the array
    Floater.checkRelationships(self, destroyedLine); // Check to see if there are lines affected by this removal

    return destroyedLine
};

/*
 *   Check to see if there are lines affected by the removal of anchor points
 *   @param {Object} self The parent floater object
 *   @param {Object} destroyedAnchor A copy of an anchor point that has just been destroyed
 */

Floater.prototype.checkLines = function (self, destroyedAnchor) {
    for (var i = 0; i < self.lines.length; i++) {
        if (self.lines[i].anchor1.index === destroyedAnchor.index ||
            self.lines[i].anchor2.index === destroyedAnchor.index) { // Looks to see if the current line has an anchor point that no longer exists
            var destroyedLine = self.lines.splice(i, 1); // Removes the line and stores it in a variable
            Floater.checkRelationships(self, destroyedLine); // Check to see if there are relationships affected by this removal
        }
    }
};

/*
 *   Creates a relationship
 *   @param {Object} self The parent floater object
 *   @param {Object} line1 The first line with which to create a relationship
 *   @param {Object} line2 The second line with which to create a relationship
 */

Floater.prototype.createRelationship = function (self, line1, line2) {
    var i = self.relationships.length;
    self.relationships.push({
        line1: line1,
        line2: line2,
        segments: self.segments[i]
    });

    // Create Segments
    self.createSegments(self, i, self.relationships[i].segments);
    return self.relationships[i];
};

/*
 *   Destroys Line
 *   @param {Object} self The parent floater object
 *   @param {Number} [index=self.lines.length] The index of the line to be destroyed. Defaults to last line in line array.
 */

Floater.prototype.destroyRelationship = function (self, index) {
    index = index || (self.relationships.length - 1); // Defaults to last anchor in array
    self.relationships.splice(index, 1); // Remove the anchor from the array
};

/*
 *   Check to see if there are relationships affected by the removal of lines
 *   @param {Object} self The parent floater object
 *   @param {Object} destroyedLine A copy of a line that has just been destroyed
 */

Floater.prototype.checkRelationships = function (self, destroyedLine) {
    for (var i = 0; i < self.relationships.length; i++) {
        if (self.relationships[i].line1.index === destroyedLine.index ||
            self.relationships[i].line2.index === destroyedLine.index) { // Looks to see if the current relationship has a line that no longer exists
            self.relationships.splice(i, 1); // Removes the line
        }
    }
};

/*
 * TODODODODODO
 *  Creates segment endpoint positions, and also how many segments there are for a given relationship
 *  @param {Object} self The parent floater object
 *  @param {Number} index The index for the relationship whose segments you want to update
 *  @param {Number} [segments=self.relationships[index].segments] The number of segments you want to update the relationship to have
 */

Floater.prototype.createSegments = function (self, index, segments) {
    var newSegments = segments || self.relationships[index].segments;

    for (var line = 1; line <= 2; line++) { // allows us to access each line's key using bracket notation
        var lineKey = 'line' + line;
        if (self.relationships[index][lineKey].connectorPoints.length === 0) {
            for (var j = 0; j <= self.segments[index]; j++) {
                var connector = new self.ConnectorPoint(0, 0);
                self.relationships[index][lineKey].connectorPoints.push(connector);
            }
        }
    }
    self.updateSegments(self);
    return self.segments;
};

Floater.prototype.updateSegments = function (self) {
    for (var i = 0; i < self.relationships.length; i++) {
        for (var line = 1; line <= 2; line++) { // allows us to access each line's key using bracket notation
            var lineKey = 'line' + line;

            var lineX1 = self.relationships[i][lineKey].anchor1.x;
            var lineY1 = self.relationships[i][lineKey].anchor1.y;
            var lineX2 = self.relationships[i][lineKey].anchor2.x;
            var lineY2 = self.relationships[i][lineKey].anchor2.y;

            for (var j = 0; j <= self.segments[i]; j++) {
                var connectorX = ((lineX2 - lineX1) / self.segments[i]) * j + lineX1;
                var connectorY = ((lineY2 - lineY1) / self.segments[i]) * j + lineY1;
                self.relationships[i][lineKey].connectorPoints[j].x = connectorX;
                self.relationships[i][lineKey].connectorPoints[j].y = connectorY;
            }
        }
    }
    return self.segments;
};

/*
 *    Reports on the current status of the floater
 */

Floater.prototype.report = function (self) {
    console.log('Anchors: ');
    console.log(self.anchors);
    console.log('Lines: ');
    console.log(self.lines);
    console.log("Relationships: ");
    console.log(self.relationships);
}
