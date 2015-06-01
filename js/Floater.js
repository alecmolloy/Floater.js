/*jslint browser: true, devel: true, passfail: false, eqeq: false, plusplus: true, sloppy: true, vars: true*/

function Floater(fieldX, fieldY, anchors, lines, segments, relationships) {
    this.fieldX = fieldX; // int
    this.fieldY = fieldY; // int
    this.anchors = anchors || 3; // int
    lines = lines || ['01', '12']; // Array of strings: line anchor pairs
    segments = segments || [20]; // Array of ints: segment numbers per line
    relationships = relationships || ['01']; // Array of strings: related lines

    this.anchorArray = [];
    this.lineArray = [];
    this.relationshipArray = [];
    this.connectorArray = [[]];

    // Anchor
    for (var i = 0; i < this.anchors; i++) {
        var anchorX = Math.round(Math.random() * this.fieldX);
        var anchorY = Math.round(Math.random() * this.fieldY);
        this.anchorArray[i] = new this.Anchor(anchorX, anchorY, i);
    }


    // Line
    for (var i = 0; i < lines.length; i++) {
        var anchor1 = this.anchorArray[lines[i].slice(0, 1)];
        var anchor2 = this.anchorArray[lines[i].slice(1, 2)];
        this.lineArray[i] = new this.Line(anchor1, anchor2, segments[i]);
    }

    // Relationships
    for (var i = 0; i < relationships.length; i++) {
        var line1 = this.lineArray[relationships[i].slice(0, 1).charCodeAt() - 48];
        var line2 = this.lineArray[relationships[i].slice(1, 2).charCodeAt() - 48];
        this.relationshipArray[i] = [line1, line2];

        for (var j = 0; j < relationships.length; j++) {
            var x1 = this.lineArray[i].anchor1.x;
            var y1 = this.lineArray[i].anchor1.y;
            var x2 = this.lineArray[i].anchor2.x;
            var y2 = this.lineArray[i].anchor2.y;

            var connectorX = ((x2 - x1) / segments[i]) * j + x1;
            var connectorY = ((y2 - y1) / segments[i]) * j + y1;

            var connector = new this.Connector(connectorX, connectorY);
            this.connectorArray[i][j] = connector;
        }
    }
    console.log('Anchor array: ');
    console.log(this.anchorArray);
    console.log('Line array: ');
    console.log(this.lineArray);
    console.log("Relationship: ");
    console.log(this.relationshipArray);
    console.log("Connector: ");
    console.log(this.connectorArray);
}

Floater.prototype.Anchor = function (x, y, anchorNum) {
    this.anchorNum = anchorNum;
    this.x = x;
    this.y = y;
};

Floater.prototype.Line = function (anchor1, anchor2, segments) {
    this.anchor1 = anchor1; // Anchor
    this.anchor2 = anchor2; // Anchor
    this.segments = segments || 20; // int
};

Floater.prototype.Connector = function (point1, point2) {
    this.point1 = point1; // Point
    this.point2 = point2; // Point
};
