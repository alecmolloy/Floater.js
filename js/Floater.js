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
* @param config.lines {Array}
* @param config.segments {Array}
* @param config.relationshipsBetween {Array}
*/


function Floater(config) {
    this.fieldWidth = config.fieldWidth || window.innerWidth; // int
    this.fieldHeight = config.fieldHeight || window.innerHeight; // int

    anchors = Floater.generateRandomAnchors(config.anchors, this.fieldWidth, this.fieldHeight); // 2D array of int coördinates
    lines = config.linesBetween; // Array of strings: line anchor pairs
    relationships = config.relationshipsBetween; // Array of strings: related lines

    this.segments = config.segments || [10]; // Array of ints: segment numbers per line
    this.anchorArray = [];
    this.lineArray = [];
    this.relationshipArray = [];

    // Generate anchor array
    for (var i = 0; i < anchors.length; i++) {
        this.anchorArray[i] = new this.Anchor(anchors[i].x, anchors[i].y, i);
    }

    // Line
    for (var i = 0; i < lines.length; i++) {
        var anchor1 = this.anchorArray[lines[i].slice(0, 1)];
        var anchor2 = this.anchorArray[lines[i].slice(1, 2)];
        this.lineArray[i] = new this.Line(anchor1, anchor2, i);
    }

    // Create relationships
    for (var i = 0; i < relationships.length; i++) {
        var line1 = this.lineArray[relationships[i].slice(0, 1).charCodeAt() - 48]; // Store first line
        var line2 = this.lineArray[relationships[i].slice(1, 2).charCodeAt() - 48]; // Store second line
        this.relationshipArray[i] = { // Create relationship Array
            line1: line1,
            line2: line2
        };
        for (var line = 1; line <= 2; line++) { // allows us to access each line's key using bracket notation
            var lineKey = 'line' + line;

            var lineX1 = this.relationshipArray[i][lineKey].anchor1.x;
            var lineY1 = this.relationshipArray[i][lineKey].anchor1.y;
            var lineX2 = this.relationshipArray[i][lineKey].anchor2.x;
            var lineY2 = this.relationshipArray[i][lineKey].anchor2.y;

            if (this.relationshipArray[i][lineKey].connectorPoints.length === 0) {
                for (var j = 0; j <= this.segments[i]; j++) {
                    var connectorX = ((lineX2 - lineX1) / this.segments[i]) * j + lineX1;
                    var connectorY = ((lineY2 - lineY1) / this.segments[i]) * j + lineY1;
                    var connector = new this.ConnectorPoint(connectorX, connectorY);
                    this.relationshipArray[i][lineKey].connectorPoints.push(connector);
                }
            }
        }
    }
    console.log('Anchor array: ');
    console.log(this.anchorArray);
    console.log('Line array: ');
    console.log(this.lineArray);
    console.log("Relationship: ");
    console.log(this.relationshipArray);
}

Floater.prototype.Anchor = function (x, y, anchorIndex) {
    this.anchorIndex = anchorIndex;
    this.x = x;
    this.y = y;
};

Floater.prototype.Line = function (anchor1, anchor2, index) {
    this.index = index;
    this.anchor1 = anchor1; // Anchor
    this.anchor2 = anchor2; // Anchor
    this.connectorPoints = [];
};

Floater.prototype.ConnectorPoint = function (x, y) {
    this.x = x; // Point
    this.y = y; // Point
};

Floater.generateRandomAnchors = function (n, fieldWidth, fieldHeight) {
    fieldWidth = fieldWidth || window.innerWidth; // int
    fieldHeight = fieldHeight || window.innerHeight; // int

    var randomAnchors = [];
    for (var i = 0; i < n; i++) {
        var x = Math.round(Math.random() * fieldWidth);
        var y = Math.round(Math.random() * fieldHeight);
        randomAnchors.push({
            x: x,
            y: y
        });
    }
    return randomAnchors;
};
