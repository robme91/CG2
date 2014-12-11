/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: DirectionalLight
 *
 */


/* requireJS module definition */
define(["scene_node", "material"], 
       ( function(SceneNode, Material) {

    "use strict";
    
    // constant to define the type of light
    var LIGHT_DIRECTIONAL = 0;

    /* 
        DirectionalLight as a scene graph node
        
        Sets uniform variables in the shader to define 
        a directional light source. The draw() method 
        applies the SceneNode's transformation to the light
        direction and sets the associated uniform 
        variables in all affected materials.

        Parameters to the constructor:
        - uniformName: the name of the uniform struct variable to be used 
                       in the shader (default: "light")
        - config: a configuration object with the following optional parameters:
          - direction [3 floats]: direction in which the light is travelling
          - color [3 floats]: light color / intensities (RGB)
          - on [bool]: light on/off
        - materials: list of materials to which this light shall be applied.
        
        Key Methods:
        - draw(): sets the uniforms in the materials (does not call any draw command!)
    */
        
    var DirectionalLight = function(uniformName, config, materials) {

        config = config || {};
        this.uniformName = uniformName      || "light"
        this.direction   = config.direction || [-1,0,0];
        this.color       = config.color     || [1,1,1];
        this.on          = config.on        || true;
        this.materials   = materials || [];
        
    };

    // add an additional material to which this light shall be applied
    DirectionalLight.prototype.addMaterial = function(material) {
        this.materials.push(material);
    }
        
    /*
     * draw() method compatible to that of SceneNode. 
     * transforms light direction and sets all light uniforms in 
     * all associated materials
     */
    DirectionalLight.prototype.draw = function(gl, material, mvMatrix) {    
    
        // calculate the normal matrix
        var normalMatrix =  mat4.toInverseMat3(mvMatrix || mat4.identity());
        mat3.transpose(normalMatrix,normalMatrix);

        // transform light direction vector using normal matrix
        var dir = vec3.create(this.direction);
        mat3.multiplyVec3(normalMatrix,dir);

        // set uniforms for the program passed as an argument
        var setUniforms = function(material, name, on, dir, color) {
            material.setUniform(name + ".type",      "int",  LIGHT_DIRECTIONAL);
            material.setUniform(name + ".on",        "bool", on);
            material.setUniform(name + ".direction", "vec3", dir);
            material.setUniform(name + ".color",     "vec3", color);
        };
        
        // set this light in all relevant materials
        var name = this.uniformName;
        for(var m in this.materials)
            setUniforms(this.materials[m], name, this.on, dir, this.color);
    };
    
    // this module returns only the constructor function
    return DirectionalLight;

})); // define module
        

                                     
