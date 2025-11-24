/**
 * Math Utilities
 * Extended math functions for creative coding
 */

export class MathUtils {
    /**
     * Linear interpolation
     */
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    /**
     * Inverse lerp - get t value from interpolated value
     */
    static invLerp(start, end, value) {
        return (value - start) / (end - start);
    }

    /**
     * Remap value from one range to another
     */
    static remap(value, inMin, inMax, outMin, outMax) {
        const t = this.invLerp(inMin, inMax, value);
        return this.lerp(outMin, outMax, t);
    }

    /**
     * Clamp value between min and max
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Smooth step interpolation
     */
    static smoothstep(edge0, edge1, x) {
        const t = this.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
    }

    /**
     * Smoother step interpolation
     */
    static smootherstep(edge0, edge1, x) {
        const t = this.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    /**
     * Map value to 0-1 range
     */
    static normalize(value, min, max) {
        return (value - min) / (max - min);
    }

    /**
     * Distance between two 2D points
     */
    static distance2D(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Distance between two 3D points
     */
    static distance3D(x1, y1, z1, x2, y2, z2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Convert degrees to radians
     */
    static degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    /**
     * Convert radians to degrees
     */
    static radToDeg(radians) {
        return radians * 180 / Math.PI;
    }

    /**
     * Random number between min and max
     */
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Random integer between min and max (inclusive)
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Seeded random number generator
     */
    static seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    /**
     * Normalize angle to 0-2π range
     */
    static normalizeAngle(angle) {
        while (angle < 0) angle += Math.PI * 2;
        while (angle >= Math.PI * 2) angle -= Math.PI * 2;
        return angle;
    }

    /**
     * Rotate 2D point around origin
     */
    static rotate2D(x, y, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: x * cos - y * sin,
            y: x * sin + y * cos
        };
    }

    /**
     * Dot product of two 2D vectors
     */
    static dot2D(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    }

    /**
     * Cross product of two 2D vectors (returns z component)
     */
    static cross2D(x1, y1, x2, y2) {
        return x1 * y2 - y1 * x2;
    }
}

export default MathUtils;

