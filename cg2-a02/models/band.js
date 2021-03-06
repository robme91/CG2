/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Band
 *
 * The Band is made of two circles using the specified radius.
 * One circle is at y = height/2 and the other is at y = -height/2.
 *
 */


/* requireJS module definition */
define(["vbo"], 
       (function(vbo) {
       
    "use strict";
    
    /* constructor for Band objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         radius: radius of the band in X-Z plane)
     *         height: height of the band in Y
     *         segments: number of linear segments for approximating the shape
     *         asWireframe: whether to draw the band as triangles or wireframe
     *                      (not implemented yet)
     */ 
    var Band = function(gl, config) {
    
        // read the configuration parameters
        config = config || {};
        var radius       = config.radius   || 1.0;
        var height       = config.height   || 0.1;
        var segments     = config.segments || 20;
        this.drawStyle   = config.drawStyle || "points";
        
        window.console.log("Creating a Band with radius="+radius+", height="+height+", segments="+segments ); 
    
        // generate vertex coordinates and store in an array
        var coords = [];

        for(var i=0; i<=segments; i++) {
        
            // X and Z coordinates are on a circle around the origin
            var t = (i/segments)*Math.PI*2;
            var x = Math.sin(t) * radius;
            var z = Math.cos(t) * radius;
            // Y coordinates are simply -height/2 and +height/2 
            var y0 = height/2;
            var y1 = -height/2;
            
            // add two points for each position on the circle
            // IMPORTANT: push each float value separately!
            coords.push(x,y0,z);
            coords.push(x,y1,z);
        };  
        
        
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );
      
        //fill the indices for solid band
        var solidIndices = [];
        var length = segments * 2 - 1;
        for(var i = 0; i <= length; i++){
            solidIndices.push(i);
            solidIndices.push(i + 1);
            solidIndices.push(i + 2);
        }
        solidIndices.push(1);
        

        //create vbo for the solid indices
        this.solidIndexBuffer = new vbo.Indices(gl, { "indices": solidIndices } );

        //fill the indices for wireframe band
        var wireframeIndices = [];
        var lengthWire = segments * 2;
        for (var i = 0; i < lengthWire; i += 2) {
            wireframeIndices.push(i);
            wireframeIndices.push(i + 1);
            wireframeIndices.push(i);
            wireframeIndices.push(i + 2);
            wireframeIndices.push(i + 1);
            wireframeIndices.push(i + 3);
        }
        
        this.wireFrameIndexBuffer = new vbo.Indices(gl, { "indices": wireframeIndices } );

    };

    // draw method: activate buffers and issue WebGL draw() method
    Band.prototype.draw = function(gl,program) {
    
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
            gl.drawElements(gl.TRIANGLES, this.solidIndexBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
            
            gl.disable(gl.POLYGON_OFFSET_FILL);
        } 
        else if(this.drawStyle == "wireframe") {
            this.wireFrameIndexBuffer.bind(gl);
            gl.drawElements(gl.LINES, this.wireFrameIndexBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        } 
        else {
            window.console.log("Band: draw style " + this.drawStyle + " not implemented.");
        }
         
    };
        
    // this module only returns the Band constructor function    
    return Band;

})); // define

    
