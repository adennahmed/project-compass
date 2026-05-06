/**
 * Portrait shader — pixel-quantize + RGB-split that resolves on hover.
 *
 * At uHover=0: heavy pixelation, channel offset, desaturated.
 * At uHover=1: clean photo, no offset, full saturation.
 *
 * Per brief §5.8.
 */
export const STUDIO_PORTRAIT_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;
  uniform sampler2D uTex;

  void main() {
    vec2 uv = vUv;

    // Pixelation grid — coarse at rest, dense on hover (quadratic for snap)
    float h = clamp(uHover, 0.0, 1.0);
    float cells = mix(36.0, 360.0, h * h);
    vec2 puv = floor(uv * cells) / cells + 0.5 / cells;

    // RGB-split offset stronger at rest, zero at full hover
    float split = (1.0 - h) * 0.014;
    vec3 col;
    col.r = texture2D(uTex, puv + vec2(split, 0.0)).r;
    col.g = texture2D(uTex, puv).g;
    col.b = texture2D(uTex, puv - vec2(split, 0.0)).b;

    // Slight desaturation at rest, recover toward hover
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(lum), col, mix(0.55, 1.0, h));

    // Cool tint shift toward palette (bias the blacks toward ink-rise)
    col = mix(col, col * vec3(0.95, 0.97, 1.05), 0.18);

    // Soft vignette
    vec2 d = abs(uv - 0.5) * 2.0;
    float vig = 1.0 - smoothstep(0.82, 1.05, max(d.x, d.y));
    col *= mix(0.7, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;
