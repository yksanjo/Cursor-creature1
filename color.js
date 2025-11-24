/**
 * Color Utilities
 * Functions for color manipulation and conversion
 */

export class Color {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * Create color from RGB values (0-255)
     */
    static fromRGB(r, g, b, a = 255) {
        return new Color(r / 255, g / 255, b / 255, a / 255);
    }

    /**
     * Create color from HSL values
     */
    static fromHSL(h, s, l, a = 1) {
        h = h % 360;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;
        if (h < 60) {
            r = c; g = x; b = 0;
        } else if (h < 120) {
            r = x; g = c; b = 0;
        } else if (h < 180) {
            r = 0; g = c; b = x;
        } else if (h < 240) {
            r = 0; g = x; b = c;
        } else if (h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        return new Color(r + m, g + m, b + m, a);
    }

    /**
     * Create color from hex string
     */
    static fromHex(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
        if (!result) return new Color(0, 0, 0, 1);

        return new Color(
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255,
            result[4] ? parseInt(result[4], 16) / 255 : 1
        );
    }

    /**
     * Convert to array [r, g, b, a]
     */
    toArray() {
        return [this.r, this.g, this.b, this.a];
    }

    /**
     * Convert to hex string
     */
    toHex() {
        const r = Math.round(this.r * 255).toString(16).padStart(2, '0');
        const g = Math.round(this.g * 255).toString(16).padStart(2, '0');
        const b = Math.round(this.b * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }

    /**
     * Interpolate between two colors
     */
    static lerp(color1, color2, t) {
        t = Math.max(0, Math.min(1, t));
        return new Color(
            color1.r + (color2.r - color1.r) * t,
            color1.g + (color2.g - color1.g) * t,
            color1.b + (color2.b - color1.b) * t,
            color1.a + (color2.a - color1.a) * t
        );
    }

    /**
     * Multiply color components
     */
    multiply(other) {
        return new Color(
            this.r * other.r,
            this.g * other.g,
            this.b * other.b,
            this.a * other.a
        );
    }

    /**
     * Add color components
     */
    add(other) {
        return new Color(
            Math.min(1, this.r + other.r),
            Math.min(1, this.g + other.g),
            Math.min(1, this.b + other.b),
            Math.min(1, this.a + other.a)
        );
    }
}

export default Color;

