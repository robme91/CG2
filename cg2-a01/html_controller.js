/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

 
/* requireJS module definition */
define(["jquery", "straight_line", "circle"], 
       (function($, StraightLine, Circle) {

    "use strict"; 
                
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context,scene,sceneController) {
    
    
        // generate random X coordinate within the canvas
        var randomX = function() { 
            return Math.floor(Math.random()*(context.canvas.width-10))+5; 
        };
            
        // generate random Y coordinate within the canvas
        var randomY = function() { 
            return Math.floor(Math.random()*(context.canvas.height-10))+5; 
        };
            
        // generate random color in hex notation
        var randomColor = function() {

            // convert a byte (0...255) to a 2-digit hex string
            var toHex2 = function(byte) {
                var s = byte.toString(16); // convert to hex string
                if(s.length == 1) s = "0"+s; // pad with leading 0
                return s;
            };
                
            var r = Math.floor(Math.random()*25.9)*10;
            var g = Math.floor(Math.random()*25.9)*10;
            var b = Math.floor(Math.random()*25.9)*10;
                
            // convert to hex notation
            return "#"+toHex2(r)+toHex2(g)+toHex2(b);
        };
		

        
        /*
         * event handler for "new line button".
         */
        $("#btnNewLine").click( (function() {
        
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
                          
            var line = new StraightLine( [randomX(),randomY()], 
                                         [randomX(),randomY()], 
                                         style );
            scene.addObjects([line]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw
                        
        }));
		
		/*
         * event handler for "new circle button".
         */
        $("#btnNewCircle").click( (function() {
		    
			// create the actual circle and add it to the scene
            var style = { 
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };
			
			var radius = Math.floor(Math.random() * 50) + 10;
			
			var circle = new Circle([randomX(),randomY()],
			                        radius, 
									style);
			scene.addObjects([circle]);
		
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw

		}));
        
		var actualValues = function(){
			var width = sceneController.getSelectedObject().lineStyle.width;
			var color = sceneController.getSelectedObject().lineStyle.color;
			$("#lineWidthSelector").val(width);
			$("#colorSelector").val(color);
			
		}
		sceneController.onSelection(actualValues);
        
		var updateWidth = function(){
			var newWidth = $("#lineWidthSelector").val();
			sceneController.getSelectedObject().lineStyle.width = newWidth;
			sceneController.redraw();
		}
		$("#lineWidthSelector").change(updateWidth);
		
		var updateColor = function(){
			var newColor = $("#colorSelector").val();
			sceneController.getSelectedObject().lineStyle.color = newColor;
			var temp = sceneController.getSelectedObject();
			console.log(temp);
			sceneController.redraw();
		}
		
		$("#colorSelector").change(updateColor);
    
    };

    // return the constructor function 
    return HtmlController;


})); // require 



            
