'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import NavigationArrows from './NavigationArrows';

// This will be replaced during build time with the actual last modified date
const LAST_MODIFIED_DATE = process.env.NODE_ENV === 'production' 
  ? 'July 5, 2025' // This will be updated by the build script
  : new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle settings
    const particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = [];
    const particleCount = 30;
    const maxSize = 2;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * maxSize + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2
      });
    }

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.1)'; // theme-accent color with low opacity
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function About() {
  const scrollToHero = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'auto' });
    }
  };

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'auto' });
    }
  };

  return (
    <section id="about" className="min-h-screen flex items-center justify-center relative px-4 bg-theme-darker/30 snap-start">
      {/* Particles background */}
      <Particles />

      <div className="max-w-3xl mx-auto relative w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-theme-light mb-8 inline-block"
            >
              About Me
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg leading-relaxed text-gray-300"
            >
              I'm currently completing my Master's degree in Computer Science at Concordia University, 
              where I focus on the intersection of computer graphics and machine learning techniques 
              for achieving photo-realism in real-time rendering.
            </motion.p>
          </div>

          <div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg leading-relaxed text-gray-300"
            >
              My research and development work centers on pushing the boundaries of visual fidelity 
              through advanced rendering techniques and AI-driven approaches, with a particular focus 
              on real-time performance optimization and novel rendering methodologies.
            </motion.p>
          </div>

          <div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-sm text-gray-400"
            >
              Last updated: {LAST_MODIFIED_DATE}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <NavigationArrows 
        onScrollUp={scrollToHero}
        onScrollDown={scrollToProjects}
        showUpArrow={true}
        showDownArrow={true}
      />


    </section>
  );
} 