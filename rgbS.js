/**
 * RGB String Utilities
 * Convert between RGB formats and string representations
 */

export class RGBString {
    /**
     * Convert RGB array to CSS rgb() string
     */
    static toCSS(r, g, b, a = 1) {
        if (Array.isArray(r)) {
            [r, g, b, a] = r;
        }
        if (a < 1) {
            return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
        }
        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }

    /**
     * Convert RGB array to hex string
     */
    static toHex(r, g, b) {
        if (Array.isArray(r)) {
            [r, g, b] = r;
        }
        const toHex = (n) => {
            const hex = Math.round(n * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    /**
     * Parse CSS rgb() or rgba() string
     */
    static fromCSS(cssString) {
        const match = cssString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!match) return null;

        return [
            parseInt(match[1]) / 255,
            parseInt(match[2]) / 255,
            parseInt(match[3]) / 255,
            match[4] ? parseFloat(match[4]) : 1
        ];
    }

    /**
     * Parse hex string to RGB array
     */
    static fromHex(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
        if (!result) return null;

        return [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255,
            result[4] ? parseInt(result[4], 16) / 255 : 1
        ];
    }

    /**
     * Convert RGB to HSL
     */
    static toHSL(r, g, b) {
        if (Array.isArray(r)) {
            [r, g, b] = r;
        }

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return [h * 360, s, l];
    }

    /**
     * Convert HSL to RGB
     */
    static fromHSL(h, s, l) {
        h = (h % 360) / 360;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [r, g, b];
    }

    /**
     * Interpolate between two RGB colors
     */
    static lerp(rgb1, rgb2, t) {
        if (!Array.isArray(rgb1)) rgb1 = [rgb1, rgb1, rgb1];
        if (!Array.isArray(rgb2)) rgb2 = [rgb2, rgb2, rgb2];

        return [
            rgb1[0] + (rgb2[0] - rgb1[0]) * t,
            rgb1[1] + (rgb2[1] - rgb1[1]) * t,
            rgb1[2] + (rgb2[2] - rgb1[2]) * t
        ];
    }
}

export default RGBString;

