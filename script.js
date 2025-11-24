// Import animation system
import { getAnimationManager } from './animation/index.js';
import AnimationDemo from './animation-demo.js';

// Function to load the text content of a file
async function loadShader(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load shader: ${url}`);
    }
    return response.text();
}

async function init() {
    const container = document.getElementById('viz');
    const codeDisplay = document.getElementById('shader-code');
    const controls = document.getElementById('controls');

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 3. Load Shaders
    const vertexShaderSource = await loadShader('shaders/vertexShader.glsl');
    const fragmentShaderSource = await loadShader('shaders/fragmentShader.glsl');
    
    // 4. Update the Code Display
    codeDisplay.textContent = fragmentShaderSource;
    if (typeof Prism !== 'undefined') {
        Prism.highlightElement(codeDisplay);
    }

    // 5. Define Uniforms, reading initial values from HTML inputs
    const uniforms = {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        // FADER UNIFORMS
        u_radius: { value: parseFloat(document.getElementById('ringRadius').value) },
        u_glow_intensity: { value: parseFloat(document.getElementById('glowIntensity').value) },
        u_speed: { value: parseFloat(document.getElementById('speedFactor').value) },
        // NEW ADVANCED UNIFORMS
        u_color_shift: { value: parseFloat(document.getElementById('colorShift')?.value || 0) },
        u_ring_count: { value: parseFloat(document.getElementById('ringCount')?.value || 3) },
        u_noise_amount: { value: parseFloat(document.getElementById('noiseAmount')?.value || 0.5) },
        // FOOD PARTICLE SYSTEM UNIFORMS
        u_hunger: { value: 100.0 },
        u_food_positions: { value: new Float32Array(100) },
        u_food_active: { value: new Float32Array(50) },
        u_food_scale: { value: new Float32Array(50) },
        u_food_count: { value: 0 },
        // BURST PARTICLE SYSTEM UNIFORMS
        u_burst_positions: { value: new Float32Array(200) },
        u_burst_active: { value: new Float32Array(100) },
        u_burst_colors: { value: new Float32Array(300) },
        u_burst_count: { value: 0 },
        // RING POSITIONS (for dynamic movement)
        u_ring_positions: { value: new Float32Array(10) } // 5 rings * 2 (x, y)
    };

    // 6. Setup Geometry and Material
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 7. Interactive Controls Logic (NEW)
    controls.querySelectorAll('input[type="range"]').forEach(input => {
        // Map input IDs to uniform names
        const idToUniform = {
            'ringRadius': 'u_radius',
            'glowIntensity': 'u_glow_intensity',
            'speedFactor': 'u_speed',
            'colorShift': 'u_color_shift',
            'ringCount': 'u_ring_count',
            'noiseAmount': 'u_noise_amount'
        };
        
        const uniformName = idToUniform[input.id];
        const valueSpan = document.getElementById(input.id + 'Value');

        input.addEventListener('input', (event) => {
            const value = parseFloat(event.target.value);
            
            // Update the GLSL Uniform
            if (uniforms[uniformName]) {
                uniforms[uniformName].value = value;
            }

            // Update the display value next to the fader
            if (valueSpan) {
                // For integer values (ringCount), show as integer
                if (input.id === 'ringCount') {
                    valueSpan.textContent = Math.round(value);
                } else {
                    valueSpan.textContent = value.toFixed(input.step.includes('.') ? 2 : 1);
                }
            }
        });
    });

    // Copy button functionality
    document.getElementById('copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(fragmentShaderSource).then(() => {
            const btn = document.getElementById('copy-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    });

    // 8. Handle Window Resizing
    function onWindowResize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        uniforms.u_resolution.value.set(width, height);
    }
    window.addEventListener('resize', onWindowResize, false);

    // 9. Setup Animation System
    let animationManager = null;
    let animationDemo = null;
    
    try {
        animationManager = getAnimationManager();
        animationDemo = new AnimationDemo(uniforms);
        
        // Setup demo buttons
        const demoButtons = document.querySelectorAll('.demo-btn');
        console.log('Found demo buttons:', demoButtons.length);
        
        demoButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.dataset.demo;
                console.log('Button clicked:', demo);
                try {
                    switch(demo) {
                        case 'bounce':
                            animationDemo.demoBounceRadius();
                            break;
                        case 'color':
                            animationDemo.demoColorShift();
                            break;
                        case 'timeline':
                            animationDemo.demoTimeline();
                            break;
                        case 'parallel':
                            animationDemo.demoParallel();
                            break;
                        case 'pulse':
                            animationDemo.demoElasticPulse();
                            break;
                        case 'speed':
                            animationDemo.demoSpeedVariation();
                            break;
                        default:
                            console.warn('Unknown demo:', demo);
                    }
                } catch (error) {
                    console.error('Error running demo:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up animation system:', error);
        // Continue without animation system
    }

    // 10. Food Particle System
    const foodParticles = [];
    const burstParticles = [];
    let hunger = 100;
    let lastHungerUpdate = Date.now();
    let feedingMode = true;
    let stats = { foodEaten: 0, foodSpawned: 0 };
    
    // Ring state for movement (stores position and velocity for each ring)
    const ringStates = [];
    const ringSeekStrength = 0.015; // How strongly rings move towards food
    const ringReturnStrength = 0.01; // How strongly rings return to orbit
    const ringMaxSpeed = 0.08; // Maximum speed for rings

    // Create UI overlays
    const hungerUI = document.createElement('div');
    hungerUI.style.cssText = 'position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.7); color: white; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 14px; z-index: 1000;';
    hungerUI.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">Hunger: <span id="hunger-value">100</span>%</div>
        <div style="width: 128px; height: 12px; background: #333; border-radius: 6px; overflow: hidden; margin-bottom: 8px;">
            <div id="hunger-bar" style="height: 100%; width: 100%; background: #22c55e; transition: all 0.3s;"></div>
        </div>
        <div style="font-size: 12px; color: #ccc; margin-top: 8px;">
            <div>🍽️ Eaten: <span id="food-eaten">0</span></div>
            <div>✨ Spawned: <span id="food-spawned">0</span></div>
        </div>
    `;
    container.appendChild(hungerUI);

    const modeUI = document.createElement('div');
    modeUI.style.cssText = 'position: absolute; top: 16px; right: 16px; background: rgba(0,0,0,0.7); color: white; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 14px; z-index: 1000;';
    modeUI.id = 'mode-indicator';
    modeUI.textContent = '🍽️ Click to feed!';
    container.appendChild(modeUI);

    // Toggle feeding mode
    const toggleModeBtn = document.createElement('button');
    toggleModeBtn.textContent = 'Toggle Mode';
    toggleModeBtn.style.cssText = 'position: absolute; bottom: 16px; right: 16px; padding: 8px 16px; background: #16a34a; color: white; border: none; border-radius: 4px; cursor: pointer; font-family: monospace; z-index: 1000;';
    toggleModeBtn.addEventListener('click', () => {
        feedingMode = !feedingMode;
        modeUI.textContent = feedingMode ? '🍽️ Click to feed!' : '⚙️ Adjust settings';
        toggleModeBtn.style.background = feedingMode ? '#16a34a' : '#2563eb';
    });
    container.appendChild(toggleModeBtn);

    // Click to spawn food
    container.addEventListener('click', (e) => {
        if (!feedingMode) return;
        
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        
        const aspect = container.clientWidth / container.clientHeight;
        const adjustedX = x * aspect;
        
        foodParticles.push({
            x: adjustedX,
            y: y,
            vx: 0,
            vy: 0,
            active: true,
            life: 1.0,
            scale: 0.3
        });
        
        stats.foodSpawned++;
        document.getElementById('food-spawned').textContent = stats.foodSpawned;
    });

    function getRingBasePositions(currentTime) {
        // Calculate base orbital positions (where rings want to return to)
        const positions = [];
        const ringCount = uniforms.u_ring_count.value;
        const animSpeed = uniforms.u_speed.value;
        
        for (let i = 0; i < ringCount; i++) {
            const angle = currentTime * animSpeed * (1.0 + i * 0.3) + i * 2.0;
            const orbitRadius = i * 0.15;
            positions.push({
                x: Math.cos(angle) * orbitRadius,
                y: Math.sin(angle) * orbitRadius
            });
        }
        return positions;
    }
    
    function initializeRingStates(currentTime) {
        // Initialize ring states with starting positions
        const ringCount = uniforms.u_ring_count.value;
        const basePositions = getRingBasePositions(currentTime);
        
        for (let i = 0; i < ringCount; i++) {
            ringStates[i] = {
                x: basePositions[i].x,
                y: basePositions[i].y,
                vx: 0,
                vy: 0
            };
        }
    }
    
    function updateRingPositions(currentTime, foodParticles) {
        const ringCount = uniforms.u_ring_count.value;
        const animSpeed = uniforms.u_speed.value;
        const basePositions = getRingBasePositions(currentTime);
        
        // Update each ring's position
        for (let i = 0; i < ringCount; i++) {
            const ring = ringStates[i];
            if (!ring) {
                ringStates[i] = { x: 0, y: 0, vx: 0, vy: 0 };
                continue;
            }
            
            // Find nearest food particle
            let nearestFood = null;
            let nearestDist = Infinity;
            const seekRadius = 0.6; // How far rings can see food
            
            for (const food of foodParticles) {
                if (!food.active) continue;
                
                const dx = food.x - ring.x;
                const dy = food.y - ring.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < nearestDist && dist < seekRadius) {
                    nearestDist = dist;
                    nearestFood = food;
                }
            }
            
            // Calculate forces
            let forceX = 0;
            let forceY = 0;
            
            // Force 1: Seek food if nearby
            if (nearestFood) {
                const dx = nearestFood.x - ring.x;
                const dy = nearestFood.y - ring.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0.01) {
                    const seekForce = ringSeekStrength * (1.0 - dist / seekRadius);
                    forceX += (dx / dist) * seekForce;
                    forceY += (dy / dist) * seekForce;
                }
            }
            
            // Force 2: Return to base orbital position
            const basePos = basePositions[i];
            const returnDx = basePos.x - ring.x;
            const returnDy = basePos.y - ring.y;
            const returnDist = Math.sqrt(returnDx * returnDx + returnDy * returnDy);
            
            if (returnDist > 0.01) {
                const returnForce = ringReturnStrength * returnDist;
                forceX += (returnDx / returnDist) * returnForce;
                forceY += (returnDy / returnDist) * returnForce;
            }
            
            // Apply forces with damping
            ring.vx += forceX;
            ring.vy += forceY;
            ring.vx *= 0.92; // Damping
            ring.vy *= 0.92;
            
            // Limit speed
            const speed = Math.sqrt(ring.vx * ring.vx + ring.vy * ring.vy);
            if (speed > ringMaxSpeed) {
                ring.vx = (ring.vx / speed) * ringMaxSpeed;
                ring.vy = (ring.vy / speed) * ringMaxSpeed;
            }
            
            // Update position
            ring.x += ring.vx;
            ring.y += ring.vy;
        }
        
        // Update shader uniforms with ring positions (apply aspect correction)
        const aspect = container.clientWidth / container.clientHeight;
        const ringPosArray = new Float32Array(10);
        for (let i = 0; i < ringCount && i < 5; i++) {
            // Apply aspect correction to match shader coordinate system
            ringPosArray[i * 2] = ringStates[i].x * aspect;
            ringPosArray[i * 2 + 1] = ringStates[i].y;
        }
        uniforms.u_ring_positions.value = ringPosArray;
        
        // Return current ring positions for food attraction
        return ringStates.map(r => ({ x: r.x, y: r.y }));
    }

    function createBurst(x, y, color) {
        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 0.02 + Math.random() * 0.02;
            burstParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                color: color
            });
        }
    }

    function updateParticleUniforms() {
        // Food particles
        const foodPositions = new Float32Array(100);
        const foodActive = new Float32Array(50);
        const foodScale = new Float32Array(50);

        foodParticles.forEach((food, i) => {
            if (i < 50) {
                foodPositions[i * 2] = food.x;
                foodPositions[i * 2 + 1] = food.y;
                foodActive[i] = food.active ? food.life : 0.0;
                foodScale[i] = food.scale;
            }
        });

        uniforms.u_food_positions.value = foodPositions;
        uniforms.u_food_active.value = foodActive;
        uniforms.u_food_scale.value = foodScale;
        uniforms.u_food_count.value = Math.min(foodParticles.length, 50);

        // Burst particles
        const burstPositions = new Float32Array(200);
        const burstActive = new Float32Array(100);
        const burstColors = new Float32Array(300);

        burstParticles.forEach((burst, i) => {
            if (i < 100) {
                burstPositions[i * 2] = burst.x;
                burstPositions[i * 2 + 1] = burst.y;
                burstActive[i] = burst.life;
                burstColors[i * 3] = burst.color[0];
                burstColors[i * 3 + 1] = burst.color[1];
                burstColors[i * 3 + 2] = burst.color[2];
            }
        });

        uniforms.u_burst_positions.value = burstPositions;
        uniforms.u_burst_active.value = burstActive;
        uniforms.u_burst_colors.value = burstColors;
        uniforms.u_burst_count.value = Math.min(burstParticles.length, 100);
    }

    // 11. Animation Loop (with Animation Manager and Food Particles)
    const clock = new THREE.Clock();
    const attractionStrength = 0.08;
    const eatDistance = 0.12;
    
    function animate() {
        requestAnimationFrame(animate);

        const currentTime = performance.now();
        const elapsedTime = clock.getElapsedTime();
        
        // Update animation manager if available (handles all tweens/timelines)
        if (animationManager) {
            animationManager.update(currentTime);
        }

        // Initialize ring states on first frame
        if (ringStates.length === 0) {
            initializeRingStates(elapsedTime);
        }

        // Update hunger
        if (Date.now() - lastHungerUpdate > 100) {
            hunger = Math.max(0, hunger - 0.3);
            uniforms.u_hunger.value = hunger;
            document.getElementById('hunger-value').textContent = Math.round(hunger);
            const hungerBar = document.getElementById('hunger-bar');
            hungerBar.style.width = `${hunger}%`;
            hungerBar.style.background = hunger > 50 ? '#22c55e' : hunger > 20 ? '#eab308' : '#ef4444';
            lastHungerUpdate = Date.now();
        }

        // Update ring positions (they move towards food)
        const ringPositions = updateRingPositions(elapsedTime, foodParticles);

        // Update food particles
        for (let i = foodParticles.length - 1; i >= 0; i--) {
            const food = foodParticles[i];
            if (!food.active) {
                foodParticles.splice(i, 1);
                continue;
            }

            // Apply gravity
            food.vy -= 0.0005;

            // Check attraction from each ring
            let totalForceX = 0;
            let totalForceY = 0;
            let closestDist = Infinity;
            let closestRingColor = [1, 0.85, 0.3];

            for (let j = 0; j < ringPositions.length; j++) {
                const ring = ringPositions[j];
                const dx = ring.x - food.x;
                const dy = ring.y - food.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < closestDist) {
                    closestDist = dist;
                    const t = j / uniforms.u_ring_count.value + elapsedTime * uniforms.u_speed.value * 0.1;
                    closestRingColor = [
                        0.5 + 0.5 * Math.cos(6.28 * (t + uniforms.u_color_shift.value)),
                        0.5 + 0.5 * Math.cos(6.28 * (t + uniforms.u_color_shift.value + 0.33)),
                        0.5 + 0.5 * Math.cos(6.28 * (t + uniforms.u_color_shift.value + 0.67))
                    ];
                }

                // Attraction force
                const ringRadius = uniforms.u_radius.value;
                if (dist < ringRadius + 0.4) {
                    const attractionRadius = ringRadius + 0.3;
                    const forceMagnitude = attractionStrength * (1.0 - Math.min(dist / attractionRadius, 1.0));
                    totalForceX += (dx / dist) * forceMagnitude;
                    totalForceY += (dy / dist) * forceMagnitude;
                }

                // Check if eaten
                if (dist < eatDistance) {
                    food.active = false;
                    hunger = Math.min(100, hunger + 15);
                    uniforms.u_hunger.value = hunger;
                    stats.foodEaten++;
                    document.getElementById('food-eaten').textContent = stats.foodEaten;
                    createBurst(food.x, food.y, closestRingColor);
                    foodParticles.splice(i, 1);
                    continue;
                }
            }

            // Apply forces with damping
            food.vx += totalForceX;
            food.vy += totalForceY;
            food.vx *= 0.98;
            food.vy *= 0.98;

            // Update position
            food.x += food.vx;
            food.y += food.vy;

            // Update life and scale
            food.life -= 0.005;
            food.scale = Math.min(1.0, food.scale + 0.05);

            if (food.life <= 0 || food.y < -1.5) {
                food.active = false;
                foodParticles.splice(i, 1);
            }
        }

        // Update burst particles
        for (let i = burstParticles.length - 1; i >= 0; i--) {
            const burst = burstParticles[i];
            burst.x += burst.vx;
            burst.y += burst.vy;
            burst.vx *= 0.95;
            burst.vy *= 0.95;
            burst.life -= 0.03;
            if (burst.life <= 0) {
                burstParticles.splice(i, 1);
            }
        }

        // Update particle uniforms
        updateParticleUniforms();

        // Update time uniform for shader animation
        uniforms.u_time.value = elapsedTime;

        // Render the scene
        renderer.render(scene, camera);
    }

    // Start the animation loop
    if (animationManager) {
        animationManager.start();
    }
    animate();
}

init().catch(err => {
    console.error("Initialization failed:", err);
    document.getElementById('shader-code').textContent = `Error: ${err.message}`;
});
