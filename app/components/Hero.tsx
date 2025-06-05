'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';
import { useState, useEffect } from 'react';
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

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
            className="text-2xl text-theme-accent hover:text-theme-accent/80 transition-colors"
          >
            <FaGithub />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://linkedin.com/in/michael-salton"
            className="text-2xl text-theme-accent hover:text-theme-accent/80 transition-colors"
          >
            <FaLinkedin />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://youtube.com/@michaelsalton"
            className="text-2xl text-theme-accent hover:text-theme-accent/80 transition-colors"
          >
            <FaYoutube />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://tiktok.com/@michaelsalton"
            className="text-2xl text-theme-accent hover:text-theme-accent/80 transition-colors"
          >
            <FaTiktok />
          </motion.a>
        </div>

        {/* Simulation Selector */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: showSimulation ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <SimulationSelector
            simulations={simulations}
            currentSimulation={currentSimulation}
            onSelect={setCurrentSimulation}
          />
        </motion.div>
      </motion.div>
    </section>
  );
} 