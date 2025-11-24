/**
 * Fade Utilities
 * Easing functions and fade effects
 */

export class Fade {
    /**
     * Linear interpolation
     */
    static linear(t) {
        return t;
    }

    /**
     * Ease in (quadratic)
     */
    static easeIn(t) {
        return t * t;
    }

    /**
     * Ease out (quadratic)
     */
    static easeOut(t) {
        return t * (2 - t);
    }

    /**
     * Ease in-out (quadratic)
     */
    static easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /**
     * Ease in (cubic)
     */
    static easeInCubic(t) {
        return t * t * t;
    }

    /**
     * Ease out (cubic)
     */
    static easeOutCubic(t) {
        return --t * t * t + 1;
    }

    /**
     * Ease in-out (cubic)
     */
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    /**
     * Sine ease in
     */
    static easeInSine(t) {
        return 1 - Math.cos(t * Math.PI / 2);
    }

    /**
     * Sine ease out
     */
    static easeOutSine(t) {
        return Math.sin(t * Math.PI / 2);
    }

    /**
     * Sine ease in-out
     */
    static easeInOutSine(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    /**
     * Exponential ease in
     */
    static easeInExpo(t) {
        return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    }

    /**
     * Exponential ease out
     */
    static easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    /**
     * Elastic ease out
     */
    static easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    /**
     * Bounce ease out
     */
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

    /**
     * Fade value between start and end
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Progress (0-1)
     * @param {Function} easing - Easing function
     */
    static fade(start, end, t, easing = this.linear) {
        return start + (end - start) * easing(t);
    }

    /**
     * Ping-pong fade (oscillates between start and end)
     */
    static pingPong(t, easing = this.linear) {
        return t < 0.5 ? easing(t * 2) : easing(2 - t * 2);
    }
}

export default Fade;

