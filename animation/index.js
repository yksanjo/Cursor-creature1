/**
 * Animation System - Main Export
 * Complete animation system inspired by GSAP, Anime.js, and p5.js
 */

import { Easing } from './Easing.js';
import { Tween } from './Tween.js';
import { Timeline } from './Timeline.js';
import { AnimationManager, getAnimationManager } from './AnimationManager.js';

export { Easing, Tween, Timeline, AnimationManager, getAnimationManager };

/**
 * Create and play a simple tween
 */
export function animate(target, property, to, duration, easing = 'linear', onComplete = null) {
    const manager = getAnimationManager();
    const from = typeof property === 'string' ? target[property] : property();
    const tween = new Tween(target, property, from, to, duration, easing, null, onComplete);
    tween.play();
    manager.addTween(tween);
    return tween;
}

/**
 * Create a new timeline
 */
export function timeline() {
    return new Timeline();
}

/**
 * Get the animation manager
 */
export function manager() {
    return getAnimationManager();
}

// Export default object
const animationSystem = {
    Easing,
    Tween,
    Timeline,
    AnimationManager,
    getAnimationManager,
    animate,
    timeline,
    manager
};

export default animationSystem;

