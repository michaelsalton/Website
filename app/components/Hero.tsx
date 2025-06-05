'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import SimulationSelector from './SimulationSelector';
import FluidSimulation from './simulations/FluidSimulation';
import VoronoiPattern from './simulations/VoronoiPattern';
import WolfensteinDemo from './simulations/WolfensteinDemo';
import ModelViewer from './simulations/ModelViewer';

interface Simulation {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType;
}

const ModelViewerSimulation: React.FC = () => {
  return <ModelViewer modelPath="/models/leo.fbx" />;
};

const simulations: Simulation[] = [
  {
    id: 'wolfenstein',
    name: 'Wolfenstein',
    description: 'Retro-style raycasting engine',
    component: WolfensteinDemo
  },
  {
    id: 'voronoi',
    name: 'Voronoi Pattern',
    description: 'Dynamic cell patterns with color transitions',
    component: VoronoiPattern
  },
  {
    id: 'fluid',
    name: 'Fluid Simulation',
    description: 'Flowing liquid effect with turbulence',
    component: FluidSimulation
  },
  {
    id: 'model-viewer',
    name: '3D Model Viewer',
    description: 'Interactive 3D model viewer with dynamic lighting',
    component: ModelViewerSimulation
  }
];

export default function Hero() {
  const [currentSimulation, setCurrentSimulation] = useState<Simulation>(simulations[0]);
  const [showSimulation, setShowSimulation] = useState(true);
  const aboutRef = useRef<HTMLDivElement>(null);

  // Use useEffect to set random simulation after initial render
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * simulations.length);
    setCurrentSimulation(simulations[randomIndex]);
  }, []); // Empty dependency array means this runs once after mount

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const threshold = windowHeight * 0.5; // Start fading when halfway through the hero section
      
      if (scrollPosition > threshold) {
        setShowSimulation(false);
      } else {
        setShowSimulation(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative px-4">
      {/* Background Simulation */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showSimulation ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <currentSimulation.component />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-theme-light">
          <span className="text-theme-mid">Michael</span> Salton
        </h1>
        <p className="text-xl md:text-2xl text-theme-mid mb-8">
          Computer Graphics & Real-time Rendering
        </p>
        <div className="flex items-center justify-center gap-8">
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-accent hover:text-theme-accent/80 transition-colors text-lg"
          >
            Resume
          </motion.a>
          <div className="h-6 w-px bg-gray-600"></div>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://github.com/michaelsalton"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-theme-accent hover:text-theme-accent/80 transition-colors"
          >
            <FaGithub />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://linkedin.com/in/michael-salton"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-theme-accent hover:text-theme-accent/80 transition-colors"
          >
            <FaLinkedin />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://youtube.com/@michaelsalton"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-theme-accent hover:text-theme-accent/80 transition-colors"
          >
            <FaYoutube />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://tiktok.com/@michaelsalton"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-theme-accent hover:text-theme-accent/80 transition-colors"
          >
            <FaTiktok />
          </motion.a>
        </div>
      </motion.div>

      {/* Simulation Selector */}
      <div className="absolute bottom-8 left-8">
        <SimulationSelector
          simulations={simulations}
          currentSimulation={currentSimulation}
          onSelect={setCurrentSimulation}
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToAbout}
      >
        <svg 
          className="w-8 h-8 text-theme-accent/50 hover:text-theme-accent transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </motion.div>

      {/* Hidden element for scroll target */}
      <div ref={aboutRef} className="absolute bottom-0" />
    </section>
  );
} 