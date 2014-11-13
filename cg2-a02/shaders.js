/*
 * WebGL core teaching framework 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: shaders
 *
 * This module loads required shaders using the require.js text plugin, 
 * see https://github.com/requirejs/text 
 *
 */


/* requireJS module definition - this loads the shaders asynchronously! */
define(["text!shaders/vertex_color.vs", "text!shaders/vertex_color.fs",
        "text!shaders/unicolor.vs",     "text!shaders/unicolor.fs",
        "text!shaders/red.vs",          "text!shaders/red.fs"
       ], 
       (function( vs_vertex_color, fs_vertex_color,
                  vs_unicolor,     fs_unicolor,
                  vs_red,          fs_red
                 ) {

    "use strict";
    
    // store all shaders in an associative array
    var shaders = {}
    shaders["vertex_color"] = {vertex: vs_vertex_color, fragment: fs_vertex_color};
    shaders["unicolor"]     = {vertex: vs_unicolor,     fragment: fs_unicolor};
    shaders["red"]          = {vertex: vs_red,          fragment: fs_red};

    var mod = {};

    // return source code of a vertex shader
    mod.getVertexShader = function(shadername) {
      if(!shaders[shadername]) {
          throw "module shaders: unknown shader " + shadername;
      }
      if(!shaders[shadername].vertex) {
          throw "module shaders: no vertex shader for " + shadername;
      }
      return shaders[shadername].vertex;
    };
    
    // return source code of a shader
    mod.getFragmentShader = function(shadername) {
      if(!shaders[shadername]) {
          throw "module shaders: unknown shader " + shadername;
      }
      if(!shaders[shadername].fragment) {
          throw "module shaders: no fragment shader for " + shadername;
      }
      return shaders[shadername].fragment;
    };

    // module returns getter functions
    return mod;    
    
})); // define module
        

