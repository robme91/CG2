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
    Circle.prototype.isHit = function(context,mousePos) {
    
        // check whether distance between mouse and dragger's center
        // is equal ( radius + (line width)/2 )
        var dx = mousePos[0] - this.midPoint[0];
        var dy = mousePos[1] - this.midPoint[1];
        var distanceSq = dx * dx + dy * dy;
        
        var innerBound = this.radius - this.lineStyle.width / 2 - 2;
        var outerBound = this.radius + this.lineStyle.width / 2 + 2;
        
        if( distanceSq > innerBound * innerBound && distanceSq < outerBound * outerBound)
            return true;    
            
        return false;
    };
    
    
    // return list of draggers to manipulate this line
    Circle.prototype.createDraggers = function() {
        
        var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
        var draggers = [];
        
        // create closure and callbacks for midpoint dragger
        var _circle = this;
        var sizeDraggerPosition = [_circle.midPoint[0], _circle.midPoint[1] - _circle.radius];
        var getMidPoint = function() { return _circle.midPoint; };
        var setMidPoint = function(dragEvent) { 
                              var difference = vec2.sub(dragEvent.position, _circle.midPoint);
                              sizeDraggerPosition = vec2.add(sizeDraggerPosition, difference);
                              _circle.midPoint = dragEvent.position; 
                          };
        draggers.push( new PointDragger(getMidPoint, setMidPoint, draggerStyle) );
        
        // create dragger for changing the size of the circle
        var getRadius = function() { return sizeDraggerPosition; };
        var setRadius = function(dragEvent) {
                            var difference = vec2.sub(dragEvent.position, _circle.midPoint);
                            _circle.radius = vec2.length(difference);
                            sizeDraggerPosition = dragEvent.position;
                            // update the HTML element
                            $("#radiusSelector").val(Math.round(_circle.radius));
                        };
        draggers.push( new PointDragger(getRadius, setRadius, draggerStyle) );
        
        return draggers;
    };
    
    
    // this module only exports the constructor for Circle objects
    return Circle;

}));