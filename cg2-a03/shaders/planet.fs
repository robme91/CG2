/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Fragment Phong Shader to be extended to a "Planet" shader.
 *
 * expects position and normal vectors in eye coordinates per vertex;
 * expects uniforms for ambient light, directional light, and phong material.
 * 
 *
 */

precision mediump float;

// position and normal in eye coordinates
varying vec4  ecPosition;
varying vec3  ecNormal;

// textures
varying vec2  texCoords;

// transformation matrices
uniform mat4  modelViewMatrix;
uniform mat4  projectionMatrix;

// Ambient Light
uniform vec3 ambientLight;

// Material
struct PhongMaterial {
    vec3  ambient;
    vec3  diffuse;
    vec3  specular;
    float shininess;
};
uniform PhongMaterial material;

// Light Source Data for a directional light
struct LightSource {

    int  type;
    vec3 direction;
    vec3 color;
    bool on;
    
} ;
uniform LightSource light;

//uniform for debugging
uniform bool isDebugOn;

//uniforms for textures
uniform sampler2D daylightTexture;
uniform sampler2D nightlightTexture;
uniform sampler2D cloudTexture;
uniform sampler2D waterTexture;
uniform bool isDayOn;
uniform bool isNightOn;
uniform bool isCloudOn;
uniform bool isRedGreenOn;
uniform bool isGlossMapOn;

/*

 Calculate surface color based on Phong illumination model.
 - pos:  position of point on surface, in eye coordinates
 - n:    surface normal at pos
 - v:    direction pointing towards the viewer, in eye coordinates
 + assuming directional light
 
 */
vec3 phong(vec3 pos, vec3 n, vec3 v, LightSource light, PhongMaterial material) {
    
    // Show land in green and water in red
    if(isRedGreenOn) {
        float waterheight = texture2D(waterTexture, texCoords).r;
        if (waterheight < 0.2) {
            return vec3(0.0, 1.0, 0.0); // green (land)
        } else {
            return vec3(1.0, 0.0, 0.0); // red (water)
        }
    }
    
    // debug mode with stripes of dark and bright
    float darkness = 1.0; 
    if(isDebugOn){
        if(mod(texCoords.s, 0.05) > 0.025)
            darkness = 0.5;
    }

    // back face towards viewer (looking at the earth from the inside)?
    float ndotv = dot(n,v);
    if(ndotv<0.0)
        return vec3(0,0,0);

    // vector from light to current point
    vec3 l = normalize(light.direction);
    
    // cos of angle between light and surface. 
    float ndotl = dot(n,-l);
    
    // the following calculation makes a smooth transition between the day 
    // and night texture possible (it is also used in the cloud transition calculation)
    // multiplier interpolates from 1.0 to 0.0 where ndotl is in range [0.0, 0.5]
    // ndotl < 0.0 results in multiplier being 1.0
    // ndotl > 0.5 results in multiplier being 0.0
    float clampedNdotL = clamp(ndotl, 0.0, 0.5);
    float multiplier = (0.0 - clampedNdotL + 0.5) * 2.0;

    // ambient part
    vec3 ambient;
    // check if texture or standart phong part shall be taken
    if(isNightOn) {
        //get texture colour
        vec3 nightlightColor = texture2D(nightlightTexture, texCoords).rgb;
        ambient = multiplier * nightlightColor * ambientLight * darkness;
    } else {
        ambient = material.ambient * ambientLight * darkness;
    }
    
    if(isCloudOn) {
        // apply the cloud texture to the ambient part (night side)
        vec3 cloudColor = texture2D(cloudTexture, texCoords).rgb;
        // the multiplier is taken into account to get a smooth transition
        ambient = mix(ambient, cloudColor * ambientLight * darkness * multiplier, cloudColor.r);
    }

    if(ndotl<=0.0) 
        return ambient; // shadow / facing away from the light source
    
    if(isDebugOn){
        if(ndotl <= 0.052)
            return vec3(0, 1, 0);
    }

    // diffuse contribution
    vec3 diffuse;
    // check if texture or standard phong should be taken
    if(isDayOn){
        //get texture colour
        vec3 daylightColor = texture2D(daylightTexture, texCoords).rgb * 1.5;
        diffuse = daylightColor * light.color * ndotl * darkness;
    } else {
        diffuse = material.diffuse * light.color * ndotl * darkness;
    }
     
    if(isCloudOn) {
        // apply the cloud texture to the diffuse part (day side)
        vec3 cloudColor = texture2D(cloudTexture, texCoords).rgb;
        diffuse = mix(diffuse, cloudColor * ndotl * 1.5, cloudColor.r);
    }
    
     // reflected light direction = perfect reflection direction
    vec3 r = reflect(l,n);
    
    // angle between reflection dir and viewing dir
    float rdotv = max( dot(r,v), 0.0);
    
    
    // specular contribution
    // make the specular highlights depend on the ground (land/water)
    float specularModifier = 1.0;
    if(isGlossMapOn) {
        float waterheight = texture2D(waterTexture, texCoords).r;
        if (waterheight < 0.2) {
             // land
            specularModifier = 0.3;
        }
    }
    
    vec3 specular = specularModifier * material.specular * light.color * pow(rdotv, material.shininess);
    
    // return sum of all contributions
    return ambient + diffuse + specular;
}

void main() {
    
    // normalize normal after projection
    vec3 normalEC = normalize(ecNormal);
    
    // do we use a perspective or an orthogonal projection matrix?
    bool usePerspective = projectionMatrix[2][3] != 0.0;
    
    // for perspective mode, the viewing direction (in eye coords) points
    // from the vertex to the origin (0,0,0) --> use -ecPosition as direction.
    // for orthogonal mode, the viewing direction is simply (0,0,1)
    vec3 viewdirEC = usePerspective? normalize(-ecPosition.xyz) : vec3(0,0,1);
    
    // calculate color using phong illumination
    vec3 color = phong( ecPosition.xyz, normalEC, viewdirEC,
                        light, material );

    gl_FragColor = vec4(color, 1.0);
    
}
