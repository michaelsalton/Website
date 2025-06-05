'use client';

import { useEffect, useRef, useState } from 'react';
// import BaseSimulation from './BaseSimulation'; // No longer using BaseSimulation
import { Solver } from '../../../src/game/solver'; // Correct import path for Solver
import {
  createProgramInfo,
  setBuffersAndAttributes,
  setUniforms,
  createBufferInfoFromArrays, // Import by name
  resizeCanvasToDisplaySize, // Import by name
  BufferInfo, // Import BufferInfo type
  AttribArray, // Import AttribArray type
  loadContext // Import loadContext directly
} from '../../../src/utils/glUtil'; // Correct import path for glUtil
import { Vec2, Ray } from '../../../src/utils/math'; // Correct import path for math
import { motion } from 'framer-motion';

// Basic vertex shader for 2D positions
const vsSource = `
  attribute vec4 a_position;
  uniform vec2 u_resolution;

  void main() {
    // convert the rectangle from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position.xy / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`;

// Basic fragment shader for plain color
const fsSourcePlainColor = `
  precision highp float;

  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color;
  }
`;

// Vertex shader for walls (passing distance and color as attributes)
const vsSourceWalls = `
    attribute vec4 a_position;
    attribute float a_distance;
    attribute vec4 a_color;

    uniform vec2 u_resolution;
    uniform float u_renderDistance;

    varying float v_distance; // Pass distance to fragment shader
    varying vec4 v_color;     // Pass color to fragment shader

    void main() {
        vec2 zeroToOne = a_position.xy / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpaceXY = zeroToTwo - 1.0;

        // Map distance to clip space z
        // Distance 0 should be close (e.g., -1), renderDistance should be far (e.g., 1)
        float clipSpaceZ = (a_distance / u_renderDistance) * 2.0 - 1.0;

        gl_Position = vec4(clipSpaceXY * vec2(1, -1), clipSpaceZ, 1);

        v_distance = a_distance; // Pass attribute to varying
        v_color = a_color;       // Pass attribute to varying
    }
`;

// Fragment shader for walls (using varying distance and color)
const fsSourceWalls = `
  precision highp float;

  varying vec4 v_color; // Use varying for color
  varying float v_distance; // Use varying for distance
  uniform float u_renderDistance;

  void main() {
    // Simple distance-based shading
    float brightness = 1.0 - clamp(v_distance / u_renderDistance, 0.0, 1.0); // Use varying distance
    gl_FragColor = vec4(v_color.rgb * brightness, v_color.a); // Use varying color
  }
`;

