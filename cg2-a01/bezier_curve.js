 define(["util", "vec2", "scene", "point_dragger", "parametric_curve"],
       (function(Util, vec2, Scene, PointDragger, ParametricCurve) {

    "use strict";

    var BezierCurve = function(point1, point2, point3, point4, segments, lineStyle) {
        this.point1 = point1 || [ 50,  50];
        this.point2 = point2 || [250,  50];
        this.point3 = point3 || [ 50, 250];
        this.point4 = point4 || [250, 250];

        this.minT = 0;
        this.maxT = 1;

        this.segments = segments || 20;

        this.calulateTerms();

        // draw style for drawing the curve
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
    }

    // inherit from ParametricCurve
    BezierCurve.prototype = new ParametricCurve;

    // draw the bezier curve into the provided 2D rendering context
    BezierCurve.prototype.draw = function (context) {
        this.calulateTerms();
        ParametricCurve.prototype.draw.call(this, context);
    }

    // calculate the formula with the current position values
    BezierCurve.prototype.calulateTerms = function (element, t) {
        this.xTerm = "Math.pow((1 - t), 3) * " + this.point1[0] + " + 3 * Math.pow((1 - t), 2) * t * " + this.point2[0] + " + 3 * (1 - t) * t * t * " + this.point3[0] + " + Math.pow(t, 3) * " + this.point4[0];
        this.yTerm = "Math.pow((1 - t), 3) * " + this.point1[1] + " + 3 * Math.pow((1 - t), 2) * t * " + this.point2[1] + " + 3 * (1 - t) * t * t * " + this.point3[1] + " + Math.pow(t, 3) * " + this.point4[1];
    }

    // return list of draggers to manipulate this curve
    BezierCurve.prototype.createDraggers = function () {
        var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
        var draggers = [];

        // create closure and callbacks for dragger
        var _bezierCurve = this;
        var getP1 = function() { return _bezierCurve.point1; };
        var getP2 = function() { return _bezierCurve.point2; };
        var getP3 = function() { return _bezierCurve.point3; };
        var getP4 = function() { return _bezierCurve.point4; };

        var setP1 = function(dragEvent) { _bezierCurve.point1 = dragEvent.position; };
        var setP2 = function(dragEvent) { _bezierCurve.point2 = dragEvent.position; };
        var setP3 = function(dragEvent) { _bezierCurve.point3 = dragEvent.position; };
        var setP4 = function(dragEvent) { _bezierCurve.point4 = dragEvent.position; };

        draggers.push( new PointDragger(getP1, setP1, draggerStyle) );
        draggers.push( new PointDragger(getP2, setP2, draggerStyle) );
        draggers.push( new PointDragger(getP3, setP3, draggerStyle) );
        draggers.push( new PointDragger(getP4, setP4, draggerStyle) );

        return draggers;
    }

     // this module only exports the constructor for BezierCurve object
    return BezierCurve;

 }));