/**
 * Default Configuration
 * Default values and settings for the application
 */

export const Defaults = {
    // Canvas settings
    canvas: {
        width: 800,
        height: 600,
        antialias: true,
        alpha: true
    },

    // Shader settings
    shader: {
        vertexShader: 'shaders/vertexShader.glsl',
        fragmentShader: 'shaders/fragmentShader.glsl'
    },

    // Particle system defaults
    particle: {
        count: 1000,
        size: 2.0,
        speed: 1.0,
        lifetime: 5.0,
        color: [1.0, 1.0, 1.0, 1.0]
    },

    // Ring effect defaults
    ring: {
        radius: 0.5,
        thickness: 0.05,
        glowIntensity: 10.0,
        animationSpeed: 0.5
    },

    // Color defaults
    colors: {
        background: [0.0, 0.0, 0.0, 1.0],
        primary: [0.2, 0.6, 1.0, 1.0],
        secondary: [1.0, 0.3, 0.6, 1.0],
        accent: [0.4, 1.0, 0.6, 1.0]
    },

    // Animation defaults
    animation: {
        fps: 60,
        speed: 1.0,
        easing: 'linear'
    },

    // UI defaults
    ui: {
        showControls: true,
        showCode: true,
        theme: 'dark'
    }
};

export default Defaults;

