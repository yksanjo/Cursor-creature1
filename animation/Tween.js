/**
 * Tween Animation System
 * Inspired by GSAP and Anime.js
 * Handles individual property animations with easing
 */

import { Easing } from './Easing.js';

export class Tween {
    constructor(target, property, from, to, duration, easing = 'linear', onUpdate = null, onComplete = null) {
        this.target = target;
        this.property = property;
        this.from = from;
        this.to = to;
        this.duration = duration;
        this.easing = typeof easing === 'string' ? Easing.get(easing) : easing;
        this.onUpdate = onUpdate;
        this.onComplete = onComplete;
        
        this.startTime = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.pauseTime = null;
        this.progress = 0;
    }

    /**
     * Start the tween
     */
    play() {
        if (this.isPaused) {
            // Resume from pause
            this.startTime = performance.now() - (this.pauseTime - this.startTime);
            this.isPaused = false;
        } else {
            // Start fresh
            this.startTime = performance.now();
            this.progress = 0;
        }
        this.isPlaying = true;
        return this;
    }

    /**
     * Pause the tween
     */
    pause() {
        if (this.isPlaying && !this.isPaused) {
            this.pauseTime = performance.now();
            this.isPaused = true;
        }
        return this;
    }

    /**
     * Stop and reset the tween
     */
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.progress = 0;
        return this;
    }

    /**
     * Update the tween (called by AnimationManager)
     */
    update(currentTime) {
        if (!this.isPlaying || this.isPaused) return false;

        if (this.startTime === null) {
            this.startTime = currentTime;
        }

        const elapsed = currentTime - this.startTime;
        this.progress = Math.min(elapsed / this.duration, 1);

        // Calculate eased value
        const easedProgress = this.easing(this.progress);
        const currentValue = this.from + (this.to - this.from) * easedProgress;

        // Update target property
        if (this.target && this.property) {
            if (typeof this.property === 'string') {
                this.target[this.property] = currentValue;
            } else if (typeof this.property === 'function') {
                this.property(currentValue);
            }
        }

        // Call update callback
        if (this.onUpdate) {
            this.onUpdate(currentValue, this.progress);
        }

        // Check if complete
        if (this.progress >= 1) {
            this.isPlaying = false;
            if (this.onComplete) {
                this.onComplete();
            }
            return true; // Signal completion
        }

        return false;
    }

    /**
     * Set easing function
     */
    setEasing(easing) {
        this.easing = typeof easing === 'string' ? Easing.get(easing) : easing;
        return this;
    }

    /**
     * Chain another tween (returns new tween)
     */
    then(target, property, to, duration, easing = 'linear') {
        const nextTween = new Tween(target, property, this.to, to, duration, easing);
        this.onComplete = () => nextTween.play();
        return nextTween;
    }
}

export default Tween;

