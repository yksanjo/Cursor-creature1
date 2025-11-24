/**
 * Particle Class
 * Individual particle with physics and rendering
 */

import { Point2D } from './poin.js';
import { MathUtils } from './Math.js';

export class Particle {
    constructor(x = 0, y = 0) {
        this.pos = new Point2D(x, y);
        this.vel = new Point2D(0, 0);
        this.acc = new Point2D(0, 0);
        
        this.size = 2.0;
        this.lifetime = 1.0;
        this.age = 0.0;
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.maxSpeed = 4.0;
        this.maxForce = 0.1;
    }

    /**
     * Update particle physics
     */
    update(deltaTime = 0.016) {
        // Update velocity
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        
        // Update position
        this.pos.add(this.vel);
        
        // Reset acceleration
        this.acc.mult(0);
        
        // Update age
        this.age += deltaTime;
    }

    /**
     * Apply force to particle
     */
    applyForce(force) {
        if (force instanceof Point2D) {
            this.acc.add(force);
        } else {
            this.acc.add(new Point2D(force.x || 0, force.y || 0));
        }
    }

    /**
     * Seek target position
     */
    seek(target, strength = 1.0) {
        const desired = new Point2D(target.x - this.pos.x, target.y - this.pos.y);
        desired.normalize().mult(this.maxSpeed);
        
        const steer = new Point2D(desired.x - this.vel.x, desired.y - this.vel.y);
        steer.limit(this.maxForce * strength);
        
        this.applyForce(steer);
    }

    /**
     * Flee from target position
     */
    flee(target, strength = 1.0) {
        const desired = new Point2D(this.pos.x - target.x, this.pos.y - target.y);
        desired.normalize().mult(this.maxSpeed);
        
        const steer = new Point2D(desired.x - this.vel.x, desired.y - this.vel.y);
        steer.limit(this.maxForce * strength);
        
        this.applyForce(steer);
    }

    /**
     * Wrap around edges
     */
    wrap(width, height) {
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
    }

    /**
     * Bounce off edges
     */
    bounce(width, height) {
        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x *= -1;
            this.pos.x = MathUtils.clamp(this.pos.x, 0, width);
        }
        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y *= -1;
            this.pos.y = MathUtils.clamp(this.pos.y, 0, height);
        }
    }

    /**
     * Check if particle is dead
     */
    isDead() {
        return this.age >= this.lifetime;
    }

    /**
     * Get normalized age (0-1)
     */
    getNormalizedAge() {
        return MathUtils.clamp(this.age / this.lifetime, 0, 1);
    }

    /**
     * Reset particle
     */
    reset(x, y) {
        this.pos.x = x;
        this.pos.y = y;
        this.vel.x = 0;
        this.vel.y = 0;
        this.acc.x = 0;
        this.acc.y = 0;
        this.age = 0;
    }
}

export default Particle;

