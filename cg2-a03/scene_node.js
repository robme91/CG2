/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: SceneNode (WS 2013a3 edition)
 *
 * A SceneNode is a container for a transformation and a list of
 * pairs <drawable object, Material>.
 *
 * The drawable objects can themselves be SceneNodes. This way 
 * hierarchical modeling is supported.
 *
 * The Material and the transformation are optional. However when
 * it comes to a conrete model to be drawn, an actual Material must
 * be specified so that the model's draw() method can work. 
 * 
 * Methods: see comments above each method header.
 *
*/


/* requireJS module definition */
define(["gl-matrix", "material"], 
       (function(dummy, Material) {

    "use strict";
    
    /* 
     * SceneNode constructor
     * 
     * Only takes a name for debugging / UI output purposes
     *  
     */ 
    var SceneNode = function(name) {
    
        // optional name for UI / debugging
        this.name = name || "<no name>";
        
        // optional transformation for this node
        this.transformation  = mat4.identity();
        
        // list of children. each child is an object sholding a 
        // drawable object and a Material object
        this.children = [];
        
        // flag to show/hide nodes (including their children)
        this.visible = true;
    };
    
    /*
     * Method: transform() 
     *
     * returns a reference to the node's transformation matrix for direct manipulation
     *
     */
    SceneNode.prototype.transform = function() {
        return this.transformation;
    }

    /*
     * Method: setVisible(bool) 
     * Enables/disables rendering of this node and its children
     *
     */
    SceneNode.prototype.setVisible = function(flag) {
        this.visible = flag;
    }

    /*
     * Method: draw() 
     *
     * This method takes a model-view matrix and a Material, both optional.
     * If a non-null Material is specified, it overrides the programs 
     * specified for each individual child object.
     * 
     * It multiplies the provided matrix (or identity) with the node's 
     * transformation matrix (from the right side), sets the shader
     * variable "modelViewMatrix" to the resulting matrix, and then 
     * calls draw() of all its children recursively. 
     *
     * For each child, the method either takes the Material provided as
     * an argument, or if that is undefined, the Material provided for 
     * the respective child (see add()).
     * 
     */
    SceneNode.prototype.draw = function(gl, material, modelViewMatrix) {
    
        // window.console.log("drawing " + this.name);

        if(!this.visible)
            return;

        if(!gl) {
            throw "no WebGL context available in scene node " + this.name;
            return;
        };
    
        // copy  the matrix passed as a parameter, or identity if undefined
        var newMatrix = mat4.create(modelViewMatrix || mat4.identity());
        
        // multiply the local transformation from the right so it will be executed FIRST
        mat4.multiply(newMatrix, this.transformation);  

        // calculate the normal matrix
        var normalMatrix =  mat4.toInverseMat3(newMatrix);
        mat3.transpose(normalMatrix,normalMatrix);

        // loop over all drawable objects and call their draw() methods
        for(var i in this.children) {
            var obj = this.children[i].obj;
            var mat = material || this.children[i].mat;

            // before drawing each child, set the transformation matrices
            if(mat) {
                mat.setUniform("modelViewMatrix", "mat4", newMatrix);
                mat.setUniform("normalMatrix", "mat3", normalMatrix);
            }

            // call draw() method of the object
            obj.draw(gl, mat, newMatrix);
        };
    };
    
    /* 
     * Method: add() 
     *
     * Add a drawable object as a child to this node. 
     * If a program is specified, use that program to draw the specified child. 
     * 
     */
    SceneNode.prototype.add = function(object, material) {

        if(!object.draw) 
            throw "addObjects(): specified model has no draw() method.";
        if(material && !(material instanceof Material))
            throw "addObjects(): specified material is not of type Material.";

        this.children.push({"obj": object, "mat": material});
            
    };
        
    // this module only exports the constructor for SceneNode objects
    return SceneNode;

})); // define

    
