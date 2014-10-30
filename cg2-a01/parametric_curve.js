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
    }

    ParametricCurve.prototype.draw = function(context) {
        // draw the curve
        context.beginPath();

        // create wrapper functions for our terms
        var functionString = "function(t) { var result = 0; try { result = {{TERM}} ;} catch (e) { alert (\"Error: \" + e.message + '\\n\\nUse \\'t\\' for the step variable.' ); return undefined;} return result; } ;"

        var xTermWrapper;
        eval("xTermWrapper = " + functionString.replace(/{{TERM}}/g, this.xTerm) );
        var yTermWrapper;
        eval("yTermWrapper = " + functionString.replace(/{{TERM}}/g, this.yTerm) );

        var t = this.minT;

        var x = xTermWrapper(t);
        var y = yTermWrapper(t);

        // if the output of the wrapper functions are undefined
        // the formula is broken, so there is nothing to draw
        if(x === undefined || y === undefined)
            return;

        context.moveTo(x, y);

        for (var i = 1; i <= this.segments; i++) {
            t = this.minT + i / this.segments * (this.maxT - this.minT);
            x = xTermWrapper(t);
            y = yTermWrapper(t);

            context.lineTo(x, y);
            context.moveTo(x, y);
        }


        // set drawing style
        context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color;

        // actually draw
        context.stroke();
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