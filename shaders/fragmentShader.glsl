precision mediump float;

// Combined: Original Ring Design + Universe Theme
// Features: Beautiful glowing rings with starfield and nebula background

uniform float u_time;
uniform vec2 u_resolution;

// Fader uniforms
uniform float u_radius;
uniform float u_glow_intensity;
uniform float u_speed;

// Additional controls
uniform float u_color_shift;
uniform float u_ring_count;
uniform float u_noise_amount;

// Food particle system uniforms
uniform float u_hunger;
uniform vec2 u_food_positions[50];
uniform float u_food_active[50];
uniform float u_food_scale[50];
uniform int u_food_count;

// Burst particle system uniforms
uniform vec2 u_burst_positions[100];
uniform float u_burst_active[100];
uniform vec3 u_burst_colors[100];
uniform int u_burst_count;

// Ring positions (dynamic, for movement)
uniform vec2 u_ring_positions[5];

varying vec2 vUv;

#define PI 3.14159265359

// Smooth minimum function for blending shapes
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// 2D Rotation
vec2 rotate2D(vec2 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(
        p.x * c - p.y * s,
        p.x * s + p.y * c
    );
}

// Random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Value noise
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Generate a star
float star(vec2 uv, vec2 starPos, float size, float brightness) {
    vec2 dist = uv - starPos;
    float d = length(dist);
    
    // Star core
    float core = 1.0 - smoothstep(0.0, size * 0.3, d);
    
    // Star glow
    float glow = exp(-d * d / (size * size * 0.1)) * brightness;
    
    // Star spikes (cross pattern)
    float angle = atan(dist.y, dist.x);
    float spikes = abs(sin(angle * 4.0)) * 0.3;
    spikes *= exp(-d * 2.0);
    
    return core + glow + spikes;
}

// Generate starfield background
float starfield(vec2 uv, float speed) {
    float stars = 0.0;
    
    // Multiple layers of stars for depth
    for (float i = 0.0; i < 3.0; i += 1.0) {
        float layer = i + 1.0;
        float layerSpeed = speed * (0.1 + layer * 0.1); // Subtle parallax
        float layerScale = 0.8 + layer * 0.2;
        
        vec2 starUV = uv * layerScale;
        starUV += vec2(u_time * layerSpeed * 0.1, u_time * layerSpeed * 0.15);
        
        // Create grid of potential star positions
        vec2 grid = floor(starUV * 12.0);
        vec2 gridUV = fract(starUV * 12.0) - 0.5;
        
        // Random star position in each cell
        vec2 starOffset = vec2(
            random(grid + vec2(0.0, 0.0)) - 0.5,
            random(grid + vec2(1.0, 0.0)) - 0.5
        ) * 0.8;
        
        vec2 starPos = gridUV + starOffset;
        
        // Random star properties
        float starSize = random(grid + vec2(2.0, 0.0)) * 0.015 + 0.003;
        float starBrightness = random(grid + vec2(3.0, 0.0));
        
        // Only show bright stars
        if (starBrightness > 0.75) {
            float starValue = star(starPos, vec2(0.0), starSize, starBrightness);
            stars += starValue * (1.0 / layer); // Dimmer stars in background
        }
    }
    
    return stars;
}

// Nebula clouds (subtle background)
vec3 nebula(vec2 uv) {
    vec2 nebulaUV = uv * 0.2 + u_time * 0.05;
    
    // Multiple noise layers for clouds
    float n1 = noise(nebulaUV);
    float n2 = noise(nebulaUV * 2.0 + vec2(u_time * 0.03));
    float n3 = noise(nebulaUV * 4.0 - vec2(u_time * 0.02));
    
    float clouds = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;
    clouds = smoothstep(0.4, 0.8, clouds) * u_noise_amount * 0.5; // Subtle
    
    // Color the nebula (dark purple/blue)
    vec3 nebulaColor1 = vec3(0.05, 0.02, 0.08); // Dark purple
    vec3 nebulaColor2 = vec3(0.02, 0.03, 0.06); // Dark blue
    vec3 nebulaColor3 = vec3(0.03, 0.01, 0.05); // Very dark purple
    
    float colorMix = sin(u_time * 0.1 + u_color_shift) * 0.5 + 0.5;
    vec3 nebulaColor = mix(nebulaColor1, nebulaColor2, colorMix);
    nebulaColor = mix(nebulaColor, nebulaColor3, n2);
    
    return nebulaColor * clouds;
}

// Distance to a ring (SDF - Signed Distance Field)
float sdRing(vec2 p, float radius, float thickness) {
    float d = length(p) - radius;
    return abs(d) - thickness;
}

