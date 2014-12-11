/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * HtmlController takes care of the interaction of HTML elements
 * with the scene object and the animation object. 
 *
 */

 
/* requireJS module definition */
define(["jquery"], 
       (function($) {

    "use strict"; 
                
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining scene, animation, etc.
     *
     * parameters:
     * - the scene object (to modify scene.drawOptions, etc.)
     * - the animation object (to control on/off and speed)
     *
     *
     * For the definition of scene and animation, see documentation of 
     * the respective modules in the framework.
     *
     * The last parameter, keyMap, is on optional object defining 
     * which pressed key is mapped to which rotation axis and to 
     * which rotation angle. See constructor for an example.
     * The axis and rotation angle will be passed to the function
     * scene.rotate() if it exists.
     *
     */
    var HtmlController = function(scene,animation,keyMap) {

        // default key map: only world X and Y axes are defined
        keyMap = keyMap || {
             'x': {axis: "worldX", angle:  5.0}, 
             'X': {axis: "worldX", angle: -5.0}, 
             'y': {axis: "worldY", angle:  5.0}, 
             'Y': {axis: "worldY", angle: -5.0},
             's': {axis: "sunLight", angle: 2.0},
             'S': {axis: "sunLight", angle: -2.0}
        };

        // internal function: turn a draw option name into a valid HTML element ID
        var drawOptionId = function(name) {
            return "drawOpt_"+name.replace(/\ /g, "_");
        }

        // event handler for changes in HTML input elements
        var updateParams = function() {
        
            // toggle animation on/off
            if( $("#anim_Toggle").attr("checked") == undefined ) {
                animation.stop();
            } else {
                animation.resume();
            };

            // set animation speed
            animation.customSpeed = parseFloat($("#anim_Speed").attr("value"));
            
            // modify the drawOptions attribute depending on checkboxes
            for(var o in scene.drawOptions) {
                var element_selector = "#"+drawOptionId(o);
                scene.drawOptions[o] = $(element_selector).attr("checked") == "checked"? true : false;
            };
            
            // in case the animation is not playing, redraw the scene
            scene.draw();
            
        };
        
        // set initial values for the input elements
        $("#anim_Toggle").attr("checked", undefined);
        $("#anim_Speed").attr("value", 20);
        
        // create one input element for each attribute in scene.drawOptions
        for(var o in scene.drawOptions) {
            
            // put together valid HTML code for a new table row 
            var newRow = '<tr><td>'+o+'</td>'+
                         '<td><input id="'+drawOptionId(o)+'" type="checkbox" class="inputParam"></input></td></tr>\n';
                         
            // insert HTML code after the last table row so far.
            $('#param_table tr:last').after(newRow);
            
            // set the checkbox value depending on drawOptions value
            if(scene.drawOptions[o] == true) {
                $("#"+drawOptionId(o)).attr("checked","checked");

            };
        };
        
        // set up event handler and execute it once so everything is set consistently
        $(".inputParam").change( updateParams ); 
        updateParams();

        // translate key press events to strings and call scene.rotate
        $(document).keypress((function(event) {

            var keycode = event.which;
            var character = String.fromCharCode(keycode);
            // window.console.log("key number " + keycode + ", character '" + character + "' pressed");

            // determine which axis and angle to use
            var mapped = keyMap[character]; 
            if(scene.rotate && mapped) {
                scene.rotate(mapped.axis, mapped.angle);
            }
        }));

        
    }; // end of HtmlController constructor function

    // return the constructor function 
    return HtmlController;


})); // require 



            
