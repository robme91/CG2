/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Fragment Shader: "uniform_color" - expects the color to be specified
 *					in a uniform vec4 variable called "uniColor".
 *
 * This shader expects a varying variable fragColor to contain the color
 * to be used for rendering the fragment.
 *
 */


precision mediump float;

uniform vec4 uniColor;

void main() {
    gl_FragColor = uniColor;
} 
 