// Main distance field function for rings
float map(vec2 p) {
    // Normalize and center coordinates
    vec2 uv = (p / u_resolution.xy) * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // Add noise for organic feel
    vec2 noiseUV = uv * 3.0 + u_time * 0.5;
    float n = noise(noiseUV) * u_noise_amount * 0.3; // Less distortion
    uv += n * 0.05;
    
    // Rotate coordinates for animation
    float angle = u_time * u_speed;
    vec2 baseUV = rotate2D(uv, angle);
    
    // Create multiple rings using dynamic positions
    float dist = 1000.0;
    
    float ringCount = floor(u_ring_count);
    
    // All rings use dynamic positions (they move to fetch food)
    for (float i = 0.0; i < 5.0; i += 1.0) {
        if (i >= ringCount) break;
        
        // Get ring position from uniform (set by JavaScript)
        vec2 ringCenter = u_ring_positions[int(i)];
        
        // Calculate ring properties based on index
        float ringRadius = u_radius * (0.3 + i * 0.2);
        if (i >= 3.0) {
            // Adjust radius for rings 4 and 5
            if (i == 3.0) ringRadius = u_radius * 0.25;
            if (i == 4.0) ringRadius = u_radius * 0.2;
        }
        
        float ringThickness = 0.03 + i * 0.01;
        if (i >= 3.0) {
            if (i == 3.0) ringThickness = 0.025;
            if (i == 4.0) ringThickness = 0.02;
        }
        
        // Calculate position relative to ring center
        vec2 ringUV = uv - ringCenter;
        
        // Rotate each ring at different speeds (keeps the spinning effect)
        float rotSpeed = u_time * u_speed * (0.5 + i * 0.3);
        if (i == 3.0) rotSpeed = u_time * u_speed * 0.8;
        if (i == 4.0) rotSpeed = -u_time * u_speed * 0.6;
        
        ringUV = rotate2D(ringUV, rotSpeed);
        
        float ringDist = sdRing(ringUV, ringRadius, ringThickness);
        
        // Blend rings together
        dist = smin(dist, ringDist, 0.1);
    }
    
    return dist;
}

