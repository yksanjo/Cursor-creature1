// Fragment shader code
export const fragmentShader = `
uniform float u_time;
uniform vec2 u_resolution;

// Smooth minimum function for blending
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// Rotate 2D point
vec2 rotate2D(vec2 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(
        p.x * c - p.y * s,
        p.x * s + p.y * c
    );
}

// Distance to a ring/torus
float sdRing(vec2 p, float radius, float thickness) {
    float d = length(p) - radius;
    return abs(d) - thickness;
}

// Main distance field function
float map(vec2 p) {
    // Center and normalize coordinates
    vec2 uv = (p / u_resolution.xy) * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // Rotate coordinates for animation
    float angle = u_time * 0.5;
    uv = rotate2D(uv, angle);
    
    // Create multiple rings with different sizes
    float ring1 = sdRing(uv, 0.3, 0.05);
    float ring2 = sdRing(rotate2D(uv, u_time * 0.3), 0.5, 0.04);
    float ring3 = sdRing(rotate2D(uv, -u_time * 0.4), 0.2, 0.03);
    
    // Combine rings with smooth minimum
    float dist = smin(ring1, ring2, 0.1);
    dist = smin(dist, ring3, 0.1);
    
    return dist;
}

void main() {
    vec2 uv = gl_FragCoord.xy;
    
    // Calculate distance field
    float d = map(uv);
    
    // Create glow effect
    float glow = exp(-abs(d) * 15.0);
    float core = 1.0 - smoothstep(0.0, 0.02, abs(d));
    
    // Color based on distance and time
    vec3 color1 = vec3(0.2, 0.6, 1.0); // Blue
    vec3 color2 = vec3(1.0, 0.3, 0.6); // Pink
    vec3 color3 = vec3(0.4, 1.0, 0.6); // Green
    
    // Mix colors based on position and time
    float t = u_time * 0.3;
    vec2 pos = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
    float colorMix = sin(length(pos) * 3.0 + t) * 0.5 + 0.5;
    
    vec3 color = mix(color1, color2, colorMix);
    color = mix(color, color3, sin(t * 2.0) * 0.5 + 0.5);
    
    // Apply glow and core
    vec3 finalColor = color * (glow * 0.8 + core * 1.2);
    
    // Add some particle-like sparkles
    vec2 grid = floor(uv / 20.0);
    float random = fract(sin(dot(grid, vec2(12.9898, 78.233))) * 43758.5453);
    float sparkle = step(0.98, random) * step(abs(d), 0.1);
    finalColor += vec3(1.0, 1.0, 1.0) * sparkle * 0.5;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

