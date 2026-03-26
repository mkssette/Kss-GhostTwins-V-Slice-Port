#pragma header

uniform float iTime;

float rand(vec2 uv)
{
    return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec2 size = openfl_TextureSize;
    if (size.x == 0.0) size.x = 1.0;
    if (size.y == 0.0) size.y = 1.0;

    vec2 uv = openfl_TextureCoordv;
    vec4 gameScreen = flixel_texture2D(bitmap, uv);

    float referenceHeight = 720.0;
    float scaleFactor = size.y / referenceHeight;
    float grainScale = 400.0 / scaleFactor; 
    
    float noise = rand(floor(uv * grainScale) + iTime);

    vec3 finalColor = gameScreen.rgb;
    
    finalColor = mix(finalColor, vec3(noise), 0.08);

    gl_FragColor = vec4(finalColor, gameScreen.a);
}