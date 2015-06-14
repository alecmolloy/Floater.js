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
    console.log(config);
    this.fieldWidth = config.fieldWidth || window.innerWidth; // int
    this.fieldHeight = config.fieldHeight || window.innerHeight; // int
    this.segments = config.segments;

    // Generate anchor array
    this.anchorArray = [];
    for (var i = 0; i < config.anchors; i++) {
        this.createAnchor(this);
    }

    // Line
    this.lineArray = [];
    for (var i = 0; i < config.linesBetween.length; i++) {
        var anchor1 = this.anchorArray[config.linesBetween[i].slice(0, 1)];
        var anchor2 = this.anchorArray[config.linesBetween[i].slice(1, 2)];
        this.createLine(this, anchor1, anchor2);
    }

    // Create relationships
    this.relationshipArray = [];
    for (var i = 0; i < config.relationshipsBetween.length; i++) {
        var line1 = this.lineArray[config.relationshipsBetween[i].slice(0, 1).charCodeAt() - 48]; // Store first line
        var line2 = this.lineArray[config.relationshipsBetween[i].slice(1, 2).charCodeAt() - 48]; // Store second line
        this.createRelationship(this, line1, line2);
    }
    console.log('Anchor array: ');
    console.log(this.anchorArray);
    console.log('Line array: ');
    console.log(this.lineArray);
    console.log("Relationship: ");
    console.log(this.relationshipArray);
}

/*
 *     Anchor constructor
 *     @param {Object} x x coordinate for anchor point
 *     @param {Object} y y coordinate for anchor point
 *     @param {Number} index
 */

Floater.prototype.Anchor = function (x, y, index) {
    this.x = x;
    this.y = y;
    this.index = index;
};

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

    // Create Anchor object from (x, y) coördinates
    var anchor = new self.Anchor(x, y, self.anchorArray.length);

    // Push the new anchor into the anchor array
    self.anchorArray.push(anchor);
}

/*
 *   Destroys Anchor
 *   @param {Object} self The parent floater object
 *   @param {Number} [index=self.anchorArray.length] The index of the anchor to be destroyed. Defaults to last anchor point in anchor array.
 */

Floater.prototype.destroyAnchor = function (self, index) {
    index = index || (self.anchorArray.length - 1); // Defaults to last anchor in array
    var destroyedAnchor = self.anchorArray.splice(index, 1); // Remove the anchor from the array
    Floater.checkLines(self, destroyedAnchor); // Check to see if there are lines affected by this removal
};

/*
 *   Creates Line
 *   @param {Object} self The parent floater object
 *   @param {Object} anchor1 The first anchor point with which to create a line
 *   @param {Object} anchor2 The second anchor point with which to create a line
 */

Floater.prototype.createLine = function (self, anchor1, anchor2) {
    var line = new self.Line(anchor1, anchor2, self.lineArray.length);
    self.lineArray.push(line);
};

/*
 *   Destroys Line
 *   @param {Object} self The parent floater object
 *   @param {Number} [index=self.lineArray.length] The index of the line to be destroyed. Defaults to last line in line array.
 */

Floater.prototype.destroyLine = function (self, index) {
    index = index || (self.lineArray.length - 1); // Defaults to last anchor in array
    var destroyedLine = self.lineArray.splice(index, 1); // Remove the anchor from the array
    Floater.checkRelationships(self, destroyedLine); // Check to see if there are lines affected by this removal
};

/*
 *   Check to see if there are lines affected by the removal of anchor points
 *   @param {Object} self The parent floater object
 *   @param {Object} destroyedAnchor A copy of an anchor point that has just been destroyed
 */

Floater.prototype.checkLines = function (self, destroyedAnchor) {
    for (var i = 0; i < self.lineArray.length; i++) {
        if (self.lineArray[i].anchor1.index === destroyedAnchor.index ||
            self.lineArray[i].anchor2.index === destroyedAnchor.index) { // Looks to see if the current line has an anchor point that no longer exists
            var destroyedLine = self.lineArray.splice(i, 1); // Removes the line and stores it in a variable
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
    self.relationshipArray.push({
        line1 : line1,
        line2 : line2
    });

    var i = self.relationshipArray.length - 1;

    // Create Segments
    for (var line = 1; line <= 2; line++) { // allows us to access each line's key using bracket notation
        var lineKey = 'line' + line;

        console.log(i);
        console.log(self.relationshipArray);
        var lineX1 = self.relationshipArray[i][lineKey].anchor1.x;
        var lineY1 = self.relationshipArray[i][lineKey].anchor1.y;
        var lineX2 = self.relationshipArray[i][lineKey].anchor2.x;
        var lineY2 = self.relationshipArray[i][lineKey].anchor2.y;

        if (self.relationshipArray[i][lineKey].connectorPoints.length === 0) {
            console.log(self);
            for (var j = 0; j <= self.segments[i]; j++) {
                var connectorX = ((lineX2 - lineX1) / self.segments[i]) * j + lineX1;
                var connectorY = ((lineY2 - lineY1) / self.segments[i]) * j + lineY1;
                var connector = new self.ConnectorPoint(connectorX, connectorY);
                self.relationshipArray[i][lineKey].connectorPoints.push(connector);
            }
        }
    }

};

/*
 *   Destroys Line
 *   @param {Object} self The parent floater object
 *   @param {Number} [index=self.lineArray.length] The index of the line to be destroyed. Defaults to last line in line array.
 */

Floater.prototype.destroyRelationship = function (self, index) {
    index = index || (self.relationshipArray.length - 1); // Defaults to last anchor in array
    self.relationshipArray.splice(index, 1); // Remove the anchor from the array
};

/*
 *   Check to see if there are relationships affected by the removal of lines
 *   @param {Object} self The parent floater object
 *   @param {Object} destroyedLine A copy of a line that has just been destroyed
 */

Floater.prototype.checkRelationships = function (self, destroyedLine) {
    for (var i = 0; i < self.relationshipArray.length; i++) {
        if (self.relationshipArray[i].line1.index === destroyedLine.index ||
            self.relationshipArray[i].line2.index === destroyedLine.index) { // Looks to see if the current relationship has a line that no longer exists
            self.relationshipArray.splice(i, 1); // Removes the line
        }
    }
};
