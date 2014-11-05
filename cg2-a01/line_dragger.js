/*
 * Module line_dragger
 *
 * This Module put a dragger between two Points.
 *
 *
 *
 *
 */ 

define(["util", "scene"], 
       (function(Util,Scene) {

    "use strict";
 
    var LineDragger = function( pointArray ,drawStyle){
    
        this.pointArray = pointArray;
        
        // default draw style for the dragger
        drawStyle = drawStyle || {};
        this.drawStyle = {};
        this.drawStyle.width = drawStyle.width || 2;
        this.drawStyle.color = drawStyle.color || "#ff0000";
                
        // attribute queried by SceneController to recognize draggers
        this.isDragger = true; 
    
    }
    
    /*draws a line from the first point of the array to the last one, through all the other points*/
    LineDragger.prototype.draw = function(context){
        //to get name shorter
        var points = this.pointArray;
        
        //draw from first to last point a line 
        context.beginPath();
        
        for(var i = 1; i < points.length ; i++){
            context.moveTo(points[i-1][0], points[i-1][1]);
            context.lineTo(points[i][0], points[i][1]);
        }
        
        context.closePath();
        
        // draw style
        context.lineWidth   = this.drawStyle.width;
        context.strokeStyle = this.drawStyle.color;
        
        //draw dragger
        context.stroke();
        
    }
    
    
    /* 
     * test whether the specified mouse position "hits" this dragger
     */
    LineDragger.prototype.isHit = function (context,mousePos) {
        return false;
    };
    
    /*
     * Event handler triggered by a SceneController when mouse
     * is being dragged
     */
    LineDragger.prototype.mouseDrag = function (dragEvent) {
        // do nothing
    };

 
 
    return LineDragger;
    
}));