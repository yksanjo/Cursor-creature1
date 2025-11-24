/**
 * Flow Field
 * Perlin noise-based flow field for particle systems
 */

import { MathUtils } from './Math.js';

export class FlowField {
    constructor(width, height, resolution = 20) {
        this.width = width;
        this.height = height;
        this.resolution = resolution;
        this.cols = Math.floor(width / resolution);
        this.rows = Math.floor(height / resolution);
        this.field = [];
        this.zoff = 0;

        this.init();
    }

    /**
     * Initialize flow field with Perlin noise
     */
    init() {
        this.field = [];
        for (let i = 0; i < this.cols * this.rows; i++) {
            this.field[i] = Math.random() * Math.PI * 2;
        }
    }

    /**
     * Update flow field with Perlin noise
     */
    update(noiseScale = 0.1, noiseStrength = 1.0) {
        let xoff = 0;
        for (let i = 0; i < this.cols; i++) {
            let yoff = 0;
            for (let j = 0; j < this.rows; j++) {
                const index = i + j * this.cols;
                // Simple noise approximation
                const angle = this.noise(xoff, yoff, this.zoff) * Math.PI * 2 * noiseStrength;
                this.field[index] = angle;
                yoff += noiseScale;
            }
            xoff += noiseScale;
        }
        this.zoff += 0.01;
    }

    /**
     * Simple noise function (Perlin-like)
     */
    noise(x, y, z) {
        // Simplified noise - in production, use a proper Perlin noise library
        const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
        return n - Math.floor(n);
    }

    /**
     * Get flow vector at position
     */
    lookup(x, y) {
        const col = Math.floor(MathUtils.clamp(x / this.resolution, 0, this.cols - 1));
        const row = Math.floor(MathUtils.clamp(y / this.resolution, 0, this.rows - 1));
        const index = col + row * this.cols;
        return this.field[index];
    }

    /**
     * Get flow vector as x, y components
     */
    lookupVector(x, y) {
        const angle = this.lookup(x, y);
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    /**
     * Draw flow field (for debugging)
     */
    draw(ctx, scale = 1) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                const x = i * this.resolution;
                const y = j * this.resolution;
                const angle = this.field[i + j * this.cols];
                
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(this.resolution * 0.5 * scale, 0);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

export default FlowField;

