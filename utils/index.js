/**
 * Utility Functions
 * General purpose helper functions
 */

/**
 * Debounce function calls
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function calls
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Deep clone an object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = deepClone(obj[key]);
        });
        return cloned;
    }
}

/**
 * Check if value is between min and max
 */
export function between(value, min, max) {
    return value >= min && value <= max;
}

/**
 * Map value from one range to another
 */
export function map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/**
 * Constrain value to range
 */
export function constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Get random element from array
 */
export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array (Fisher-Yates)
 */
export function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Format number with fixed decimal places
 */
export function formatNumber(num, decimals = 2) {
    return num.toFixed(decimals);
}

/**
 * Check if point is inside rectangle
 */
export function pointInRect(x, y, rectX, rectY, rectW, rectH) {
    return x >= rectX && x <= rectX + rectW && y >= rectY && y <= rectY + rectH;
}

/**
 * Get mouse/touch position relative to element
 */
export function getRelativePosition(event, element) {
    const rect = element.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

/**
 * Request animation frame with fallback
 */
export function requestAnimFrame(callback) {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback) {
               window.setTimeout(callback, 1000 / 60);
           };
}

export default {
    debounce,
    throttle,
    deepClone,
    between,
    map,
    constrain,
    randomChoice,
    shuffle,
    formatNumber,
    pointInRect,
    getRelativePosition,
    requestAnimFrame
};

