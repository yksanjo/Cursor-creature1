/**
 * WebGL Utilities
 * Helper functions for WebGL context and operations
 */

export class WebGLUtils {
    /**
     * Get WebGL context from canvas
     */
    static getContext(canvas, options = {}) {
        const defaults = {
            alpha: true,
            antialias: true,
            depth: true,
            stencil: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false
        };

        const opts = { ...defaults, ...options };
        
        let gl = canvas.getContext('webgl2', opts) || 
                 canvas.getContext('webgl', opts) ||
                 canvas.getContext('experimental-webgl', opts);

        if (!gl) {
            throw new Error('WebGL not supported');
        }

        return gl;
    }

    /**
     * Create and compile shader
     */
    static createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(`Shader compilation error: ${info}`);
        }

        return shader;
    }

    /**
     * Create shader program
     */
    static createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(`Program linking error: ${info}`);
        }

        return program;
    }

    /**
     * Resize canvas to match display size
     */
    static resizeCanvasToDisplaySize(canvas, multiplier = 1) {
        const width = Math.floor(canvas.clientWidth * multiplier);
        const height = Math.floor(canvas.clientHeight * multiplier);
        
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    }

    /**
     * Create texture from image
     */
    static createTexture(gl, image) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        return texture;
    }

    /**
     * Create framebuffer
     */
    static createFramebuffer(gl, width, height) {
        const framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

        return { framebuffer, texture };
    }

    /**
     * Clear canvas with color
     */
    static clear(gl, r = 0, g = 0, b = 0, a = 1) {
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Set viewport
     */
    static setViewport(gl, x, y, width, height) {
        gl.viewport(x, y, width, height);
    }
}

export default WebGLUtils;

