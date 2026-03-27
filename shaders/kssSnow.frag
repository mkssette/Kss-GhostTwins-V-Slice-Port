#pragma header

uniform float iTime;
uniform vec2 uScroll;
uniform float uZoom;
uniform vec2 iResolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
    vec2 uv = openfl_TextureCoordv;
    vec4 gameColor = flixel_texture2D(bitmap, uv);
    
    vec2 pixelPos = uv * openfl_TextureSize;
    
    vec3 snowColor = vec3(0.0); 

    for (float i = 1.0; i <= 3.0; i++) 
    {
        float parallax = 0.2 + (i * 0.2);
        
        vec2 layerPos = (pixelPos / uZoom) + (uScroll * parallax);
        
        float cellSize = 20.0 + (i * 15.0);
        vec2 st = layerPos / cellSize;
        
        float fallSpeed = 0.9 + (i * 0.2);
        
        st.y -= iTime * fallSpeed;
        
        float sway = sin(iTime * 0.8 + st.y * 0.5) * 0.25 + cos(iTime * 1.3 + st.y * 0.3) * 0.2;
st.x += sway;

        vec2 ipos = floor(st);
        vec2 fpos = fract(st);

        float n = rand(ipos);
        
        if (n > 0.85) {
            vec2 center = vec2(0.5) + (vec2(rand(ipos + 1.0), rand(ipos + 2.0)) - 0.5) * 0.5;
            
            float dist = distance(fpos, center);
            
            float flake = smoothstep(0.10, 0.09, dist);
            
            snowColor += vec3(flake) * (0.25 * i);
        }
    }

    float distCenter = distance(uv, vec2(0.5));
    vec3 coldTint = vec3(0.7, 0.8, 1.0);
    float vignette = smoothstep(0.4, 1.2, distCenter) * 0.15;
    vec3 finalColor = gameColor.rgb + snowColor + (coldTint * vignette);
    
    gl_FragColor = vec4(finalColor, gameColor.a);
}
