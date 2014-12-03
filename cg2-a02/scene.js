/*
  *
 * Module scene: Computergrafik 2, Aufgabe 2
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* requireJS module definition */
define(["gl-matrix", "program", "shaders", "models/band", "models/triangle", "models/cube",
        "models/parametric", "models/robot"], 
       (function(glmatrix, Program, shaders, Band, Triangle, Cube, ParametricSurface, Robot ) {

    "use strict";
    
    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    var Scene = function(gl) {

        // store the WebGL rendering context 
        this.gl = gl;  
            
        // create all required GPU programs from vertex and fragment shaders
        this.programs = {};
        this.programs.red = new Program(gl, 
                                        shaders.getVertexShader("red"), 
                                        shaders.getFragmentShader("red") );
        this.programs.uni = new Program(gl, 
                                        shaders.getVertexShader("unicolor"), 
                                        shaders.getFragmentShader("unicolor") );
        this.programs.vertexColor = new Program(gl, 
                                                shaders.getVertexShader("vertex_color"), 
                                                shaders.getFragmentShader("vertex_color") );   


        
        // create some objects to be drawn in this scene
        this.triangle      = new Triangle(gl);
        this.cube          = new Cube(gl); 
        this.band          = new Band(gl, {height: 0.4, drawStyle: "surface"});
        this.wireframeBand = new Band(gl, {height: 0.4, drawStyle: "wireframe"});

        // create a parametric surface to be drawn in this scene
        var positionFunc = function(u,v) {
            return [ 0.5 * Math.sin(u) * Math.cos(v),
                     0.3 * Math.sin(u) * Math.sin(v),
                     0.9 * Math.cos(u) ];
        };
        var config = {
            "uMin": -Math.PI, 
            "uMax":  Math.PI, 
            "vMin": -Math.PI, 
            "vMax":  Math.PI, 
            "uSegments": 40,
            "vSegments": 20,
            drawStyle: "points"
        };
        this.ellipsoid = new ParametricSurface(gl, positionFunc, config);
        
        config.drawStyle = "surface";
        this.solidEllipsoid = new ParametricSurface(gl, positionFunc, config);
        
        config.drawStyle = "wireframe";
        this.wireframeEllipsoid = new ParametricSurface(gl, positionFunc, config);
        
        //create a Dini's Surface to be drawn in this scene (Math Function s. http://www.3d-meier.de/)
        var positionFuncDinis = function(u,v) {
            var a = 0.5;
            var b = 0.2;
            
            return [ a * Math.cos(u) * Math.sin(v),
                     a * Math.sin(u) * Math.sin(v),
                     a * (Math.cos(v) + Math.log(Math.tan(v / 2))) + b * u ];
        };
        var configDinis = {
            "uMin": 0, 
            "uMax": 4 * Math.PI, 
            "vMin": 0.01, 
            "vMax":  2, 
            "uSegments": 60,
            "vSegments": 40,
            drawStyle: "surface"
        };
        this.dinisSurface = new ParametricSurface(gl, positionFuncDinis, configDinis);
        
        configDinis.drawStyle = "wireframe";
        this.wireframeDinis = new ParametricSurface(gl, positionFuncDinis, configDinis);
        
        
        //create a Whitney Umbrella to be drawn in this scene (Math Function s. http://www.3d-meier.de/)
        var positionFuncUmbrella = function(u,v) {
            return [ u * v,
                         u,
                     v * v];
        };
        var configUmbrella = {
            "uMin": -1.5, 
            "uMax": 1.5, 
            "vMin": - 1.5, 
            "vMax":  1.5, 
            "uSegments": 60,
            "vSegments": 60,
            drawStyle: "surface"
        };
        this.umbrella = new ParametricSurface(gl, positionFuncUmbrella, configUmbrella);
        
        configUmbrella.drawStyle = "wireframe";
        this.wireframeUmbrella = new ParametricSurface(gl, positionFuncUmbrella, configUmbrella);
        
        // robot
        this.robot = new Robot(gl, this.programs); // TODO: draw style not defined. Is it nesseccary?

        // initial position of the camera
        this.cameraTransformation = mat4.lookAt([0,1,5], [0,0,0], [0,1,0]);

        // transformation of the scene, to be changed by animation
        this.transformation = mat4.create(this.cameraTransformation);

        // the scene has an attribute "drawOptions" that is used by 
        // the HtmlController. Each attribute in this.drawOptions 
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = { "Perspective Projection": true, 
                             "Show Triangle": false,
                             "Show Cube": false,
                             "Show Band": false,
                             "Show WireframeBand" : false,
                             "Show Ellipsoid": false,
                             "Show SolidEllipsoid": false,
                             "Show WireframeEllipsoid": false,
                             "Show Dinis" : false,
                             "Show WireframeDinis" : false,
                             "Show Umbrella" : false,
                             "Show WireframeUmbrella" : false,
                             "Show Robot": true
                             };
    };

    // the scene's draw method draws whatever the scene wants to draw
    Scene.prototype.draw = function() {
        
        // just a shortcut
        var gl = this.gl;

        
        
        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        var projection = this.drawOptions["Perspective Projection"] ?
                             mat4.perspective(45, aspectRatio, 0.01, 100) : 
                             mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);


        // set the uniform variables for all used programs
        for(var p in this.programs) {
            this.programs[p].use();
            this.programs[p].setUniform("projectionMatrix", "mat4", projection);
            this.programs[p].setUniform("modelViewMatrix", "mat4", this.transformation);
        }
        
        //UNI Program activate and set color
        this.programs.uni.use();
        this.programs.uni.setUniform("uniColor", "vec4", [0.0, 0.0, 0.0, 1.0]);
        
        
        // clear color and depth buffers
        gl.clearColor(0.7, 0.7, 0.7, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
            
        // set up depth test to discard occluded fragments
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);  
        
        // draw the scene objects
        if(this.drawOptions["Show Triangle"]) {    
            this.triangle.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Cube"]) {    
            this.cube.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Band"]) {    
            this.band.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show WireframeBand"]) {    
            this.wireframeBand.draw(gl, this.programs.uni);
        }
        if(this.drawOptions["Show Ellipsoid"]) {    
            this.ellipsoid.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show SolidEllipsoid"]) {    
            this.solidEllipsoid.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show WireframeEllipsoid"]) {    
            this.wireframeEllipsoid.draw(gl, this.programs.uni);
        }
        if(this.drawOptions["Show Dinis"]) {    
            this.dinisSurface.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show WireframeDinis"]) {    
            this.wireframeDinis.draw(gl, this.programs.uni);
        }
        if(this.drawOptions["Show Umbrella"]) {    
            this.umbrella.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show WireframeUmbrella"]) {    
            this.wireframeUmbrella.draw(gl, this.programs.uni);
        }
        if(this.drawOptions["Show Robot"]) {    
            this.robot.draw(gl, null, this.transformation);
        }
    };

    // the scene's rotate method is called from HtmlController, when certain
    // keyboard keys are pressed. Try Y and Shift-Y, for example.
    Scene.prototype.rotate = function(rotationAxis, angle) {

        // window.console.log("rotating around " + rotationAxis + " by " + angle + " degrees." );

        // degrees to radians
        angle = angle*Math.PI/180;
        
        // manipulate the corresponding matrix, depending on the name of the joint
        switch(rotationAxis) {
            case "worldY": 
                mat4.rotate(this.transformation, angle, [0,1,0]);
                break;
            case "worldX": 
                mat4.rotate(this.transformation, angle, [1,0,0]);
                break;
            default:
                window.console.log("axis " + rotationAxis + " not implemented.");
            break;
        };

        // redraw the scene
        this.draw();
    }

    return Scene;            
    
})); // define module
        

