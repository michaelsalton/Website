'use client';

import BaseSimulation from './BaseSimulation';

const fragmentShader = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;

  // Theme colors
  const vec3 themeLight = vec3(0.69, 0.75, 0.74);  // #b0c0bc
  const vec3 themeMid = vec3(0.65, 0.65, 0.66);    // #a7a7a9
  const vec3 themeDark = vec3(0.47, 0.45, 0.44);   // #797270
  const vec3 themeDarker = vec3(0.27, 0.25, 0.24); // #453f3c

  // Fluid simulation parameters
  const float SPEED = 0.5;
  const float SCALE = 4.0;
  const float OCTAVES = 4.0;
  const float PERSISTENCE = 0.5;

  // Noise functions
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    
    for (float i = 0.0; i < OCTAVES; i++) {
      value += amplitude * noise(st);
      st *= SCALE;
      amplitude *= PERSISTENCE;
    }
    
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // Create flowing motion
    float time = u_time * SPEED;
    vec2 flow = vec2(
      fbm(uv * 2.0 + time * 0.5),
      fbm(uv * 2.0 + time * 0.5 + 1000.0)
    );
    
    // Add some turbulence
    vec2 turbulence = vec2(
      fbm(uv * 4.0 + flow * 2.0 + time),
      fbm(uv * 4.0 + flow * 2.0 + time + 1000.0)
    );
    
    // Combine effects
    vec2 finalUV = uv + flow * 0.2 + turbulence * 0.1;
    float pattern = fbm(finalUV * 3.0);
    
    // Create color gradient using theme colors
    vec3 color = mix(
      themeDarker,  // Darker base
      themeLight,   // Light highlights
      pattern
    );
    
    // Add some highlights using theme-mid
    color += themeMid * pow(pattern, 2.0) * 0.2;
    
    // Add subtle pulsing
    float pulse = sin(u_time * 0.5) * 0.5 + 0.5;
    color *= 0.8 + pulse * 0.2;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function FluidSimulation() {
  return <BaseSimulation fragmentShader={fragmentShader} />;
} 