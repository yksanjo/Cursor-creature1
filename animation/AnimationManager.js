/**
 * Animation Manager
 * Centralized animation loop using requestAnimationFrame
 * Optimized for performance with automatic cleanup
 * 
 * Inspired by GSAP, Anime.js, and p5.js animation patterns
 */

export class AnimationManager {
    constructor() {
        this.tweens = [];
        this.timelines = [];
        this.animations = [];
        this.isRunning = false;
        this.rafId = null;
        this.lastTime = null;
        this.frameCount = 0;
        this.fps = 60;
        this.deltaTime = 0;
        
        // Performance monitoring
        this.performance = {
            frameTime: 0,
            averageFrameTime: 0,
            frameTimeHistory: []
        };
    }

    /**
     * Add a tween to be managed
     */
    addTween(tween) {
        this.tweens.push(tween);
        if (!this.isRunning) {
            this.start();
        }
        return tween;
    }

    /**
     * Add a timeline to be managed
     */
    addTimeline(timeline) {
        this.timelines.push(timeline);
        if (!this.isRunning) {
            this.start();
        }
        return timeline;
    }

    /**
     * Add a custom animation function
     */
    addAnimation(animationFn) {
        this.animations.push(animationFn);
        if (!this.isRunning) {
            this.start();
        }
        return animationFn;
    }

    /**
     * Remove a tween
     */
    removeTween(tween) {
        const index = this.tweens.indexOf(tween);
        if (index > -1) {
            this.tweens.splice(index, 1);
        }
    }

    /**
     * Remove a timeline
     */
    removeTimeline(timeline) {
        const index = this.timelines.indexOf(timeline);
        if (index > -1) {
            this.timelines.splice(index, 1);
        }
    }

    /**
     * Remove an animation
     */
    removeAnimation(animationFn) {
        const index = this.animations.indexOf(animationFn);
        if (index > -1) {
            this.animations.splice(index, 1);
        }
    }

    /**
     * Start the animation loop
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.animate();
    }

    /**
     * Stop the animation loop
     */
    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /**
     * Update animations (call this from your own requestAnimationFrame loop)
     */
    update(currentTime) {
        if (!this.isRunning) return;

        // Calculate delta time
        if (this.lastTime === null) {
            this.lastTime = currentTime;
        }
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Performance monitoring
        this.performance.frameTime = this.deltaTime;
        this.performance.frameTimeHistory.push(this.deltaTime);
        if (this.performance.frameTimeHistory.length > 60) {
            this.performance.frameTimeHistory.shift();
        }
        this.performance.averageFrameTime = 
            this.performance.frameTimeHistory.reduce((a, b) => a + b, 0) / 
            this.performance.frameTimeHistory.length;

        // Update tweens
        this.tweens = this.tweens.filter(tween => {
            const completed = tween.update(currentTime);
            return !completed; // Remove completed tweens
        });

        // Update timelines
        this.timelines = this.timelines.filter(timeline => {
            const completed = timeline.update(currentTime);
            return !completed; // Remove completed timelines
        });

        // Update custom animations
        this.animations.forEach(animationFn => {
            animationFn(currentTime, this.deltaTime);
        });

        this.frameCount++;

        // Auto-stop if nothing to animate (but keep running if custom animations exist)
        if (this.tweens.length === 0 && 
            this.timelines.length === 0 && 
            this.animations.length === 0) {
            // Don't auto-stop, let the main loop handle it
        }
    }

    /**
     * Main animation loop using requestAnimationFrame
     * Use this if you want the manager to handle the loop
     */
    animate = (currentTime) => {
        if (!this.isRunning) return;

        this.rafId = requestAnimationFrame(this.animate);
        this.update(currentTime);
    }

    /**
     * Get current FPS
     */
    getFPS() {
        if (this.performance.averageFrameTime === 0) return 0;
        return 1000 / this.performance.averageFrameTime;
    }

    /**
     * Clear all animations
     */
    clear() {
        this.tweens = [];
        this.timelines = [];
        this.animations = [];
    }

    /**
     * Pause all animations
     */
    pauseAll() {
        this.tweens.forEach(tween => tween.pause());
        this.timelines.forEach(timeline => timeline.pause());
    }

    /**
     * Resume all animations
     */
    resumeAll() {
        this.tweens.forEach(tween => tween.play());
        this.timelines.forEach(timeline => timeline.play());
    }
}

// Singleton instance
let animationManagerInstance = null;

/**
 * Get the global animation manager instance
 */
export function getAnimationManager() {
    if (!animationManagerInstance) {
        animationManagerInstance = new AnimationManager();
    }
    return animationManagerInstance;
}

export default AnimationManager;

