/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: SceneNode (WS 2013 edition)
 *
 * A SceneNode is a container for a transformation and a list of
 * <drawable object, GPU program>.
 *
 * The drawable objects can themselves be SceneNodes. This way 
 * hierarchical modeling is supported.
 *
 * The program and the transformation are optional. However when
 * it comes to a conrete model to be drawn, a actual program must
 * be specified so that the model's draw() method can do its task. 
 * 
 * Methods: see comments above each method header.
 *
*/


/* requireJS module definition */
define(["gl-matrix", "program"], 
       (function(dummy, Program) {

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
        // drawable object and a GUP program
        this.children = [];
        
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
     * Method: draw() 
     *
     * This method takes a model-view matrix and a program, both optional.
     * If a non-null program is specified, it overrides the programs 
     * specified for each individual child object.
     * 
     * It multiplies the provided matrix (or identity) with the node's 
     * transformation matrix (from the right side), sets the shader
     * variable "modelViewMatrix" to the resulting matrix, and then 
     * calls draw() of all its children recursively. 
     *
     * For each child, the method either takes the program provided as
     * an argument, or if that is undefined, the program provided for 
     * the respective child (see add()).
     * 
     */
    SceneNode.prototype.draw = function(gl, program, modelViewMatrix) {
    
        // window.console.log("drawing " + this.name);

        if(!gl) {
            throw "no WebGL context available in scene node " + this.name;
            return;
        };
    
        // copy  the matrix passed as a parameter, or identity if undefined
        var newMatrix = mat4.create(modelViewMatrix || mat4.identity());
        
        // multiply the local transformation from the right so it will be executed FIRST
        mat4.multiply(newMatrix, this.transformation);  

        // loop over all drawable objects and call their draw() methods
        for(var i in this.children) {
            var obj  = this.children[i].obj;
            var prog = program || this.children[i].prog;

            if(prog) {
                prog.use();
                prog.setUniform("modelViewMatrix", "mat4", newMatrix);
            }

            // call draw() method of the object
            obj.draw(gl, prog, newMatrix);
        };
        
    };
    
    /* 
     * Method: add() 
     *
     * Add a drawable object as a child to this node. 
     * If a program is specified, use that program to draw the specified child. 
     * 
     */
    SceneNode.prototype.add = function(object, program) {

        if(!object.draw) 
            throw "addObjects(): specified model has no draw() method.";
        if(program && !(program instanceof Program))
            throw "addObjects(): specified program is not of type Program.";

        this.children.push({"obj": object, "prog": program});

        if(object.name) 
            window.console.log("added " + object.name + " to node " + this.name + ".");
            
    };
    
    /*
     * remove drawable object from the SceneNode, recursively 
     */
    SceneNode.prototype.remove = function(object) {

        for(var i in this.drawableObjects) {
            if(this.children[i].obj == object) {
                this.children.splice(i,1);
                return;
            }
        }
        window.console.log("warning: SceneNode.remove(): object " + object + " not found.");
            
    };
    
    // this module only exports the constructor for SceneNode objects
    return SceneNode;

})); // define

    
