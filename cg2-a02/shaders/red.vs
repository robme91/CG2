/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Vertex Shader: "red" - only transforms vertex position, 
 *                color will be assigned in fragment shader
 *
 * the vertex position is transformed by modelViewMatrix and
 * projectionMatrix; vertexColor is "passed through" to the 
 * fragment shader using a varying variable named fragColor.
 *
 */


 attribute vec3 vertexPosition;
 uniform mat4 modelViewMatrix;
 uniform mat4 projectionMatrix;
 
 void main() {

 	gl_PointSize = 6.0;
 	gl_Position = projectionMatrix * modelViewMatrix * 
 				  vec4(vertexPosition,1.0);

 } 
 