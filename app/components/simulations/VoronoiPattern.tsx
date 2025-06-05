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

  // Voronoi parameters
  const int NUM_POINTS = 30;
  const float ANIMATION_SPEED = 0.05; // Reduced from 0.2 to 0.05
  const float COLOR_SPEED = 0.02; // Reduced from 0.05 to 0.02
  const float NOISE_SCALE = 0.3; // Reduced from 0.5 to 0.3 for subtler movement

  // Improved hash function for better randomness
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // 2D noise function
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Generate a pseudo-random position for a point
  vec2 randomPosition(float id) {
    // Use multiple hash calls for better distribution
    float x = hash(vec2(id * 1.234, id * 2.345));
    float y = hash(vec2(id * 3.456, id * 4.567));
    return vec2(x, y);
  }

  // Generate a pseudo-random velocity for a point
  vec2 randomVelocity(float id, float t) {
    // Use noise to create more organic movement
    vec2 noisePos = vec2(id * 0.1, t * 0.05); // Reduced time factor from 0.1 to 0.05
    float angle = noise(noisePos) * 6.28318;
    float speed = 0.3 + noise(noisePos + 100.0) * 0.3; // Reduced speed range
    return vec2(cos(angle), sin(angle)) * ANIMATION_SPEED * speed;
  }

  // Calculate point position at time t
  vec2 pointPosition(float id, float t) {
    vec2 pos = randomPosition(id);
    vec2 vel = randomVelocity(id, t);
    
    // Add some noise-based movement
    vec2 noiseOffset = vec2(
      noise(vec2(id * 0.1, t * 0.05)), // Reduced time factor
      noise(vec2(id * 0.1 + 100.0, t * 0.05))
    ) * NOISE_SCALE;
    
    // Combine all movements
    vec2 finalPos = pos + vel * t + noiseOffset;
    
    // Wrap around the screen
    return mod(finalPos, 1.0);
  }

  // Generate a color for a cell using theme colors
  vec3 cellColor(float id, float t) {
    float hue = mod(id * 0.1 + t * COLOR_SPEED, 1.0);
    // Mix between theme colors based on hue
    vec3 color1 = mix(themeLight, themeMid, hue);
    vec3 color2 = mix(themeDark, themeDarker, hue);
    return mix(color1, color2, hue);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    float time = u_time;
    vec3 color = themeDarker; // Base color
    float minDist = 1.0;
    float cellId = 0.0;
    
    // Find the closest point
    for (int i = 0; i < NUM_POINTS; i++) {
      float id = float(i);
      vec2 pos = pointPosition(id, time);
      // Scale position by aspect ratio
      pos.x *= aspect;
      float dist = length(uv - pos);
      
      if (dist < minDist) {
        minDist = dist;
        cellId = id;
      }
    }
    
    // Color the cell
    color = cellColor(cellId, time);
    
    // Add subtle cell borders using theme-darker
    float border = smoothstep(0.0, 0.005, minDist);
    color = mix(themeDarker, color, border);
    
    // Add very subtle glow using theme-mid
    float glow = 1.0 - minDist * 3.0;
    color += themeMid * glow * glow * 0.2;
    
    // Add very subtle pulsing
    float pulse = sin(time * 0.1) * 0.5 + 0.5; // Reduced from 0.2 to 0.1
    color *= 0.9 + pulse * 0.1;
    
    // Gamma correction
    color = pow(color, vec3(0.4545));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function VoronoiPattern() {
  return <BaseSimulation fragmentShader={fragmentShader} />;
} 