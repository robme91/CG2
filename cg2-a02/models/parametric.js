/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: ParametricSurface
 *
 * This function creates an object to draw any parametric surface.
 *
 */


/* requireJS module definition */
define(["vbo"], 
       (function(vbo) {
       
    "use strict";
    
    /* constructor for Parametric Surface objects
     * gl:  WebGL context object
     * posFunc: function taking two arguments (u,v) and returning coordinates [x,y,z]
     * config: configuration object defining attributes uMin, uMax, vMin, vMax, 
     *         and drawStyle (i.e. "points", "wireframe", or "surface")
     */ 
    var ParametricSurface = function(gl, posFunc, config) {
        window.console.log("ParametricSurface() constructor was called.");
        
        config = config || {};
        var uSegments     = config.uSegments || 40;
        var vSegments     = config.vSegments || 20;
        this.drawStyle   = config.drawStyle || "points";
        
        if (config.uMin > config.uMax)
            console.log("uMin must be greater than uMax");
        if (config.vMin > config.vMax)
            console.log("vMin must be greater than vMax");

        var uStep = (config.uMax - config.uMin) / uSegments;
        var vStep = (config.vMax - config.vMin) / vSegments;
        
        var coordinates = [];
        var solidIndices = [];
        var wireframeIndices = [];
        
        for (var uMul = 0; uMul <= uSegments; uMul++) {
            for (var vMul = 0; vMul <= vSegments; vMul++) {
                var u = config.uMin + uStep * uMul;
                var v = config.vMin + vStep * vMul;
                
                var position = posFunc(u, v);
                // IMPORTANT: push each float value separately!
                coordinates.push(position[0], position[1], position[2]);
                
                // create indices
                if ( uMul > 0 && vMul > 0) {
                    var indexA = coordinates.length / 3 - 1;
                    var indexB = indexA - 1;
                    var indexC = indexA - vSegments - 1;
                    var indexD = indexC - 1;
                    
                    solidIndices.push( indexC, indexB, indexA,
                                       indexC, indexD, indexB );
                    wireframeIndices.push( indexB, indexA,
                                           indexA, indexC,
                                           indexC, indexD,
                                           indexD, indexB);
                }
            }
        }
        
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coordinates 
                                                  } );

        this.solidIndexBuffer = new vbo.Indices(gl, { "indices": solidIndices } );
        this.wireframeIndexBuffer = new vbo.Indices(gl, { "indices": wireframeIndices } );
    };  

    // draw method: activate buffers and issue WebGL draw() method
    ParametricSurface.prototype.draw = function(gl,program) {
    
        // bind the attribute buffers
        program.use();
        this.coordsBuffer.bind(gl, program, "vertexPosition");
 
        // draw the vertices as points
        if(this.drawStyle == "points") {
            gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices()); 
        }
        else if(this.drawStyle == "surface") {                    
            // enable polygon offset for overlaying objects against z-fighting
            gl.enable(gl.POLYGON_OFFSET_FILL);
            gl.polygonOffset(1.0, 1.0);
            
            this.solidIndexBuffer.bind(gl);
            gl.drawElements(gl.TRIANGLES, this.solidIndexBuffer.numIndices(), gl.UNSIGNED_SHORT, 0 );
            
            gl.disable(gl.POLYGON_OFFSET_FILL);
        }
        else if(this.drawStyle == "wireframe") {
            this.wireframeIndexBuffer.bind(gl);
            gl.drawElements(gl.LINES, this.wireframeIndexBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        }
        else {
            window.console.log("Parametric Surface: draw style " + this.drawStyle + " not implemented.");
        }

    };
        
    // this module only returns the Band constructor function    
    return ParametricSurface;

})); // define

    
