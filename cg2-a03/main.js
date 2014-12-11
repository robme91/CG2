/*
  *
 * Module main: Computergrafik 2, Aufgabe 3
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */

requirejs.config({
    paths: {
    
        // jquery library
        "jquery": [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'],
            
        // gl-matrix library
        "gl-matrix": "../lib/gl-matrix-1.3.7",

    }
});


/*
 * The function defined below is the "main" module,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 *
 */

/* requireJS module definition */
define(["jquery", "gl-matrix", "webgl-debug", "animation", "scene", "scene_explorer", "html_controller"], 
       (function($, glmatrix, WebGLDebugUtils, Animation, Scene, SceneExplorer, HtmlController ) {

    "use strict";


    var makeWebGLContext = function(canvas_name) {
    
        // get the canvas element to be used for drawing
        var canvas=$("#"+canvas_name).get(0);
        if(!canvas) { 
            throw "HTML element with id '"+canvas_name + "' not found"; 
            return null;
        };

        // get WebGL rendering context for canvas element
        var options = {alpha: true, depth: true, antialias:true};
        var gl = canvas.getContext("webgl", options) || 
                 canvas.getContext("experimental-webgl", options);
        if(!gl) {
            throw "could not create WebGL rendering context";
        };
        
        if(true) {
            // create a debugging wrapper of the context object
            var throwOnGLError = function(err, funcName, args) {
                throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
            };
            gl=WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
        }
        
        return gl;
    };
    
    $(document).ready( (function() {
    
        // get canvas and rendering context
        var gl = makeWebGLContext("drawing_area");
                                        
        // create scene, create animation, and draw once
        var scene = new Scene(gl);
        scene.draw();        

        // rotation of sun around the earth ;-)
        var animation = new Animation( (function(t,deltaT) {
        
            this.customSpeed = this.customSpeed || 10;
            var angle = deltaT/1000*this.customSpeed; 
            scene.rotate("sunLight",angle);
            scene.draw();
            
        }));

        // create HtmlController that takes care of all interaction
        // of HTML elements with the scene and the animation
        var controller = new HtmlController(scene,animation); 

        // create scene explorer handling all events for the canvas
        var explorer = new SceneExplorer(gl.canvas, true, scene);
        
    })); // $(document).ready()

    
    
})); // define module
        

