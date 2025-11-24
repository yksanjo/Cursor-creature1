/**
 * Easing Functions Library
 * Comprehensive collection of easing functions inspired by GSAP, Anime.js, and p5.js
 * 
 * All functions take a normalized value (0-1) and return an eased value (0-1)
 */

export class Easing {
    // Linear - no easing
    static linear(t) {
        return t;
    }

    // Quadratic Easing
    static easeInQuad(t) {
        return t * t;
    }

    static easeOutQuad(t) {
        return t * (2 - t);
    }

    static easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // Cubic Easing
    static easeInCubic(t) {
        return t * t * t;
    }

    static easeOutCubic(t) {
        return --t * t * t + 1;
    }

    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // Quartic Easing
    static easeInQuart(t) {
        return t * t * t * t;
    }

    static easeOutQuart(t) {
        return 1 - --t * t * t * t;
    }

    static easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    }

    // Quintic Easing
    static easeInQuint(t) {
        return t * t * t * t * t;
    }

    static easeOutQuint(t) {
        return 1 + --t * t * t * t * t;
    }

    static easeInOutQuint(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }

    // Sine Easing
    static easeInSine(t) {
        return 1 - Math.cos(t * Math.PI / 2);
    }

    static easeOutSine(t) {
        return Math.sin(t * Math.PI / 2);
    }

    static easeInOutSine(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    // Exponential Easing
    static easeInExpo(t) {
        return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    }

    static easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    static easeInOutExpo(t) {
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
        return (2 - Math.pow(2, -20 * t + 10)) / 2;
    }

    // Circular Easing
    static easeInCirc(t) {
        return 1 - Math.sqrt(1 - t * t);
    }

    static easeOutCirc(t) {
        return Math.sqrt(1 - --t * t);
    }

    static easeInOutCirc(t) {
        return t < 0.5
            ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
            : (Math.sqrt(1 - 4 * (t - 1) * (t - 1)) + 1) / 2;
    }

    // Back Easing (overshoot)
    static easeInBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * t * t * t - c1 * t * t;
    }

    static easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    static easeInOutBack(t) {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return t < 0.5
            ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
            : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    }

    // Elastic Easing
    static easeInElastic(t) {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c4 = (2 * Math.PI) / 3;
        return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
    }

    static easeOutElastic(t) {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c4 = (2 * Math.PI) / 3;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    static easeInOutElastic(t) {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c5 = (2 * Math.PI) / 4.5;
        return t < 0.5
            ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
            : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
    }

    // Bounce Easing
    static easeInBounce(t) {
        return 1 - this.easeOutBounce(1 - t);
    }

    static easeOutBounce(t) {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }

    static easeInOutBounce(t) {
        return t < 0.5
            ? (1 - this.easeOutBounce(1 - 2 * t)) / 2
            : (1 + this.easeOutBounce(2 * t - 1)) / 2;
    }

    // Get easing function by name (string)
    static get(name) {
        const easings = {
            'linear': this.linear,
            'easeInQuad': this.easeInQuad,
            'easeOutQuad': this.easeOutQuad,
            'easeInOutQuad': this.easeInOutQuad,
            'easeInCubic': this.easeInCubic,
            'easeOutCubic': this.easeOutCubic,
            'easeInOutCubic': this.easeInOutCubic,
            'easeInQuart': this.easeInQuart,
            'easeOutQuart': this.easeOutQuart,
            'easeInOutQuart': this.easeInOutQuart,
            'easeInQuint': this.easeInQuint,
            'easeOutQuint': this.easeOutQuint,
            'easeInOutQuint': this.easeInOutQuint,
            'easeInSine': this.easeInSine,
            'easeOutSine': this.easeOutSine,
            'easeInOutSine': this.easeInOutSine,
            'easeInExpo': this.easeInExpo,
            'easeOutExpo': this.easeOutExpo,
            'easeInOutExpo': this.easeInOutExpo,
            'easeInCirc': this.easeInCirc,
            'easeOutCirc': this.easeOutCirc,
            'easeInOutCirc': this.easeInOutCirc,
            'easeInBack': this.easeInBack,
            'easeOutBack': this.easeOutBack,
            'easeInOutBack': this.easeInOutBack,
            'easeInElastic': this.easeInElastic,
            'easeOutElastic': this.easeOutElastic,
            'easeInOutElastic': this.easeInOutElastic,
            'easeInBounce': this.easeInBounce,
            'easeOutBounce': this.easeOutBounce,
            'easeInOutBounce': this.easeInOutBounce
        };
        return easings[name] || this.linear;
    }
}

export default Easing;

