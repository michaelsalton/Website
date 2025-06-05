'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5;
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 5;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enableZoom={false} enablePan={false} />
      
      {/* Main object */}
      <mesh ref={meshRef} castShadow>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshPhysicalMaterial
          color="#6366f1"
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Lighting */}
      <directionalLight
        ref={lightRef}
        intensity={2}
        position={[5, 5, 5]}
        castShadow
      />
      <ambientLight intensity={0.5} />
      
      {/* Environment */}
      <Environment preset="sunset" />
    </>
  );
}

export default function About() {
  return (
    <>
      <section id="about" className="py-16 px-4 bg-black/20 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center gap-16"
          >
            {/* Left side - 3D Scene */}
            <div className="w-1/2 relative h-[400px]">
              <Canvas shadows>
                <Scene />
              </Canvas>
            </div>

            {/* Right side - Text */}
            <div className="w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-theme-accent">
                About Me
              </h2>
              <div className="relative">
                <p className="text-lg leading-relaxed mb-6 text-gray-300">
                  I'm currently completing my Master's degree in Computer Graphics at Concordia University, 
                  where I focus on the intersection of computer graphics and machine learning techniques 
                  for achieving photo-realism in real-time rendering.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  My research and development work centers on pushing the boundaries of visual fidelity 
                  through advanced rendering techniques and AI-driven approaches, with a particular focus 
                  on real-time performance optimization and novel rendering methodologies.
                </p>
                <div className="mt-8 text-sm text-gray-400">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
} 