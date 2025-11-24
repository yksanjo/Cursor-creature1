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
        u_noise_amount: { value: parseFloat(document.getElementById('noiseAmount')?.value || 0.5) }
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

    // 10. Animation Loop (with Animation Manager)
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);

        const currentTime = performance.now();
        
        // Update animation manager if available (handles all tweens/timelines)
        if (animationManager) {
            animationManager.update(currentTime);
        }

        // Update time uniform for shader animation
        uniforms.u_time.value = clock.getElapsedTime();

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