export default function WolfensteinDemo() {
  const [renderDistance, setRenderDistance] = useState(20.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const keysRef = useRef<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const solverRef = useRef<Solver | null>(null);
  const programInfoRef = useRef<Record<string, any>>({});
  const animationFrameRef = useRef<number>();
  const WALL_HEIGHT = 1.0;

  // Drawing function
  const drawScene = (gl: WebGLRenderingContext, solver: Solver, programInfo: Record<string, any>) => {
    resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.69, 0.75, 0.74, 1.0); // theme-light color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    const rays = solver.castRays();
    const screenWidth = gl.canvas.width;
    const screenHeight = gl.canvas.height;

    // Draw Ground and Sky
    const plainColorProgram = programInfo.plainColor;
    gl.useProgram(plainColorProgram.program);

    // Ground vertices
    const groundVertices = new Float32Array([
      0, screenHeight / 2,
      screenWidth, screenHeight / 2,
      screenWidth, screenHeight,
      0, screenHeight / 2,
      0, screenHeight,
      screenWidth, screenHeight,
    ]);

    // Sky vertices
    const skyVertices = new Float32Array([
      0, 0,
      screenWidth, 0,
      screenWidth, screenHeight / 2,
      0, 0,
      0, screenHeight / 2,
      screenWidth, screenHeight / 2,
    ]);
    
    // Create buffer info for ground and set attributes/uniforms
    const groundBufferInfo = createBufferInfoFromArrays(gl, { a_position: { numComponents: 2, data: groundVertices } });
    if(groundBufferInfo) {
      setBuffersAndAttributes(plainColorProgram.attributeSetters, groundBufferInfo);
      setUniforms(plainColorProgram.uniformSetters, { u_resolution: [screenWidth, screenHeight], u_color: [0.27, 0.45, 0.44, 1.0] }); // theme-dark color
      gl.drawArrays(gl.TRIANGLES, 0, groundBufferInfo.numElements);
    }

    // Create buffer info for sky and set attributes/uniforms
    const skyBufferInfo = createBufferInfoFromArrays(gl, { a_position: { numComponents: 2, data: skyVertices } });
    if(skyBufferInfo) {
      setBuffersAndAttributes(plainColorProgram.attributeSetters, skyBufferInfo);
      setUniforms(plainColorProgram.uniformSetters, { u_resolution: [screenWidth, screenHeight], u_color: [0.69, 0.75, 0.74, 1.0] }); // theme-light color
      gl.drawArrays(gl.TRIANGLES, 0, skyBufferInfo.numElements);
    }

    // Draw Walls
    const wallsProgram = programInfo.walls;
    gl.useProgram(wallsProgram.program);

    const wallVertices = [];
    const wallDistances = [];
    const wallColors = [];

    for (let i = 0; i < rays.length; i++) {
      const ray = rays[i];
      if (!ray || ray.cellVal === 0) continue;

      const distance = Math.max(ray.distance, 0.001);
      const lineHeight = (WALL_HEIGHT / distance) * screenHeight;
      const drawStart = screenHeight / 2 - lineHeight / 2;
      const drawEnd = screenHeight / 2 + lineHeight / 2;
      const x = (i / rays.length) * screenWidth;
      const xNext = ((i + 1) / rays.length) * screenWidth;
      
      wallVertices.push(
        x, drawStart,
        x, drawEnd,
        xNext, drawEnd,
        x, drawStart,
        xNext, drawStart,
        xNext, drawEnd
      );

      // Different colors for different wall types using theme colors
      let wallColor;
      switch (ray.cellVal) {
        case 1:
          wallColor = ray.side === 0 ? [0.69, 0.75, 0.74, 1.0] : [0.65, 0.65, 0.66, 1.0]; // theme-light and theme-mid
          break;
        case 2:
          wallColor = ray.side === 0 ? [0.47, 0.45, 0.44, 1.0] : [0.27, 0.25, 0.24, 1.0]; // theme-dark and theme-darker
          break;
        case 3:
          wallColor = ray.side === 0 ? [0.65, 0.65, 0.66, 1.0] : [0.47, 0.45, 0.44, 1.0]; // theme-mid and theme-dark
          break;
        case 4:
          wallColor = ray.side === 0 ? [0.27, 0.25, 0.24, 1.0] : [0.69, 0.75, 0.74, 1.0]; // theme-darker and theme-light
          break;
        default:
          wallColor = ray.side === 0 ? [0.69, 0.75, 0.74, 1.0] : [0.65, 0.65, 0.66, 1.0]; // theme-light and theme-mid
      }

      for(let j = 0; j < 6; j++) {
        wallDistances.push(distance);
        wallColors.push(...wallColor);
      }
    }

    if (wallVertices.length > 0) {
      const wallBufferInfo = createBufferInfoFromArrays(gl, {
        a_position: { numComponents: 2, data: new Float32Array(wallVertices) },
        a_distance: { numComponents: 1, data: new Float32Array(wallDistances) },
        a_color: { numComponents: 4, data: new Float32Array(wallColors) },
      });
      
      if(wallBufferInfo) {
        setBuffersAndAttributes(wallsProgram.attributeSetters, wallBufferInfo);
        setUniforms(wallsProgram.uniformSetters, { 
          u_resolution: [screenWidth, screenHeight], 
          u_renderDistance: renderDistance 
        });
        gl.drawArrays(gl.TRIANGLES, 0, wallBufferInfo.numElements);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
        console.error('Canvas element not found.');
        return;
    }

    try {
      // Set canvas size to match display size
      const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Reinitialize solver with new dimensions if it exists
        if (solverRef.current) {
          const newSolver = new Solver(canvas.width, canvas.height);
          // Copy player position from old solver to maintain position
          if (solverRef.current.player) {
            newSolver.player.pos = solverRef.current.player.pos;
            newSolver.player.movedir = solverRef.current.player.movedir;
            newSolver.player.lookDir = solverRef.current.player.lookDir;
          }
          solverRef.current = newSolver;
        }
      };

      // Initial resize
      resizeCanvas();

      // Handle window resize
      window.addEventListener('resize', resizeCanvas);

      const gl = loadContext(canvas);
      if (!gl) {
          console.error('Failed to obtain WebGL rendering context.');
          return;
      }
      glRef.current = gl;
      console.log('WebGL context obtained successfully.', gl);

      // Create WebGL programs using glUtil
      const plainColorProgramInfo = createProgramInfo(gl, vsSource, fsSourcePlainColor);
      const wallsProgramInfo = createProgramInfo(gl, vsSourceWalls, fsSourceWalls);
      
      if (!plainColorProgramInfo || !wallsProgramInfo) {
          console.error("Failed to create WebGL programs. Check shader source and compilation errors.");
          return;
      }
      programInfoRef.current = { plainColor: plainColorProgramInfo, walls: wallsProgramInfo };
      console.log('WebGL programs created successfully.', programInfoRef.current);

      // Initialize the Solver with the correct dimensions
      const solver = new Solver(canvas.width, canvas.height);
      // Set player to a known good position
      solver.player.pos.x = canvas.width * 0.25;
      solver.player.pos.y = canvas.height * 0.25;
      solverRef.current = solver;
      console.log('Solver instance created.', solver);

      // Animation loop
      let lastTime = 0;
      const animate = (time: number) => {
        const gl = glRef.current;
        const solver = solverRef.current;
        const programInfo = programInfoRef.current;
        if (!gl || !solver || !programInfo.plainColor || !programInfo.walls) {
             return;
        }

        const dt = (time - lastTime) * 0.001;
        lastTime = time;

        // Only execute game logic if playing
        if (isPlaying) {
          solver.executeControls(dt);
          solver.applyPlayerConstraints();
          solver.collidePlayer();
        }

        drawScene(gl, solver, programInfo);

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Start animation
      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        // Clean up WebGL context
        if (gl) {
          gl.deleteProgram(programInfoRef.current.plainColor.program);
          gl.deleteProgram(programInfoRef.current.walls.program);
        }
        window.removeEventListener('resize', resizeCanvas);
      };
    } catch (error) {
      console.error('Error initializing Wolfenstein:', error);
    }
  }, []); // Remove isPlaying from dependencies

  // Handle pointer lock changes
  useEffect(() => {
    const handlePointerLockChange = () => {
      if (!document.pointerLockElement) {
        setIsPlaying(false);
        setShowControls(false);
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  // Separate effect for handling controls
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    const solver = solverRef.current;
    if (!canvas || !solver) return;

    // Bind controls when playing starts
    solver.bindControls(canvas);
    console.log('Controls bound.');

    // Add escape key handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        document.exitPointerLock();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onClick={() => {
          if (!isPlaying) {
            setIsPlaying(true);
            setShowControls(true);
            console.log('Game activated');
            // Focus the canvas and request pointer lock
            canvasRef.current?.focus();
            canvasRef.current?.requestPointerLock();
          }
        }}
        tabIndex={0}
      />
      
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-end justify-center pb-48 bg-theme-darker/30"
          onClick={() => {
            if (!isPlaying) {
              setIsPlaying(true);
              setShowControls(true);
              console.log('Game activated');
              // Focus the canvas and request pointer lock
              canvasRef.current?.focus();
              canvasRef.current?.requestPointerLock();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl text-theme-light font-bold cursor-pointer hover:text-theme-mid transition-colors"
          >
            Click to Play
          </motion.div>
        </div>
      )}

      {showControls && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 left-4 bg-theme-darker/80 backdrop-blur-sm p-4 rounded-lg border border-theme-mid/30"
        >
          <h3 className="text-theme-light font-bold mb-2">Controls</h3>
          <ul className="text-theme-mid space-y-1">
            <li>WASD - Move</li>
            <li>Mouse - Look</li>
            <li>ESC - Pause</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
} 