// Color palette function (from The Book of Shaders)
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = gl_FragCoord.xy;
    
    // Start with deep space background
    vec3 color = vec3(0.0, 0.01, 0.02); // Deep space black with slight blue
    
    // Add subtle nebula clouds
    color += nebula(uv);
    
    // Add starfield
    float stars = starfield(uv, u_speed);
    color += vec3(1.0, 1.0, 0.95) * stars * 0.6; // Warm white stars, subtle
    
    // Calculate distance field for rings
    float d = map(uv);
    
    // Create glow effect using smoothstep
    float glow = 1.0 - smoothstep(0.0, 0.15, abs(d));
    float core = 1.0 - smoothstep(0.0, 0.02, abs(d));
    
    // Enhanced glow with exponential falloff
    float expGlow = exp(-abs(d) * u_glow_intensity);
    float finalGlow = mix(glow, expGlow, 0.5);
    
    // Time-based color shifting for rings
    float t = u_time * u_speed * 0.3 + u_color_shift;
    
    // Use palette function for rich color gradients
    vec3 color1 = palette(
        length((gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0) + t,
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(1.0, 1.0, 1.0),
        vec3(0.0, 0.33, 0.67) + t
    );
    
    // Alternative color scheme
    vec3 color2 = vec3(
        0.5 + 0.5 * sin(t + uv.x * 2.0),
        0.5 + 0.5 * sin(t + uv.y * 2.0 + PI / 3.0),
        0.5 + 0.5 * sin(t + (uv.x + uv.y) * 2.0 + 2.0 * PI / 3.0)
    );
    
    // Mix color schemes for rings
    vec3 ringColor = mix(color1, color2, 0.5);
    
    // Add radial color variation
    vec2 center = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
    float radial = length(center);
    ringColor = mix(ringColor, ringColor * 1.5, smoothstep(0.3, 0.8, radial));
    
    // Apply glow and core to rings
    vec3 ringGlow = ringColor * (finalGlow * 0.8 + core * 1.5);
    
    // HUNGER EFFECTS ON RINGS (enhances existing rings when hungry)
    float hungerPulse = sin(u_time * 5.0) * 0.5 + 0.5;
    float hungerEffect = smoothstep(50.0, 0.0, u_hunger);
    
    if(hungerEffect > 0.0) {
        // Enhance ring glow when hungry
        float hungerGlowBoost = 1.0 + hungerEffect * 0.8 * hungerPulse;
        ringGlow *= hungerGlowBoost;
        
        // Add orange/red tint when very hungry
        vec3 hungerColor = mix(ringColor, vec3(1.0, 0.5, 0.2), hungerEffect * hungerPulse * 0.4);
        ringGlow = mix(ringGlow, hungerColor * (finalGlow * 0.8 + core * 1.5) * hungerGlowBoost, hungerEffect * 0.3);
    }
    
    // Add rings on top of space background
    color += ringGlow;
    
    // Additional colored rings for rings 4 and 5 (using dynamic positions)
    float ringCount = floor(u_ring_count);
    
    if (ringCount >= 4.0) {
        // First additional ring (ring 4) - cyan/blue color
        vec2 ringCenter4 = u_ring_positions[3];
        vec2 movingUV1 = uv - ringCenter4;
        movingUV1 = rotate2D(movingUV1, u_time * u_speed * 0.8);
        float movingRing1Dist = sdRing(movingUV1, u_radius * 0.25, 0.025);
        
        float movingGlow1 = exp(-abs(movingRing1Dist) * u_glow_intensity);
        float movingCore1 = 1.0 - smoothstep(0.0, 0.02, abs(movingRing1Dist));
        
        vec3 movingColor1 = vec3(0.2, 0.8, 1.0) * (1.0 + 0.5 * sin(t * 2.0));
        color += movingColor1 * (movingGlow1 * 0.8 + movingCore1 * 1.2);
    }
    
    if (ringCount >= 5.0) {
        // Second additional ring (ring 5) - pink/magenta color
        vec2 ringCenter5 = u_ring_positions[4];
        vec2 movingUV2 = uv - ringCenter5;
        movingUV2 = rotate2D(movingUV2, -u_time * u_speed * 0.6);
        float movingRing2Dist = sdRing(movingUV2, u_radius * 0.2, 0.02);
        
        float movingGlow2 = exp(-abs(movingRing2Dist) * u_glow_intensity);
        float movingCore2 = 1.0 - smoothstep(0.0, 0.02, abs(movingRing2Dist));
        
        vec3 movingColor2 = vec3(1.0, 0.3, 0.6) * (1.0 + 0.5 * sin(t * 1.5 + PI));
        color += movingColor2 * (movingGlow2 * 0.8 + movingCore2 * 1.2);
    }
    
    // Add sparkles using noise (on all rings)
    vec2 sparkleUV = gl_FragCoord.xy / 20.0;
    float sparkleNoise = noise(sparkleUV + u_time);
    float sparkle = step(0.95, sparkleNoise) * step(abs(d), 0.1);
    color += vec3(1.0, 1.0, 1.0) * sparkle * 0.8;
    
    // FOOD PARTICLE SYSTEM (added on top, doesn't affect existing graphics)
    vec2 uv_normalized = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    for(int i = 0; i < 50; i++) {
        if(i >= u_food_count) break;
        if(u_food_active[i] < 0.1) continue;
        
        vec2 foodPos = u_food_positions[i];
        float dist = length(uv_normalized - foodPos);
        float scale = u_food_scale[i];
        
        // Pulsing food glow
        float pulse = sin(u_time * 4.0 + float(i)) * 0.3 + 0.7;
        float foodGlow = exp(-dist * 25.0 / scale) * 0.8 * pulse;
        vec3 foodColor = vec3(1.0, 0.85, 0.3); // Golden food
        
        // Add sparkle effect to food
        float foodSparkle = smoothstep(0.04 * scale, 0.0, dist) * pulse;
        foodColor = mix(foodColor, vec3(1.0, 1.0, 0.8), foodSparkle);
        
        color += foodColor * foodGlow * u_food_active[i];
        
        // Food core
        float foodCore = smoothstep(0.025 * scale, 0.0, dist);
        color += foodColor * foodCore * u_food_active[i] * 1.5;
    }
    
    // BURST PARTICLES (eating effect)
    for(int i = 0; i < 100; i++) {
        if(i >= u_burst_count) break;
        if(u_burst_active[i] < 0.1) continue;
        
        vec2 burstPos = u_burst_positions[i];
        float dist = length(uv_normalized - burstPos);
        
        float burstGlow = exp(-dist * 40.0) * u_burst_active[i];
        color += u_burst_colors[i] * burstGlow * 2.0;
    }
    
    // Tone mapping and gamma correction
    color = pow(color, vec3(1.0 / 2.2));
    
    gl_FragColor = vec4(color, 1.0);
}
