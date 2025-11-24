/**
 * Particle System
 * Manages multiple particles with WebGL rendering
 */

import { Particle } from './Particl.js';
import { FlowField } from './Flow.js';
import { Palette, Palettes } from './Palett.js';
import { MathUtils } from './Math.js';
import { Point2D } from './poin.js';

export class ParticleSystem {
    constructor(gl, count = 1000) {
        this.gl = gl;
        this.particles = [];
        this.count = count;
        this.flowField = null;
        this.palette = Palettes.neon;
        
        // WebGL buffers
        this.positionBuffer = null;
        this.colorBuffer = null;
        this.sizeBuffer = null;
        
        this.init();
    }

    /**
     * Initialize particle system
     */
    init() {
        // Create particles
        for (let i = 0; i < this.count; i++) {
            const particle = new Particle(
                Math.random() * this.gl.canvas.width,
                Math.random() * this.gl.canvas.height
            );
            
            // Random initial velocity
            particle.vel = new Point2D(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            
            particle.lifetime = MathUtils.random(2, 5);
            particle.size = MathUtils.random(1, 3);
            
            this.particles.push(particle);
        }

        // Create WebGL buffers
        this.createBuffers();
    }

    /**
     * Create WebGL buffers for particle data
     */
    createBuffers() {
        const gl = this.gl;
        
        // Position buffer
        this.positionBuffer = gl.createBuffer();
        
        // Color buffer
        this.colorBuffer = gl.createBuffer();
        
        // Size buffer
        this.sizeBuffer = gl.createBuffer();
    }

    /**
     * Set flow field
     */
    setFlowField(flowField) {
        this.flowField = flowField;
    }

    /**
     * Set color palette
     */
    setPalette(palette) {
        this.palette = palette;
    }

    /**
     * Update all particles
     */
    update(deltaTime, width, height) {
        this.particles.forEach(particle => {
            // Apply flow field if available
            if (this.flowField) {
                const flow = this.flowField.lookupVector(particle.pos.x, particle.pos.y);
                const force = new Point2D(flow.x, flow.y);
                force.mult(0.1);
                particle.applyForce(force);
            }

            // Update particle
            particle.update(deltaTime);
            
            // Handle boundaries
            particle.wrap(width, height);
            
            // Update color based on age
            const age = particle.getNormalizedAge();
            particle.color = this.palette.lerp(age * this.palette.colors.length, 0);
        });
    }

    /**
     * Update WebGL buffers with particle data
     */
    updateBuffers() {
        const gl = this.gl;
        const positions = [];
        const colors = [];
        const sizes = [];

        this.particles.forEach(particle => {
            // Normalize positions to -1 to 1
            positions.push(
                (particle.pos.x / gl.canvas.width) * 2 - 1,
                -(particle.pos.y / gl.canvas.height) * 2 + 1
            );
            
            colors.push(...particle.color);
            sizes.push(particle.size);
        });

        // Update position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

        // Update color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);

        // Update size buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.DYNAMIC_DRAW);
    }

    /**
     * Get buffer references for rendering
     */
    getBuffers() {
        return {
            position: this.positionBuffer,
            color: this.colorBuffer,
            size: this.sizeBuffer
        };
    }
}

export default ParticleSystem;

