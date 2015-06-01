/*jslint browser: true, devel: true, passfail: false, eqeq: false, plusplus: true, sloppy: true, vars: true*/

function Floater(fieldX, fieldY, anchors, lines, segments, relationships) {
    this.fieldX = fieldX; // int
    this.fieldY = fieldY; // int
    this.anchors = anchors || 3; // int
    this.lines = lines || ['01', '12']; // Array of strings: line anchor pairs
    this.segments = segments || [20]; // Array of ints: segment numbers per line
    this.relationships = relationships || ['01']; // Array of strings: related lines

    this.anchor = [];
    this.line = [];
    this.relationship = [];
    this.connector = [[]];

    // Anchor
    for (var i = 0; i < this.anchors; i++) {
        var anchorX = Math.round(Math.random() * this.fieldX);
        var anchorY = Math.round(Math.random() * this.fieldY);
        this.anchor[i] = new this.Anchor(anchorX, anchorY, i);
    }


    // Line
    for (var i = 0; i < this.lines.length; i++) {
        var anchor1 = this.anchor[this.lines[i].slice(0, 1)];
        var anchor2 = this.anchor[this.lines[i].slice(1, 2)];
        this.line[i] = new this.Line(anchor1, anchor2, this.segments[i]);
    }

    // Relationships
    for (var i = 0; i < this.relationships.length; i++) {
        var line1 = this.line[this.relationships[i].slice(0, 1).charCodeAt() - 48];
        var line2 = this.line[this.relationships[i].slice(1, 2).charCodeAt() - 48];
        this.relationship[i] = [line1, line2];

        for (var j = 0; j < this.relationships.length; j++) {
            var x1 = this.line[i].anchor1.x;
            var y1 = this.line[i].anchor1.y;
            var x2 = this.line[i].anchor2.x;
            var y2 = this.line[i].anchor2.y;

            var connectorX = ((x2 - x1) / this.segments[i]) * j + x1;
            var connectorY = ((y2 - y1) / this.segments[i]) * j + y1;

            var connector = new this.Connector(connectorX, connectorY);
            this.connector[i][j] = connector;
        }
    }
    console.log('Anchor array: ');
    console.log(this.anchor);
    console.log('Line array: ');
    console.log(this.line);
    console.log("Relationship: ");
    console.log(this.relationship);
    console.log("Connector: ");
    console.log(this.connector);
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
