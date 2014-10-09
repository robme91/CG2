 /* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"], 
       (function(Util,vec2,Scene,PointDragger) {
       
    "use strict";
	
	var Circle = function(midPoint, radius, lineStyle) {
	    console.log("creating a circle at [" + 
                    midPoint[0] + "," + midPoint[1] + 
					"] with a radius of " + radius + ".");
        
        // draw style for drawing the line
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

        // initial values in case either point is undefined
        this.midPoint = midPoint || [50, 50];
        this.radius = radius || 30;
	};
	
	// draw this circle into the provided 2D rendering context
    Circle.prototype.draw = function(context) {

        // draw actual circle
        context.beginPath();
        context.arc(this.midPoint[0], this.midPoint[1], // midpoint
                    this.radius,              // radius
                    0.0, Math.PI*2,           // start and end angle
                    true);                    // clockwise
        context.closePath();
        
        // set drawing style
        context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color;
        
        // actually start drawing
        context.stroke(); 
        
    };

    // test whether the mouse position is on this line segment
    Circle.prototype.isHit = function(context,pos) {
        
    };
	
	
	// return list of draggers to manipulate this line
    Circle.prototype.createDraggers = function() {
	console.log("hats");
    };
	
	
	// this module only exports the constructor for Circle objects
    return Circle;

}));