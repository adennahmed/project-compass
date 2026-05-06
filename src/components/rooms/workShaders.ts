/**
 * Four project-themed data-vis shaders, one per case study. Domain-
 * specific: a fleet route, a vital-signs trace, a deal-flow funnel,
 * a render queue. All single-pass, all sharing the same uniform
 * contract as buildShaders.ts (uTime, uActive).
 *
 * Per brief §5.7: each project's shader represents the project's
 * domain — they're not abstract decoration.
 */

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

/** Meridian — fleet console: a route line with a moving truck */
export const SHADER_FLEET = SHARED_PREFIX + /* glsl */ `
  void main() {
    vec2 uv = vUv;
    vec3 col = BG;

    // Subtle terrain stripes (background)
    for (int i = 0; i < 4; i++) {
      float ty = float(i) * 0.18 + 0.06;
      if (abs(uv.y - ty) < 0.0015) col += 0.04;
    }

    // The road — gentle wave
    float roadY = 0.5 + 0.05 * sin(uv.x * 7.0 + uTime * 0.08);
    if (abs(uv.y - roadY) < 0.005) col = BONE;

    // Lane dashes (above and below the road)
    float marchX = mod(uv.x * 28.0 - uTime * 6.0, 2.0);
    float dashLane = abs(uv.y - roadY) - 0.045;
    if (abs(dashLane) < 0.002 && marchX < 1.1) col = BONE_MUTE;

    // Truck — moving vermilion dot
    float truckX = fract(uTime * 0.08 + 0.1);
    float truckYLocal = 0.5 + 0.05 * sin(truckX * 7.0 + uTime * 0.08);
    vec2 truck = vec2(truckX, truckYLocal);
    float td = length(uv - truck);
    if (td < 0.022) col = mix(col, VERMILION, mix(0.5, 1.0, uActive));
    if (td < 0.04 && td >= 0.022) {
      col = mix(col, VERMILION * 0.4, 0.6 * mix(0.4, 1.0, uActive));
    }

    // Two checkpoint markers along the route
    float c1 = abs(uv.x - 0.2);
    float c2 = abs(uv.x - 0.65);
    if (c1 < 0.0025 && abs(uv.y - roadY) < 0.08) col = BONE_MUTE;
    if (c2 < 0.0025 && abs(uv.y - roadY) < 0.08) col = BONE_MUTE;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Kindred — clinician charting: ECG-style vital trace on a medical grid */
export const SHADER_VITALS = SHARED_PREFIX + /* glsl */ `
  void main() {
    vec2 uv = vUv;
    vec3 col = BG;

    // Medical-monitor grid
    for (int i = 1; i < 8; i++) {
      float gy = float(i) / 8.0;
      if (abs(uv.y - gy) < 0.001) col += 0.025;
    }
    for (int i = 1; i < 16; i++) {
      float gx = float(i) / 16.0;
      if (abs(uv.x - gx) < 0.0008) col += 0.018;
    }

    // ECG waveform — periodic complex
    float t = uv.x * 5.5 - uTime * 0.45;
    float beat = mod(t, 1.0);
    float w = 0.5;
    if (beat > 0.06 && beat < 0.16) w += 0.045 * sin((beat - 0.06) / 0.10 * 3.14159);
    if (beat > 0.18 && beat < 0.21) w -= 0.05;
    if (beat > 0.21 && beat < 0.25) w += 0.32 * (1.0 - abs((beat - 0.23) / 0.02));
    if (beat > 0.25 && beat < 0.29) w -= 0.07;
    if (beat > 0.40 && beat < 0.55) w += 0.075 * sin((beat - 0.40) / 0.15 * 3.14159);

    if (abs(uv.y - w) < 0.005) col = BONE;

    // Vermilion peak indicator at the most recent QRS spike
    float lastBeatX = (floor(t) + 0.23) / 5.5 + uTime * 0.45 / 5.5;
    lastBeatX = fract(lastBeatX);
    if (abs(uv.x - lastBeatX) < 0.0025 && uv.y > 0.55 && uv.y < 0.92) {
      col = mix(col, VERMILION, mix(0.4, 1.0, uActive));
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Tessera — deal-flow funnel: 5 narrowing stages, vermilion-active stage cycles */
export const SHADER_FUNNEL = SHARED_PREFIX + /* glsl */ `
  void main() {
    vec2 uv = vUv;
    vec3 col = BG;

    // 5 stages — wider at top, narrower at bottom
    float row = uv.y * 5.0;
    int idx = int(min(4.0, row));
    float yLocal = fract(row);

    float w = 0.95;
    if (idx == 1) w = 0.78;
    else if (idx == 2) w = 0.6;
    else if (idx == 3) w = 0.42;
    else if (idx == 4) w = 0.24;

    float distC = abs(uv.x - 0.5);

    // Stage interior
    if (distC < w * 0.5) {
      col = mix(BG, BONE_MUTE * 0.32, 0.6);
      // Stage divider line at the top of each cell
      if (yLocal < 0.04) col += 0.18;

      // Active stage cycles every 2.5s
      int actStage = int(mod(uTime * 0.4, 5.0));
      if (idx == actStage) {
        col = mix(col, VERMILION, 0.32 * mix(0.4, 1.0, uActive));
      }

      // Numeric "count" indicator dots near the right edge of each row
      float dotX = 0.5 + w * 0.5 - 0.05;
      if (abs(uv.x - dotX) < 0.005 && abs(yLocal - 0.5) < 0.02) col = BONE;
    }

    // Stage borders
    if (abs(distC - w * 0.5) < 0.002) col = BONE;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Lumen — render queue: 6 horizontal progress bars, one vermilion-active */
export const SHADER_QUEUE = SHARED_PREFIX + /* glsl */ `
  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    vec3 col = BG;

    int idx = int(min(5.0, uv.y * 6.0));
    float yLocal = fract(uv.y * 6.0);

    if (yLocal > 0.2 && yLocal < 0.8) {
      // Per-bar fill amount, animated, with phase offset per bar
      float seed = float(idx) * 7.13 + 1.0;
      float fill = 0.18 + 0.55 * (0.5 + 0.5 * sin(seed + uTime * 0.32));

      // Bar background
      col = mix(BG, BONE_MUTE * 0.28, 0.6);

      // Bar fill (bone)
      if (uv.x > 0.05 && uv.x < 0.05 + fill * 0.9) col = mix(col, BONE, 0.65);

      // Active bar (idx 2) — vermilion fill
      if (idx == 2 && uv.x > 0.05 && uv.x < 0.05 + fill * 0.9) {
        col = mix(col, VERMILION, mix(0.3, 0.95, uActive));
      }

      // Right-edge indicator
      float fillEnd = 0.05 + fill * 0.9;
      if (abs(uv.x - fillEnd) < 0.002) col = BONE;
    }

    // Left-margin "track" indicators
    if (uv.x < 0.04) col += 0.07;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const WORK_PANEL_SHADERS = [
  SHADER_FLEET,
  SHADER_VITALS,
  SHADER_FUNNEL,
  SHADER_QUEUE,
];
