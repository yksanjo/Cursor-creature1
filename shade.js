/**
 * Shader Utilities
 * Helper functions for working with shaders and WebGL
 */

export class ShaderUtils {
    /**
     * Load a shader from a URL
     * @param {WebGLRenderingContext} gl - WebGL context
     * @param {number} type - Shader type (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
     * @param {string} source - Shader source code
     * @returns {WebGLShader} Compiled shader
     */
    static loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(`Shader compilation error: ${error}`);
        }

        return shader;
    }

    /**
     * Create a shader program from vertex and fragment shaders
     * @param {WebGLRenderingContext} gl - WebGL context
     * @param {string} vertexSource - Vertex shader source
     * @param {string} fragmentSource - Fragment shader source
     * @returns {WebGLProgram} Shader program
     */
    static createProgram(gl, vertexSource, fragmentSource) {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(`Program linking error: ${error}`);
        }

        return program;
    }

    /**
     * Get uniform location with error handling
     * @param {WebGLRenderingContext} gl - WebGL context
     * @param {WebGLProgram} program - Shader program
     * @param {string} name - Uniform name
     * @returns {WebGLUniformLocation} Uniform location
     */
    static getUniformLocation(gl, program, name) {
        const location = gl.getUniformLocation(program, name);
        if (!location) {
            console.warn(`Uniform "${name}" not found in shader program`);
        }
        return location;
    }

    /**
     * Set uniform value (type-safe)
     * @param {WebGLRenderingContext} gl - WebGL context
     * @param {WebGLUniformLocation} location - Uniform location
     * @param {*} value - Value to set
     */
    static setUniform(gl, location, value) {
        if (!location) return;

        if (typeof value === 'number') {
            gl.uniform1f(location, value);
        } else if (value instanceof Float32Array) {
            if (value.length === 2) {
                gl.uniform2fv(location, value);
            } else if (value.length === 3) {
                gl.uniform3fv(location, value);
            } else if (value.length === 4) {
                gl.uniform4fv(location, value);
            }
        } else if (value instanceof Array) {
            if (value.length === 2) {
                gl.uniform2f(location, value[0], value[1]);
            } else if (value.length === 3) {
                gl.uniform3f(location, value[0], value[1], value[2]);
            } else if (value.length === 4) {
                gl.uniform4f(location, value[0], value[1], value[2], value[3]);
            }
        }
    }
}

export default ShaderUtils;

