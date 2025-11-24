/**
 * Timeline Animation System
 * Inspired by GSAP Timeline
 * Manages multiple tweens with sequencing, delays, and parallel execution
 */

import { Tween } from './Tween.js';

export class Timeline {
    constructor() {
        this.tweens = [];
        this.startTime = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.pauseTime = null;
        this.duration = 0;
        this.onComplete = null;
        this.onUpdate = null;
    }

    /**
     * Add a tween to the timeline
     * @param {Object} config - Tween configuration
     * @param {*} config.target - Target object
     * @param {string|Function} config.property - Property to animate
     * @param {number} config.from - Start value
     * @param {number} config.to - End value
     * @param {number} config.duration - Duration in ms
     * @param {string|Function} config.easing - Easing function
     * @param {number} config.delay - Delay before starting (ms)
     * @param {Function} config.onUpdate - Update callback
     * @param {Function} config.onComplete - Complete callback
     */
    to(config) {
        const tween = new Tween(
            config.target,
            config.property,
            config.from,
            config.to,
            config.duration || 1000,
            config.easing || 'linear',
            config.onUpdate,
            config.onComplete
        );

        // Calculate timeline position
        const startTime = (config.delay || 0);
        const endTime = startTime + tween.duration;
        
        tween.timelineStartTime = startTime;
        tween.timelineEndTime = endTime;
        
        this.tweens.push(tween);
        this.duration = Math.max(this.duration, endTime);

        return this;
    }

    /**
     * Add multiple tweens in parallel (same start time)
     */
    parallel(configs) {
        const maxDelay = Math.max(...configs.map(c => c.delay || 0));
        configs.forEach(config => {
            config.delay = maxDelay; // Start all at the same time
            this.to(config);
        });
        return this;
    }

    /**
     * Add a delay
     */
    delay(ms) {
        // Create a dummy tween for delay
        const delayTween = {
            timelineStartTime: this.duration,
            timelineEndTime: this.duration + ms,
            duration: ms,
            update: () => false
        };
        this.tweens.push(delayTween);
        this.duration += ms;
        return this;
    }

    /**
     * Start the timeline
     */
    play() {
        if (this.isPaused) {
            const pauseDuration = this.pauseTime - this.startTime;
            this.startTime = performance.now() - pauseDuration;
            this.isPaused = false;
        } else {
            this.startTime = performance.now();
        }
        this.isPlaying = true;
        return this;
    }

    /**
     * Pause the timeline
     */
    pause() {
        if (this.isPlaying && !this.isPaused) {
            this.pauseTime = performance.now();
            this.isPaused = true;
        }
        return this;
    }

    /**
     * Stop and reset the timeline
     */
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.startTime = null;
        this.tweens.forEach(tween => {
            if (tween.stop) tween.stop();
        });
        return this;
    }

    /**
     * Update the timeline (called by AnimationManager)
     */
    update(currentTime) {
        if (!this.isPlaying || this.isPaused) return false;

        if (this.startTime === null) {
            this.startTime = currentTime;
        }

        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);

        // Update all active tweens
        let allComplete = true;
        this.tweens.forEach(tween => {
            if (tween.update) {
                // Check if tween should be active
                const tweenElapsed = elapsed - (tween.timelineStartTime || 0);
                if (tweenElapsed >= 0 && tweenElapsed < tween.duration) {
                    // Create a fake time for the tween
                    const tweenTime = this.startTime + tween.timelineStartTime + tweenElapsed;
                    if (tween.update(tweenTime)) {
                        // Tween completed
                    }
                    allComplete = false;
                } else if (tweenElapsed < 0) {
                    // Tween hasn't started yet
                    allComplete = false;
                }
            }
        });

        // Call update callback
        if (this.onUpdate) {
            this.onUpdate(progress, elapsed);
        }

        // Check if timeline is complete
        if (progress >= 1 || allComplete) {
            this.isPlaying = false;
            if (this.onComplete) {
                this.onComplete();
            }
            return true;
        }

        return false;
    }

    /**
     * Set completion callback
     */
    onComplete(callback) {
        this.onComplete = callback;
        return this;
    }

    /**
     * Set update callback
     */
    onUpdate(callback) {
        this.onUpdate = callback;
        return this;
    }
}

export default Timeline;

