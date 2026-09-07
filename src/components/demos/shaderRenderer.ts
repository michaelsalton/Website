/**
 * Minimal WebGL2 fragment-shader renderer.
 *
 * Deliberately dependency-free: this module is dynamically imported by DemoFrame.astro
 * only when a demo scrolls into view, so it costs nothing on pages that have no demo
 * and nothing above the fold. Anything heavier (three.js, a physics lib) belongs in a
 * sibling module imported the same way — never in a top-level page import.
 */

const VERTEX_SHADER = /* glsl */ `#version 300 es
// Fullscreen triangle: cheaper than a quad and needs no attribute buffers.
void main() {
  vec2 pos = vec2(
    float((gl_VertexID & 1) << 2) - 1.0,
    float((gl_VertexID & 2) << 1) - 1.0
  );
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

// Domain-warped sine field — organic banding without a noise texture.
float field(vec2 p, float t) {
  float v = 0.0;
  v += sin(p.x * 1.7 + t * 0.35);
  v += sin(p.y * 2.1 - t * 0.28);
  v += sin((p.x + p.y) * 1.3 + t * 0.22);
  v += sin(length(p * 1.4) * 2.3 - t * 0.45);
  return v * 0.25;
}

void main() {
  // Aspect-corrected, origin-centred coordinates.
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);

  // Warp the domain by a second field evaluation for a fluid, non-repeating look.
  vec2 warp = vec2(
    field(uv + vec2(1.3, 0.7), u_time),
    field(uv - vec2(0.8, 1.1), u_time)
  );
  float v = field(uv + warp * 0.9, u_time);

  // Palette tuned to the site accent hue. Adjust alongside --c-accent in global.css.
  vec3 deep = vec3(0.09, 0.10, 0.20);
  vec3 mid = vec3(0.29, 0.33, 0.78);
  vec3 hot = vec3(0.62, 0.78, 0.98);

  float t = smoothstep(-0.6, 0.9, v);
  vec3 color = mix(deep, mid, smoothstep(0.0, 0.65, t));
  color = mix(color, hot, smoothstep(0.55, 1.0, t));

  // Vignette so the frame edges recede instead of ending abruptly.
  color *= 1.0 - 0.35 * smoothstep(0.7, 1.6, length(uv));

  fragColor = vec4(color, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
}

function link(gl: WebGL2RenderingContext): WebGLProgram {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // Shaders can be released as soon as they are linked into the program.
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed: ${log}`);
  }
  return program;
}

export interface DemoHandle {
  /** Start or resume the render loop. No-op if already running. */
  play(): void;
  /** Pause the loop, keeping GPU resources alive. */
  pause(): void;
  /** Release GL resources and drop listeners. */
  destroy(): void;
  readonly running: boolean;
}

/**
 * Attaches a shader demo to `canvas`.
 *
 * Returns `null` when WebGL2 is unavailable so the caller can keep the poster image
 * visible rather than showing an empty black box.
 */
export function createShaderDemo(canvas: HTMLCanvasElement): DemoHandle | null {
  const context = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    // The frame is re-rendered every tick, so the browser need not preserve it.
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  });
  if (!context) return null;

  // Rebound to a non-nullable local: the closures below would otherwise each need a
  // non-null assertion, since narrowing doesn't reach into them.
  const gl: WebGL2RenderingContext = context;

  let program: WebGLProgram;
  try {
    program = link(gl);
  } catch (error) {
    // A driver-specific compile failure should degrade to the poster, not break the page.
    console.warn('[shaderRenderer]', error);
    return null;
  }

  gl.useProgram(program);
  const uResolution = gl.getUniformLocation(program, 'u_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');

  let frame = 0;
  let running = false;
  let elapsed = 0;
  let lastTimestamp = 0;

  // Capped so a 3x-DPR phone doesn't render 9x the pixels for a background effect.
  const maxDpr = 2;

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uResolution, width, height);
    }
  }

  function draw(): void {
    gl.uniform1f(uTime, elapsed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function tick(timestamp: number): void {
    if (!running) return;

    // Accumulate our own clock so pausing doesn't produce a time jump on resume.
    const delta = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0;
    lastTimestamp = timestamp;
    // Clamp: a backgrounded tab can hand back a multi-second delta.
    elapsed += Math.min(delta, 1 / 30);

    resize();
    draw();
    frame = requestAnimationFrame(tick);
  }

  const observer = new ResizeObserver(() => {
    resize();
    // Repaint immediately so a resize while paused isn't left stretched.
    if (!running) draw();
  });
  observer.observe(canvas);

  resize();
  draw();

  return {
    play(): void {
      if (running) return;
      running = true;
      lastTimestamp = 0;
      frame = requestAnimationFrame(tick);
    },
    pause(): void {
      running = false;
      lastTimestamp = 0;
      cancelAnimationFrame(frame);
    },
    destroy(): void {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteProgram(program);
      // Frees the drawing buffer immediately instead of waiting for GC.
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
    get running(): boolean {
      return running;
    },
  };
}
