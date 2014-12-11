/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Cube
 *
 * The Cube is centered in the origin, all sides are axis-aligned, 
 * and each edge has length 1. 
 *
 *                   H              G
 *                   .--------------.
 *                  /              /|
 *                 / |            / |
 *                /              /  |
 *              D/   |         C/   |
 *    y         .--------------.    |
 *    |         |    |         |    |
 *    |         |    .- - - - -|----.
 *    |         |    E         |   /F
 *    0-----x   |  /           |  /
 *   /          |              | /
 *  /           |/             |/
 * z            .--------------.  
 *              A              B
 *
 *
 * We use a right-handed coordinate system with Z pointing towards the 
 * viewer. For example, vertex A (front bottom left) has the coordinates  
 * ( x = -0.5, y = -0.5, z = 0.5 ) . 
 *
 * The cube only consists of eight different vertex positions; however 
 * for various reasons (e.g. different normal directions) these vertices
 * are "cloned" for each face of the cube. There will be 3 instances
 * of each vertex, since each vertex belongs to three different faces.
 *
 */


/* requireJS module definition */
define(["vbo"], 
       (function(vbo) {
       
    "use strict";
    
    /*
     */
    var Cube = function(gl) {
    
        
        // this is a name for the user interface
        this.uiName = "Cube";
    
        window.console.log("Creating a unit Cube."); 
    
        // generate points and store in an array
        var coords = [ 
                       // front
                       -0.5, -0.5,  0.5,  // A: index 0
                        0.5, -0.5,  0.5,  // B: index 1
                        0.5,  0.5,  0.5,  // C: index 2
                       -0.5,  0.5,  0.5,  // D: index 3
                       
                       // back
                       -0.5, -0.5, -0.5,  // E: index 4
                        0.5, -0.5, -0.5,  // F: index 5
                        0.5,  0.5, -0.5,  // G: index 6
                       -0.5,  0.5, -0.5,  // H: index 7
                       
                       // left
                       -0.5, -0.5,  0.5,  // A': index 8
                       -0.5,  0.5,  0.5,  // D': index 9
                       -0.5,  0.5, -0.5,  // H': index 10
                       -0.5, -0.5, -0.5,  // E': index 11
                       
                       // right
                        0.5, -0.5,  0.5,  // B': index 12
                        0.5, -0.5, -0.5,  // F': index 13
                        0.5,  0.5, -0.5,  // G': index 14
                        0.5,  0.5,  0.5,  // C': index 15
                       
                       // top
                       -0.5,  0.5,  0.5,  // D'': index 16
                        0.5,  0.5,  0.5,  // C'': index 17
                        0.5,  0.5, -0.5,  // G'': index 18
                       -0.5,  0.5, -0.5,  // H'': index 19

                       // bottom
                       -0.5, -0.5,  0.5,  // A'': index 20
                       -0.5, -0.5, -0.5,  // E'': index 21
                        0.5, -0.5, -0.5,  // F'': index 22
                        0.5, -0.5,  0.5   // B'': index 23
                     ];
                                          
        // therer are 3 floats per vertex, so...
        this.numVertices = coords.length / 3;
        
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );

        // per-vertex colors and normal vectors
        var c = [ [1,0,0,1], [1,0,0,1], [0,1,0,1], [0,1,0,1], [0,0,1,1], [0,0,1,1] ];
        var n = [ [0,0,1], [0,0,-1], [-1,0,0], [1,0,0], [0,1,0], [0,-1,1] ];
        var colors = [];
        var normals = [];
        var texcoords = [];
        for(var i=0; i<6; i++) { // for each face
            for(var v=0; v<4; v++) { // for each vertex of that face 
                colors.push(c[i][0],c[i][1],c[i][2],c[i][3]); // one color per face
                normals.push(n[i][0],n[i][1],n[i][2]); // one normal per face
            };
            // for each vertex (four per face), push the same four (dummy) texture coordinates
            texcoords.push(0,0, 1,0, 1,1, 0,1);
        };
        
        // create vertex buffer object (VBO) for the colors
        this.colorBuffer = new vbo.Attribute(gl, { "numComponents": 4,
                                                   "dataType": gl.FLOAT,
                                                   "data": colors
                                                 } );

        // create vertex buffer object (VBO) for the normal vectors
        this.normalBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                   "dataType": gl.FLOAT,
                                                   "data": normals
                                                 } );
        
        // create vertex buffer object (VBO) for the normal vectors
        this.texcoordsBuffer = new vbo.Attribute(gl, { "numComponents": 2,
                                                   "dataType": gl.FLOAT,
                                                   "data": texcoords
                                                 } );

        // make an index buffer containing triples of vertex indices
        var triangles = [  0,  1,  2,  0,  2,  3, // front: ABC, ACD
                           6,  5,  4,  7,  6,  4, // back 
                           8,  9, 10,  8, 10, 11, // left
                          12, 13, 14, 12, 14, 15, // right
                          16, 17, 18, 16, 18, 19, // top   
                          20, 21, 22, 20, 22, 23  // bot
                        ];
        
        // create element buffer object (VBO) to connect the vertices by triangles
        this.triBuffer = new vbo.Indices(gl, { "indices": triangles } );
        
    };

    // draw method clears color buffer and optionall depth buffer
    Cube.prototype.draw = function(gl,material) {

        material.apply();
    
        // bind the attribute buffers
        var program = material.getProgram();
        this.coordsBuffer.bind(gl, program, "vertexPosition");
        this.colorBuffer.bind(gl, program, "vertexColor");
        this.normalBuffer.bind(gl, program, "vertexNormal");
        this.texcoordsBuffer.bind(gl, program, "vertexTexCoords");
        
        // bind the index buffer
        this.triBuffer.bind(gl);
        
        // draw the vertices as points
        gl.drawElements(gl.TRIANGLES, this.triBuffer.numIndices(), gl.UNSIGNED_SHORT, 0); 
         
    };
        
    // this module only returns the constructor function    
    return Cube;

})); // define

    
