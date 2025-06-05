'use client';

import { useEffect, useRef } from 'react';

interface Props {
  fragmentShader: string;
  uniforms?: Record<string, any>;
}

export default function BaseSimulation({ fragmentShader, uniforms = {} }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameRef = useRef<number>();
  const uniformsRef = useRef(uniforms);
  const initializedRef = useRef(false);

  useEffect(() => {
    uniformsRef.current = uniforms;
  }, [uniforms]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Force initial size
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';

    const gl = canvas.getContext('webgl', {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    
    if (!gl) {
      console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }

    glRef.current = gl;

    // Create shader program
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return;
    }

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragShader) return;
    gl.shaderSource(fragShader, fragmentShader);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragShader));
        gl.deleteShader(fragShader);
        return;
    }

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return;
    }

    programRef.current = program;

    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };

    // Force initial resize
    resizeCanvas();

    let startTime = Date.now();
    const animate = () => {
      if (!initializedRef.current) {
        initializedRef.current = true;
        resizeCanvas();
      }

      gl.useProgram(program);
      const time = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeLocation, time);

      Object.entries(uniformsRef.current).forEach(([name, value]) => {
        const location = gl.getUniformLocation(program, name);
        if (location) {
          if (typeof value === 'number') {
            gl.uniform1f(location, value);
          } else if (Array.isArray(value)) {
            if (value.length === 2) {
              gl.uniform2f(location, value[0], value[1]);
            } else if (value.length === 3) {
              gl.uniform3f(location, value[0], value[1], value[2]);
            } else if (value.length === 4) {
              gl.uniform4f(location, value[0], value[1], value[2], value[3]);
            } else if (value.length === 9) {
              gl.uniformMatrix3fv(location, false, value);
            } else if (value.length === 16) {
              gl.uniformMatrix4fv(location, false, value);
            }
          }
        }
      });

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragShader);
    };
  }, [fragmentShader]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{
        width: '100vw',
        height: '100vh',
        display: 'block'
      }}
    />
  );
} 