/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Material (WS 2013 edition)
 *
 * This module defines a generic Material object for shading.
 * A material consists of a Program object and an array of uniform variables
 * that are "cached" in the Material. Calling Material.apply() will actually 
 * set the uniforms in the associated Program object.
 *
 * This way it is easy to use one Program object with different parameters, 
 * since in terms of OpenGL performance changing uniforms is considered cheap 
 * but changing programs is considered expensive.
 *
 */


/* requireJS module definition */
define(["program"], 
       ( function(Program) {

    "use strict";

    /*
     * Material constructor requires a name (for debugging / UI purposes) 
     * and a Program object 
     */
    var Material = function(name, program) {

        this.name = name || "undefined";

        if(!program)
            throw "Material: program must be provided";
        if(! program instanceof Program) 
            throw "Material: not a valid Program object";

        this.program = program;
        this.uniforms = []; 

    };

    /*
     * setUniform() stores the name, type, and value of a uniform 
     * in the Material object, and does not yet modify the associated
     * Program object (see apply()).
     */
    Material.prototype.setUniform = function(name, type, value) {
        this.uniforms[name] = [type, value];
    };

    /* 
     * apply() sets all the store uniform variables in the associated
     * Program object.
     */
    Material.prototype.apply = function() {

        this.program.use();
        for(var u in this.uniforms) {
            var uval = this.uniforms[u];
            this.program.setUniform( u, uval[0], uval[1] );
        }
    };

    /*
     * getProgram() returns the associated Program object
     * which is required to always exist.
     */
    Material.prototype.getProgram = function() {
        return this.program;
    }

    // this module only returns the Material constructor function 
    return Material;

})); // define module
        

                                     
