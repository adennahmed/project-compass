/**
 * Four thematic data-vis shaders, one per service. Each panel is a
 * single-pass fragment shader — no post-processing, low cost. The
 * vermilion accent's intensity is gated by `uActive` (0..1) so the
 * highlighted panel reads as "live" while the others sit muted.
 *
 * Per brief §4.4 / §5.6 / §6: the brand identity *is* the dashboard
 * vocabulary. These aren't decorative shapes — they're stylised
 * versions of what Kozai actually builds.
 */

export const PANEL_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SHARED_PREFIX = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uActive;

  const vec3 BG          = vec3(0.04, 0.05, 0.08);
  const vec3 BONE        = vec3(0.91, 0.89, 0.84);
  const vec3 BONE_MUTE   = vec3(0.48, 0.49, 0.54);
  const vec3 VERMILION   = vec3(1.0, 0.36, 0.16);
`;

/** Internal tools & dashboards — area chart with grid + accent line */
export const SHADER_CHART = SHARED_PREFIX + /* glsl */ `
  void main() {
    vec2 uv = vUv;
    vec3 col = BG;

    // Grid — horizontal hairlines
    for (int i = 1; i < 4; i++) {
      float y = float(i) * 0.25;
      if (abs(uv.y - y) < 0.0015) col += 0.06;
    }
    for (int i = 1; i < 8; i++) {
      float x = float(i) / 8.0;
      if (abs(uv.x - x) < 0.001) col += 0.04;
    }

    // Background fill area (under bone wave)
    float w1 = 0.34 + 0.13 * sin(uv.x * 5.6 + uTime * 0.22)
                    + 0.06 * sin(uv.x * 13.5 + uTime * 0.65);
    if (uv.y < w1) col = mix(col, BONE_MUTE * 0.4, 0.55);

    // Bone wave line (primary series)
    if (abs(uv.y - w1) < 0.005) col = BONE;

    // Vermilion accent series — single hot line up top
    float w2 = 0.62 + 0.07 * sin(uv.x * 4.2 + uTime * 0.18 + 1.2);
    float lineW2 = step(abs(uv.y - w2), 0.005);
    col = mix(col, VERMILION, lineW2 * mix(0.35, 1.0, uActive));

    // Cursor — vertical hairline at a moving x position
    float cursorX = 0.18 + 0.6 * (0.5 + 0.5 * sin(uTime * 0.35));
    if (abs(uv.x - cursorX) < 0.0015) col = mix(col, BONE, 0.5);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Workflow automation — directed graph with flowing edge */
export const SHADER_FLOW = SHARED_PREFIX + /* glsl */ `
  float lseg(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void main() {
    vec2 uv = vUv;
    vec3 col = BG;

    // 5 nodes — laid out as a small graph
    vec2 n0 = vec2(0.13, 0.62);
    vec2 n1 = vec2(0.34, 0.85);
    vec2 n2 = vec2(0.52, 0.32);
    vec2 n3 = vec2(0.72, 0.7);
    vec2 n4 = vec2(0.88, 0.42);

    // Edges
    float e01 = lseg(uv, n0, n1);
    float e12 = lseg(uv, n1, n2);
    float e23 = lseg(uv, n2, n3);
    float e13 = lseg(uv, n1, n3);
    float e34 = lseg(uv, n3, n4);

    float minE = min(min(min(min(e01, e12), e13), e23), e34);
    if (minE < 0.0028) col = BONE_MUTE;

    // Vermilion active edge — n2 -> n3
    if (e23 < 0.0035) col = mix(BONE_MUTE, VERMILION, mix(0.3, 1.0, uActive));

    // Flowing dot along the active edge
    float t = mod(uTime * 0.4, 1.0);
    vec2 flow = mix(n2, n3, t);
    if (length(uv - flow) < 0.014) col = VERMILION * mix(0.5, 1.0, uActive);

    // Nodes
    if (length(uv - n0) < 0.022) col = BONE;
    if (length(uv - n1) < 0.022) col = BONE;
    if (length(uv - n2) < 0.024) col = BONE;
    if (length(uv - n3) < 0.024) col = BONE;
    if (length(uv - n4) < 0.022) col = BONE;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Client-facing platforms — pulsing tile grid with one vermilion cell */
export const SHADER_GRID = SHARED_PREFIX + /* glsl */ `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    vec3 col = BG;

    vec2 cells = vec2(8.0, 4.0);
    vec2 idx = floor(uv * cells);
    vec2 inCell = fract(uv * cells);

    // Tile mask with margin
    vec2 m = step(0.08, inCell) * step(inCell, vec2(0.92));
    float mask = m.x * m.y;

    // Per-tile pulse with random seed
    float seed = idx.x * 13.7 + idx.y * 7.13;
    float pulse = 0.18 + 0.5 * (0.5 + 0.5 * sin(seed * 1.7 + uTime * 0.35));
    vec3 tile = BONE * pulse;

    if (mask > 0.5) col = mix(col, tile, 0.7);

    // One specific cell glows vermilion (the "live" tile)
    bool isHot = (idx.x == 5.0 && idx.y == 2.0);
    if (mask > 0.5 && isHot) {
      col = mix(col, VERMILION * mix(0.55, 1.0, uActive), 0.85);
    }

    // Border at the active cell
    if (isHot) {
      vec2 d = abs(inCell - 0.5) - 0.42;
      float border = step(max(d.x, d.y), 0.0) - step(max(d.x, d.y), -0.018);
      if (border > 0.5) col = VERMILION;
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Data & decision support — historical line + forecast cone */
export const SHADER_FORECAST = SHARED_PREFIX + /* glsl */ `
  void main() {
    vec2 uv = vUv;
    vec3 col = BG;

    float xMid = 0.42;
    float baseline = 0.5;

    // Historical wobble — only on left half
    float histWobble = 0.1 * sin(uv.x * 18.0 + uTime * 0.3);
    baseline += histWobble * 0.6 * smoothstep(xMid, 0.0, uv.x);

    // Cone half-width grows linearly to the right
    float coneT = max(0.0, (uv.x - xMid)) / max(0.0001, (1.0 - xMid));
    float coneHalf = coneT * 0.4;

    // Center line — solid on left
    if (abs(uv.y - baseline) < 0.0035 && uv.x < xMid) col = BONE;

    // Center line — dashed on right (forecast)
    if (abs(uv.y - baseline) < 0.0035 && uv.x >= xMid) {
      if (mod(uv.x * 80.0 - uTime * 4.5, 2.0) < 1.2) {
        col = mix(BONE, VERMILION, mix(0.25, 0.85, uActive));
      }
    }

    // Cone fill (translucent vermilion)
    if (uv.x >= xMid && abs(uv.y - baseline) < coneHalf) {
      col = mix(col, VERMILION * 0.45, 0.32 * mix(0.5, 1.0, uActive));
    }

    // Cone edges
    if (uv.x >= xMid) {
      float upper = abs((uv.y - baseline) - coneHalf);
      float lower = abs((uv.y - baseline) + coneHalf);
      if (upper < 0.0028 || lower < 0.0028) {
        col = mix(col, VERMILION, mix(0.45, 1.0, uActive));
      }
    }

    // Vertical "now" marker at xMid
    if (abs(uv.x - xMid) < 0.0018) col = mix(col, BONE_MUTE, 0.7);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const BUILD_PANEL_SHADERS = [
  SHADER_CHART,
  SHADER_FLOW,
  SHADER_GRID,
  SHADER_FORECAST,
];
