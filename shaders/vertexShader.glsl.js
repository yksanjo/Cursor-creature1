// This file loads the vertex shader code
// In a real implementation, you'd load this via fetch or include it directly
export const vertexShader = `
void main() {
    gl_Position = vec4(position, 1.0);
}
`;

