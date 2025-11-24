/**
 * Main Application Entry Point
 * Initializes and runs the WebGL shader visualizer
 */

import { Defaults } from './Defau.js';
import { WebGLUtils } from './webgl.js';
import { ShaderUtils } from './shade.js';

// Main application class
export class App {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.uniforms = {};
        this.animationId = null;
        this.clock = 0;
    }

    /**
     * Initialize application
     */
    async init() {
        // Get canvas element
        const container = document.getElementById('viz');
        this.canvas = document.createElement('canvas');
        container.appendChild(this.canvas);

        // Get WebGL context
        this.gl = WebGLUtils.getContext(this.canvas, {
            antialias: Defaults.canvas.antialias,
            alpha: Defaults.canvas.alpha
        });

        // Resize canvas
        this.resize();

        // Load and compile shaders
        await this.loadShaders();

        // Setup uniforms
        this.setupUniforms();

        // Setup geometry
        this.setupGeometry();

        // Start animation loop
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Load and compile shaders
     */
    async loadShaders() {
        const vertexSource = await this.loadShaderFile(Defaults.shader.vertexShader);
        const fragmentSource = await this.loadShaderFile(Defaults.shader.fragmentShader);

        const vertexShader = WebGLUtils.createShader(this.gl, this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = WebGLUtils.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentSource);
        
        this.program = WebGLUtils.createProgram(this.gl, vertexShader, fragmentShader);
        this.gl.useProgram(this.program);
    }

    /**
     * Load shader file
     */
    async loadShaderFile(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load shader: ${url}`);
        }
        return await response.text();
    }

    /**
     * Setup uniforms
     */
    setupUniforms() {
        this.uniforms = {
            u_time: this.gl.getUniformLocation(this.program, 'u_time'),
            u_resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
            u_radius: this.gl.getUniformLocation(this.program, 'u_radius'),
            u_glow_intensity: this.gl.getUniformLocation(this.program, 'u_glow_intensity'),
            u_speed: this.gl.getUniformLocation(this.program, 'u_speed')
        };
    }

    /**
     * Setup geometry (fullscreen quad)
     */
    setupGeometry() {
        const positions = [
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1
        ];

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        const positionLocation = this.gl.getAttribLocation(this.program, 'position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    }

    /**
     * Resize canvas
     */
    resize() {
        const container = document.getElementById('viz');
        WebGLUtils.resizeCanvasToDisplaySize(this.canvas);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.uniforms.u_resolution) {
            this.gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Update uniforms from controls
     */
    updateUniforms() {
        const radius = parseFloat(document.getElementById('ringRadius')?.value || Defaults.ring.radius);
        const intensity = parseFloat(document.getElementById('glowIntensity')?.value || Defaults.ring.glowIntensity);
        const speed = parseFloat(document.getElementById('speedFactor')?.value || Defaults.ring.animationSpeed);

        if (this.uniforms.u_radius) {
            this.gl.uniform1f(this.uniforms.u_radius, radius);
        }
        if (this.uniforms.u_glow_intensity) {
            this.gl.uniform1f(this.uniforms.u_glow_intensity, intensity);
        }
        if (this.uniforms.u_speed) {
            this.gl.uniform1f(this.uniforms.u_speed, speed);
        }
        if (this.uniforms.u_time) {
            this.gl.uniform1f(this.uniforms.u_time, this.clock);
        }
    }

    /**
     * Animation loop
     */
    animate() {
        this.clock += 0.016; // ~60fps
        
        this.updateUniforms();
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
        app.init().catch(console.error);
    });
} else {
    const app = new App();
    app.init().catch(console.error);
}

export default App;

