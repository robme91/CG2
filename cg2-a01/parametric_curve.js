define(["util", "vec2", "scene", "point_dragger"],
       (function(Util,vec2,Scene,PointDragger) {

    "use strict";

    var ParametricCurve = function(xTerm, yTerm, minT, maxT, segments, showTickmarks, lineStyle){
        console.log("creating a parametric curve ");

        // initial values in case either point is undefined
        this.xTerm = xTerm || "150 + 100 * Math.sin(t)";
        this.yTerm = yTerm || "150 + 100 * Math.cos(t)";

        this.minT = minT || 0;
        this.maxT = maxT || Math.PI; // TODO: später testen

        this.segments = segments || 5;

        this.showTickmarks = showTickmarks;

        // draw style for drawing the line
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

        this.pointArray = [];
    }

    ParametricCurve.prototype.draw = function(context) {
        var functionString = "function(t) { var result = 0; try { result = {{TERM}} ;} catch (e) { alert (\"Error: \" + e.message + '\\n\\nPlease check the formular.\\nUse \\'t\\' for the step variable.' ); return undefined;} return result; } ;"

        // create wrapper functions for our terms
        var xTermWrapper;
        eval("xTermWrapper = " + functionString.replace(/{{TERM}}/g, this.xTerm) );
        var yTermWrapper;
        eval("yTermWrapper = " + functionString.replace(/{{TERM}}/g, this.yTerm) );

        var t = this.minT;

        var x = xTermWrapper(t);
        var y = yTermWrapper(t);

        // if the output of the wrapper functions are undefined
        // the formula is broken, so there is nothing to draw
        if (x === undefined || y === undefined)
            return;

        this.pointArray[0] = [x, y];

        // draw the curve
        context.beginPath();

        context.moveTo(x, y);

        for (var i = 1; i <= this.segments; i++) {
            t = this.minT + i / this.segments * (this.maxT - this.minT);
            x = xTermWrapper(t);
            y = yTermWrapper(t);

            this.pointArray[i] = [x, y];

            context.lineTo(x, y);
        }

        // set curve drawing style
        context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color;

        // actually draw the curve
        context.stroke();

        // draw the tickmarks if requested
        if (this.showTickmarks === true) {
            context.beginPath();

            for (var i = 1; i < this.segments; i++) {
                // calculate the normal of the current curve point
                var previousPoint = this.pointArray[i - 1];
                var nextPoint = this.pointArray[i + 1];
                var tangent = vec2.sub(previousPoint, nextPoint);
                var tangentNormal = [tangent[1] * (-1), tangent[0]];
                tangentNormal = vec2.mult(vec2.normalize(tangentNormal), 10); // make the tangent normal 10px long

                // calculate two points that are perpendicular above and below the current curve point
                var topTick = vec2.add(this.pointArray[i], tangentNormal);
                var bottomTick = vec2.sub(this.pointArray[i], tangentNormal);

                // draw a line between those points
                context.moveTo(topTick[0], topTick[1]);
                context.lineTo(bottomTick[0], bottomTick[1]);
            }

            // set tickmarks drawing style
            context.lineWidth = 1;
            context.strokeStyle = "#FF711B";

            // actually draw the tickmarks
            context.stroke();
        }
    }

    // test whether the mouse position is on the curve
    ParametricCurve.prototype.isHit = function(context,mousePos) {
    }

    // return list of draggers to manipulate this curve
    ParametricCurve.prototype.createDraggers = function() {
        return {};
    }


     // this module only exports the constructor for ParametricCurve objects
    return ParametricCurve;

 }));