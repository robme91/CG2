//This is a model of a roboter

define(["scene_node", "gl-matrix", "models/band", "models/triangle", "models/cube",
        "models/parametric"], 
       (function(SceneNode, glMatrix, Band, Triangle, Cube, ParametricSurface) {
       
    "use strict";

    var Robot = function(gl, programs, config) {
        //create robot elements
        var cube = new Cube(gl);
        var triangle = new Triangle(gl);
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
            "uSegments": 20,
            "vSegments": 10,
            drawStyle: "surface"
        };
        
        var solidEllipsoid = new ParametricSurface(gl, ellipsoidPositionFunction, ellipsoidConfig);
        
        ellipsoidConfig.drawStyle = "wireframe";
        var wireframeEllipsoid = new ParametricSurface(gl, ellipsoidPositionFunction, ellipsoidConfig);
        
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
            "uSegments": 40,
            "vSegments": 20,
            drawStyle: "surface"
        };
        var surfaceDinis = new ParametricSurface(gl, positionFuncDinis, configDinis);
        
        configDinis.drawStyle = "wireframe";
        var wireframeDinis = new ParametricSurface(gl, positionFuncDinis, configDinis);
        
        //set sizes
        var torsoSize       = [0.4 , 1.0 , 0.6 ];
        var neckSize        = [0.25, 0.15, 0.2 ];
        var headSize        = [0.5 , 0.5 , 0.3 ];
        var eyeSize         = [0.2 , 0.25, 0.05];
        var beardSize       = [0.25, 0.25, 1.0 ];
        var cylinderSize    = [0.5 , 0.5 , 0.45];
        var cylinderRimSize = [0.65, 0.05, 0.6 ]; 
        var footSize        = [0.2 , 0.2 , 0.6 ];
        var jointSize       = [0.15, 0.2 , 0.2 ]; // haha
        var armSize         = [0.35, 0.3 , 0.2 ];
        var flowerSize      = [0.7 , 0.3 , 0.7 ];
        
        
        // Skelett
        // torso, neck, head, eye, beard
        this.torso = new SceneNode("torso");
        
        this.neck = new SceneNode("neck");
        mat4.translate(this.neck.transform(), [0, torsoSize[1]/2 + neckSize[1]/2, 0]);       
        this.torso.add(this.neck);
        
        this.head = new SceneNode("head");
        mat4.translate(this.head.transform(), [0, headSize[1]/2 + neckSize[1]/2, 0]);
        this.neck.add(this.head);
        
        this.eye = new SceneNode("eye");
        mat4.translate(this.eye.transform(), [0, eyeSize[1]/4, headSize[2]/2]);
        this.head.add(this.eye);
        
        this.beard = new SceneNode("beard");
        mat4.translate(this.beard.transform(), [0, -beardSize[1]/2 * 1.7, headSize[2]/2]);
        this.head.add(this.beard);
        
        // feet
        this.footLeft = new SceneNode("footLeft");
        mat4.translate(this.footLeft.transform(), [ torsoSize[2]/2 - footSize[0]/2, -torsoSize[1]/2 - footSize[1]/2 , 0] );
        this.torso.add(this.footLeft);
        
        this.footRight = new SceneNode("footRight");
        mat4.translate(this.footRight.transform(), [ footSize[0]/2 - torsoSize[2]/2, -torsoSize[1]/2 - footSize[1]/2 , 0] );
        this.torso.add(this.footRight);
        
        // left arm, cylinder
        this.shoulderLeft = new SceneNode("shoulderLeft");
        mat4.translate(this.shoulderLeft.transform(), [ torsoSize[2]/2 + jointSize[0]/2, torsoSize[1]/2 - jointSize[1]/2, 0] );
        mat4.rotateZ(this.shoulderLeft.transform(), Math.PI / 4 + 0.05);
        this.torso.add(this.shoulderLeft);  
        
        this.armLeft = new SceneNode("armLeft");
        mat4.translate(this.armLeft.transform(), [ jointSize[0]/2 + armSize[0]/2, 0, 0 ] );
        this.shoulderLeft.add(this.armLeft);
        
        this.elbowLeft = new SceneNode("elbowLeft");
        mat4.translate(this.elbowLeft.transform(), [ armSize[0]/2 + jointSize[0]/2, 0, 0 ] );
        mat4.rotateZ(this.elbowLeft.transform(), Math.PI / 2);
        this.armLeft.add(this.elbowLeft);
        
        this.foreArmLeft = new SceneNode("foreArmLeft");
        mat4.translate(this.foreArmLeft.transform(), [armSize[0]/2 + jointSize[0]/2, 0, 0]);
        this.elbowLeft.add(this.foreArmLeft);
        
        this.wristLeft = new SceneNode("wristLeft");
        mat4.translate(this.wristLeft.transform(), [ armSize[0]/2 + jointSize[0]/2, 0, 0]);
        mat4.rotateZ(this.wristLeft.transform(), 0.65);
        this.foreArmLeft.add(this.wristLeft);
        
        this.cylinder = new SceneNode("cylinder");
        mat4.translate(this.cylinder.transform(), [cylinderSize[0]/2 + jointSize[0]/2, -cylinderSize[1]/2, 0]);
        this.wristLeft.add(this.cylinder);
        
        this.cylinderRim = new SceneNode("cylinder rim");
        mat4.translate(this.cylinderRim.transform(), [0, cylinderSize[1]/2 - cylinderRimSize[1]/2, 0]);
        this.cylinder.add(this.cylinderRim);
        
        // right arm, flower
        this.shoulderRight = new SceneNode("shoulderRight");
        mat4.translate(this.shoulderRight.transform(), [ -torsoSize[2]/2 - jointSize[0]/2, torsoSize[1]/2 - jointSize[1]/2, 0] );
        mat4.rotateZ(this.shoulderRight.transform(), Math.PI / 3);
        this.torso.add(this.shoulderRight);
        
        this.armRight = new SceneNode("armRight");
        mat4.translate(this.armRight.transform(), [ -jointSize[0]/2 - armSize[0]/2, 0, 0 ] );
        this.shoulderRight.add(this.armRight);
        
        this.elbowRight = new SceneNode("elbowRight");
        mat4.translate(this.elbowRight.transform(), [ -armSize[0]/2 - jointSize[0]/2, 0, 0 ] );
        mat4.rotateZ(this.elbowRight.transform(), -Math.PI / 3);
        mat4.rotateY(this.elbowRight.transform(), Math.PI / 2);
        this.armRight.add(this.elbowRight);
        
        this.foreArmRight = new SceneNode("foreArmRight");
        mat4.translate(this.foreArmRight.transform(), [-armSize[0]/2 - jointSize[0]/2, 0, 0]);
        this.elbowRight.add(this.foreArmRight);
        
        this.wristRight = new SceneNode("wristRight");
        mat4.translate(this.wristRight.transform(), [ -armSize[0]/2 - jointSize[0]/2, 0, 0]);
        this.foreArmRight.add(this.wristRight);
        
        this.flower = new SceneNode("flower");
        mat4.translate(this.flower.transform(), [-jointSize[0]/2, flowerSize[1] * 2 , 0]);
        this.wristRight.add(this.flower);
        
        
        // Skin
        var torsoSkin = new SceneNode("torso skin");
        mat4.rotateY(torsoSkin.transform(), Math.PI/2);
        mat4.scale(torsoSkin.transform(), torsoSize);
        torsoSkin.add(cube, programs.vertexColor);
        
        var neckSkin = new SceneNode("neck skin");
        neckSkin.add(solidBand, programs.red);
        neckSkin.add(wireframeBand, programs.uni);
        mat4.scale(neckSkin.transform(), neckSize);
        
        var headSkin = new SceneNode("head skin");
        mat4.rotate(headSkin.transform(), Math.PI/2, [1, 0, 0]);
        mat4.scale(headSkin.transform(), headSize);
        headSkin.add(solidEllipsoid, programs.red);
        
        var eyeSkin = new SceneNode("eye skin");
        mat4.rotateY(eyeSkin.transform(), 0.4);
        mat4.scale(eyeSkin.transform(), eyeSize);
        eyeSkin.add(solidEllipsoid, programs.red);
        eyeSkin.add(wireframeEllipsoid, programs.uni);
        
        var beardSkin = new SceneNode("beard skin");
        mat4.rotateZ(beardSkin.transform(), Math.PI);
        mat4.scale(beardSkin.transform(), beardSize);
        beardSkin.add(triangle, programs.vertexColor);
        
        var footSkin = new SceneNode("foot skin");
        mat4.scale(footSkin.transform(), footSize);
        mat4.rotate(footSkin.transform(), Math.PI/2, [0, 0, 1]);
        footSkin.add(solidBand, programs.red);
        footSkin.add(wireframeBand, programs.uni);
        
        var jointSkin = new SceneNode("joint skin");
        mat4.scale(jointSkin.transform(), jointSize);
        mat4.rotate(jointSkin.transform(), Math.PI/2, [0, 0, 1]);        
        jointSkin.add(solidBand, programs.uni);
        
        var armSkin = new SceneNode("arm skin");
        mat4.scale(armSkin.transform(), armSize);
        mat4.rotate(armSkin.transform(), Math.PI/2, [0, 1, 0]);
        armSkin.add(solidEllipsoid, programs.red);
        armSkin.add(wireframeEllipsoid, programs.uni);
        
        var cylinderSkin = new SceneNode("cylinder skin");
        mat4.scale(cylinderSkin.transform(), cylinderSize);
        cylinderSkin.add(solidBand, programs.uni);
        
        var cylinderRimSkin = new SceneNode("cylinder rim skin");
        mat4.scale(cylinderRimSkin.transform(), cylinderRimSize);
        cylinderRimSkin.add(solidBand, programs.uni);
        
        var flowerSkin = new SceneNode("flower skin");
        mat4.scale(flowerSkin.transform(), flowerSize);
        mat4.rotateX(flowerSkin.transform(), -Math.PI/2);
        flowerSkin.add(surfaceDinis, programs.red);
        flowerSkin.add(wireframeDinis, programs.uni);
        
        
        // Verbindung Skelett und Skin
        this.torso.add(torsoSkin);
        this.neck.add(neckSkin);
        this.head.add(headSkin);
        this.eye.add(eyeSkin);
        this.beard.add(beardSkin);
        this.footLeft.add(footSkin);
        this.footRight.add(footSkin);
        this.shoulderLeft.add(jointSkin);
        this.armLeft.add(armSkin);
        this.elbowLeft.add(jointSkin);
        this.foreArmLeft.add(armSkin);
        this.wristLeft.add(jointSkin);
        this.cylinder.add(cylinderSkin);
        this.cylinderRim.add(cylinderRimSkin);
        this.shoulderRight.add(jointSkin);
        this.armRight.add(armSkin);
        this.elbowRight.add(jointSkin);
        this.foreArmRight.add(armSkin);
        this.wristRight.add(jointSkin);
        this.flower.add(flowerSkin);
    
    };
    
    Robot.prototype.draw = function(gl, program, transformation) {
        this.torso.draw(gl, program, transformation);
    };
    
    Robot.prototype.rotate = function(rotationAxis, angle) {
        // manipulate the corresponding matrix, depending on the name of the joint
        switch(rotationAxis) {
            case "flower":
                mat4.rotate(this.wristRight.transformation, angle, [0, 1, 0]);
                break; 
            case "cylinder":
                mat4.rotate(this.shoulderLeft.transformation, angle, [0, 0, 1]);
                break;
            case "eye":
                mat4.rotate(this.eye.transformation, angle, [0, 1, 0]);
                break;
            default:
                window.console.log("axis " + rotationAxis + " not implemented.");
            break;
        };
    }
    
    return Robot;
 }));