#pragma header

uniform float iTime;
uniform vec2 uScroll;
uniform float uZoom;

float rand(vec2 co){
    return fract(sin(dot(mod(co, vec2(1000.0)).xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
    vec2 uv = openfl_TextureCoordv;
    vec4 gameColor = flixel_texture2D(bitmap, uv);
    

    vec2 wpos = (uv * openfl_TextureSize) / uZoom + (uScroll * 0.4);
    
    vec2 stBase = wpos / 45.0;
    
    vec3 acc = vec3(0.0); 

    for (float i = 1.0; i <= 4.0; i++) 
    {
        float currentScale = i * 0.8;
        
        vec2 st = stBase * currentScale;
        
        st.y -= iTime * (1.5 + (1.0/i));
        st.x += sin(st.y + iTime * 0.5) * 0.05;

        vec2 ipos = floor(st);
        vec2 fpos = fract(st); 

        float n = rand(ipos);
        
        if (n > 0.96) {
            vec2 center = vec2(0.5);
            float dist = distance(fpos, center);
            
            float flake = 1.0 - smoothstep(0.1, 0.15, dist);
            
            acc += vec3(flake) * (1.0 / i);
        }
    }

    float dist = distance(uv, vec2(0.5));
    float frostIntensity = smoothstep(0.6, 1.0, dist);
    float noise = rand(uv * 100.0 + iTime * 0.1);
    vec3 frostLayer = vec3(0.8, 0.9, 1.0) * frostIntensity * noise * 0.2;

    vec3 finalColor = gameColor.rgb + acc + frostLayer;
    
    gl_FragColor = vec4(finalColor, gameColor.a);
}