/**
 * Color Palette
 * Predefined and custom color palettes
 */

export class Palette {
    constructor(colors = []) {
        this.colors = colors;
    }

    /**
     * Get color at index (with wrapping)
     */
    get(index) {
        if (this.colors.length === 0) return [1, 1, 1, 1];
        return this.colors[index % this.colors.length];
    }

    /**
     * Get interpolated color between two palette colors
     */
    lerp(index, t) {
        const i1 = Math.floor(index) % this.colors.length;
        const i2 = (i1 + 1) % this.colors.length;
        const c1 = this.colors[i1];
        const c2 = this.colors[i2];

        return [
            c1[0] + (c2[0] - c1[0]) * t,
            c1[1] + (c2[1] - c1[1]) * t,
            c1[2] + (c2[2] - c1[2]) * t,
            c1[3] !== undefined ? c1[3] + (c2[3] - c1[3]) * t : 1
        ];
    }

    /**
     * Add color to palette
     */
    add(r, g, b, a = 1) {
        this.colors.push([r, g, b, a]);
        return this;
    }

    /**
     * Get random color from palette
     */
    random() {
        if (this.colors.length === 0) return [1, 1, 1, 1];
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}

// Predefined palettes
export const Palettes = {
    // Cyberpunk
    cyberpunk: new Palette([
        [0.0, 1.0, 1.0, 1.0], // Cyan
        [1.0, 0.0, 1.0, 1.0], // Magenta
        [1.0, 1.0, 0.0, 1.0], // Yellow
        [0.0, 1.0, 0.0, 1.0]  // Green
    ]),

    // Sunset
    sunset: new Palette([
        [1.0, 0.2, 0.2, 1.0], // Red
        [1.0, 0.5, 0.0, 1.0], // Orange
        [1.0, 0.8, 0.2, 1.0], // Yellow
        [0.8, 0.2, 0.4, 1.0]  // Pink
    ]),

    // Ocean
    ocean: new Palette([
        [0.0, 0.2, 0.4, 1.0], // Dark blue
        [0.0, 0.4, 0.6, 1.0], // Blue
        [0.2, 0.6, 0.8, 1.0], // Light blue
        [0.4, 0.8, 1.0, 1.0]  // Cyan
    ]),

    // Fire
    fire: new Palette([
        [1.0, 0.0, 0.0, 1.0], // Red
        [1.0, 0.5, 0.0, 1.0], // Orange
        [1.0, 1.0, 0.0, 1.0], // Yellow
        [1.0, 0.8, 0.4, 1.0]  // Light yellow
    ]),

    // Neon
    neon: new Palette([
        [0.2, 1.0, 0.6, 1.0], // Green
        [0.6, 0.2, 1.0, 1.0], // Purple
        [1.0, 0.2, 0.6, 1.0], // Pink
        [0.2, 0.6, 1.0, 1.0]  // Blue
    ]),

    // Monochrome
    monochrome: new Palette([
        [1.0, 1.0, 1.0, 1.0], // White
        [0.5, 0.5, 0.5, 1.0], // Gray
        [0.0, 0.0, 0.0, 1.0]  // Black
    ])
};

export default Palette;

