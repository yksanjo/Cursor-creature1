/**
 * Point Utilities
 * 2D and 3D point/vector operations
 */

export class Point2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Create point from angle and distance
     */
    static fromPolar(angle, distance) {
        return new Point2D(
            Math.cos(angle) * distance,
            Math.sin(angle) * distance
        );
    }

    /**
     * Copy point
     */
    copy() {
        return new Point2D(this.x, this.y);
    }

    /**
     * Add another point
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    /**
     * Subtract another point
     */
    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    /**
     * Multiply by scalar
     */
    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Divide by scalar
     */
    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    /**
     * Get magnitude (length)
     */
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Get squared magnitude (faster, no sqrt)
     */
    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Normalize to unit vector
     */
    normalize() {
        const m = this.mag();
        if (m > 0) {
            this.div(m);
        }
        return this;
    }

    /**
     * Limit magnitude
     */
    limit(max) {
        if (this.magSq() > max * max) {
            this.normalize().mult(max);
        }
        return this;
    }

    /**
     * Distance to another point
     */
    dist(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Dot product with another point
     */
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * Rotate around origin
     */
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const newX = this.x * cos - this.y * sin;
        const newY = this.x * sin + this.y * cos;
        this.x = newX;
        this.y = newY;
        return this;
    }

    /**
     * Get angle in radians
     */
    heading() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Convert to array
     */
    toArray() {
        return [this.x, this.y];
    }
}

export class Point3D {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    copy() {
        return new Point3D(this.x, this.y, this.z);
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        const m = this.mag();
        if (m > 0) {
            this.div(m);
        }
        return this;
    }

    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross(other) {
        return new Point3D(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    toArray() {
        return [this.x, this.y, this.z];
    }
}

export default { Point2D, Point3D };

