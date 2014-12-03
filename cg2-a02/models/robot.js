//This is a model of a roboter

define(["scene_node", "gl-matrix", "models/band", "models/triangle", "models/cube",
        "models/parametric"], 
       (function(SceneNode, glMatrix, Band, Triangle, Cube, ParametricSurface) {
       
    "use strict";

    var Robot = function(gl, programs, config) {
        //create robot elements
        var cube = new Cube(gl);
        var solidBand = new Band(gl, {height: 1.0, radius: 0.5, drawStyle: "surface"});
        var wireframeBand = new Band(gl, {height: 1.0, radius: 0.5, drawStyle: "wireframe"});
 
        var ellipsoidPositionFunction = function(u,v) {
            return [ 0.5 * Math.sin(u) * Math.cos(v),
                     0.3 * Math.sin(u) * Math.sin(v),
                     0.9 * Math.cos(u) ];
        };
        
        var ellipsoidConfig = {
            "uMin": -Math.PI, 
            "uMax":  Math.PI, 
            "vMin": -Math.PI, 
            "vMax":  Math.PI, 
            "uSegments": 40,
            "vSegments": 20,
            drawStyle: "surface"
        };
        
        var solidEllipsoid = new ParametricSurface(gl, ellipsoidPositionFunction, ellipsoidConfig);
        
        //set sizes
        var torsoSize = [0.6, 1.0, 0.4];
        var neckSize = [0.25, 0.15, 0.2];
        var headSize = [0.5, 0.5, 0.3];
        var cylinderSize = [0.5, 0.5, 0.45];
        var footSize = [0.2, 0.2, 0.6];
        
        
        //Skelett
        this.torso = new SceneNode("torso");
        
        this.neck = new SceneNode("neck");
        mat4.translate(this.neck.transform(), [0, torsoSize[1]/2 + neckSize[1]/2, 0]);       
        this.torso.add(this.neck);
        
        this.head = new SceneNode("head");
        mat4.translate(this.head.transform(), [0, headSize[1]/2 + neckSize[1]/2, 0]);
        this.neck.add(this.head);
        
        this.cylinder = new SceneNode("cylinder");
        mat4.translate(this.cylinder.transform(), [0, headSize[1]/2 + cylinderSize[1]/4, 0]);
        this.head.add(this.cylinder);
        
        this.footLeft = new SceneNode("footLeft");
        mat4.translate(this.footLeft.transform(), [ footSize[0]/2 - torsoSize[0]/2  , -torsoSize[1]/2 - footSize[1]/2 , 0] );
        this.torso.add(this.footLeft);
        
        this.footRight = new SceneNode("footRight");
        mat4.translate(this.footRight.transform(), [ torsoSize[0]/2 - footSize[0]/2 , -torsoSize[1]/2 - footSize[1]/2 , 0] );
        this.torso.add(this.footRight);
        
        
        // Skin
        var torsoSkin = new SceneNode("torso skin");
        torsoSkin.add(cube, programs.vertexColor);
        mat4.scale(torsoSkin.transform(), torsoSize);
        
        var neckSkin = new SceneNode("neck skin");
        neckSkin.add(solidBand, programs.red);
        neckSkin.add(wireframeBand, programs.uni);
        mat4.scale(neckSkin.transform(), neckSize);
        
        var headSkin = new SceneNode("head skin");
        mat4.rotate(headSkin.transform(), Math.PI/2, [1, 0, 0]);
        mat4.scale(headSkin.transform(), headSize);
        headSkin.add(solidEllipsoid, programs.red);
        
        var cylinderSkin = new SceneNode("cylinder skin");
        mat4.scale(cylinderSkin.transform(), cylinderSize);
        cylinderSkin.add(solidBand, programs.uni);
        
        var footSkin = new SceneNode("foot skin");
        mat4.scale(footSkin.transform(), footSize);
        mat4.rotate(footSkin.transform(), Math.PI/2, [0, 0, 1]);
        footSkin.add(solidBand, programs.red);
        footSkin.add(wireframeBand, programs.uni);
        
        
        
        
        // Verbindung Skelett und Skin
        this.torso.add(torsoSkin);
        this.neck.add(neckSkin);
        this.head.add(headSkin);
        this.cylinder.add(cylinderSkin);
        this.footLeft.add(footSkin);
        this.footRight.add(footSkin);
    
    };
    
    Robot.prototype.draw = function(gl, program, transformation) {
        this.torso.draw(gl, program, transformation);
    };
    
    return Robot;
 }));