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
define(["jquery", "straight_line", "circle", "parametric_curve", "bezier_curve"], 
       (function($, StraightLine, Circle, ParametricCurve, BezierCurve) {

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
        
        /*
         * event handler for "new parametric curve button".
         */
        $("#btnNewParametricCurve").click( (function() {
            
            // create the actual curve and add it to the scene
            var style = { 
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };
            
            //TODO: Random values
            var paramtericCurve = new ParametricCurve( $('#xTermInput').val(),
                                                       $('#yTermInput').val(),
                                                       parseFloat($('#minTSelector').val()),
                                                       parseFloat($('#maxTSelector').val()),
                                                       parseInt($('#segmentsSelector').val()),
                                                       false, // don't show the tickmarks
                                                       style);
            scene.addObjects([paramtericCurve]);
        
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(paramtericCurve); // this will also redraw

        }));

        /*
         * event handler for "new bezier curve button".
         */
        $("#btnNewBezierCurve").click( (function() {
            
            // create the actual curve and add it to the scene
            var style = { 
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };
            
            //TODO: Random values
            var bezierCurve = new BezierCurve([ 50,  50],
                                              [250,  50],
                                              [ 50, 250],
                                              [250, 250],
                                              parseInt($('#segmentsSelector').val()),
                                              style);
            scene.addObjects([bezierCurve]);
        
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(bezierCurve); // this will also redraw

        }));
        
        
        /*
         * callback that displays the actuall values of the selected object
         */
        var objectSelectionCallback = function(){
            // hide everything
            $("#input_area").children().hide(); 
            
            // show the standart inputs
            $("#lineWidthLabel").show();
            $("#lineWidthSelector").show();
            $("#colorLabel").show();
            $("#colorSelector").show();
            
            var selectedObj = sceneController.getSelectedObject();
            var width = selectedObj.lineStyle.width;
            var color = selectedObj.lineStyle.color;
            $("#lineWidthSelector").val(width);
            $("#colorSelector").val(color);
            
            if (selectedObj instanceof Circle){
                $("#radiusLabel").show();
                $("#radiusSelector").show();
                
                $("#radiusSelector").val(Math.round(selectedObj.radius));
            }
            else {
                if (selectedObj instanceof ParametricCurve) {
                    $("#xTermLabel").show();
                    $("#xTermInput").show();
                    $("#yTermLabel").show();
                    $("#yTermInput").show();
                    $("#minTLabel").show();
                    $("#minTSelector").show();
                    $("#maxTLabel").show();
                    $("#maxTSelector").show();
                    $("#segmentsLabel").show();
                    $("#segmentsSelector").show();
                    $("#tickmarksLabel").show();
                    $("#tickmarksCheckbox").show();
                    
                    $("#xTermInput").val(selectedObj.xTerm);
                    $("#yTermInput").val(selectedObj.yTerm);
                    $("#minTSelector").val(selectedObj.minT);
                    $("#maxTSelector").val(selectedObj.maxT);
                    $("#segmentsSelector").val(selectedObj.segments);
                }
                if (selectedObj instanceof BezierCurve) {
                    $("#xTermLabel").hide();
                    $("#xTermInput").hide();
                    $("#yTermLabel").hide();
                    $("#yTermInput").hide();
                    $("#minTLabel").hide();
                    $("#minTSelector").hide();
                    $("#maxTLabel").hide();
                    $("#maxTSelector").hide();
                }
            }
        }
        /*
         * shows values of selected object
         */
        sceneController.onSelection(objectSelectionCallback);
        
        /*
         * update the linewidth of the selected object
         */
        var updateWidth = function(){
            var newWidth = parseInt($("#lineWidthSelector").val());
            sceneController.getSelectedObject().lineStyle.width = newWidth;
            sceneController.redraw();
        }
        
        /*
         * update the color of the selected object
         */
        var updateColor = function(){
            var newColor = $("#colorSelector").val();
            var selectedObject = sceneController.getSelectedObject();
            selectedObject.lineStyle.color = newColor;
            
            // this ensures that the color of the draggers are also updated, it also redraws the scene
            sceneController.deselect();
            sceneController.select(selectedObject);
        } 
        
        /*
         * update the radius of the selected object
         */
        var updateRadius = function(){
            var newRadius = parseInt($("#radiusSelector").val());
            var selectedObject = sceneController.getSelectedObject();
            selectedObject.radius = newRadius;

            // this ensures that the color of the draggers are also updated, it also redraws the scene
            sceneController.deselect();
            sceneController.select(selectedObject);
        }
        
        var updateXTerm = function(){
            var newXTerm = $("#xTermInput").val();
            sceneController.getSelectedObject().xTerm = newXTerm;
            
            sceneController.redraw();
        }
        
        var updateYTerm = function(){
            var newYTerm = $("#yTermInput").val();
            sceneController.getSelectedObject().yTerm = newYTerm;
            
            sceneController.redraw();
        }
        
        var updateMinT = function(){
            var newMinT = parseFloat($("#minTSelector").val());
            newMinT = Math.round(newMinT * 1000) / 1000;
            $("#minTSelector").val(newMinT);
            sceneController.getSelectedObject().minT = newMinT;
            
            sceneController.redraw();
        }
        
        var updateMaxT = function(){
            var newMaxT = parseFloat($("#maxTSelector").val());
            newMaxT = Math.round(newMaxT * 1000) / 1000;
            $("#maxTSelector").val(newMaxT);
            sceneController.getSelectedObject().maxT = newMaxT;
            //TODO testen ob tmax größer tmin
            
            sceneController.redraw();
        }
        
        var updateSegments = function(){
            var newSegments = parseInt($("#segmentsSelector").val());
            $('#segmentsSelector').val(newSegments);
            sceneController.getSelectedObject().segments = newSegments;
            
            sceneController.redraw();
        }
        
        var updateTickmarks = function(){
            var isChecked = $('#tickmarksCheckbox').is(':checked');

            sceneController.getSelectedObject().showTickmarks = isChecked;
            
            sceneController.redraw();
        }


        
        /*
         * install callback functions, so if the html element changes, the value will be updated
         */
        $("#lineWidthSelector").change(updateWidth);
        $("#colorSelector").change(updateColor);
        $("#radiusSelector").change(updateRadius);
        $("#xTermInput").change(updateXTerm);
        $("#yTermInput").change(updateYTerm);
        $("#minTSelector").change(updateMinT);
        $("#maxTSelector").change(updateMaxT);
        $("#segmentsSelector").change(updateSegments);
        $("#tickmarksCheckbox").change(updateTickmarks);
        
        
    };

    // return the constructor function 
    return HtmlController;


})); // require 



            
