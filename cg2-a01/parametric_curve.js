define(["util", "vec2", "scene", "point_dragger"], 
       (function(Util,vec2,Scene,PointDragger) {
       
    "use strict";
    
    var ParametricCurve = function(xTerm, yTerm, minT, maxT, segments, lineStyle){
        console.log("creating a parametric curve ");
        
        // draw style for drawing the line
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

        // initial values in case either point is undefined
        this.xTerm = xTerm || "150 + 100 * Math.sin(t)";
        this.yTerm = yTerm || "150 + 100 * Math.cos(t)";
        
        this.minT = minT || 0;
        this.maxT = maxT || Math.PI; // TODO: später testen
        
        this.segments = segments || 5;
    }
    
    ParametricCurve.prototype.draw = function(context) {       
        // draw the curve
        context.beginPath();
                
        var t = this.minT;
        //TODO funktion die eval aufnimmt
        var x = eval(this.xTerm);
        var y = eval(this.yTerm);
        
        context.moveTo(x, y);

        for (var i = 1; i <= this.segments; i++) {
            t = this.minT + i / this.segments * (this.maxT - this.minT);
            x = eval(this.xTerm);
            y = eval(this.yTerm);
            
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