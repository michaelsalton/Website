'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaYoutube, FaTiktok, FaTwitter } from 'react-icons/fa';
import { useRef } from 'react';
import NavigationArrows from './NavigationArrows';

export default function Hero() {
  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative px-4 snap-start">
      {/* Dark Grey Background */}
      <div className="absolute inset-0 bg-theme-darker/20"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 px-4"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-theme-light">
          <span className="text-theme-mid">Michael</span> Salton
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-theme-mid mb-8 px-4">
          Computer Graphics & Real-time Rendering
        </p>
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 flex-wrap">
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="/images/michaelsalton_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title="michaelsalton_resume"
            className="text-theme-accent hover:text-theme-accent/80 transition-colors text-lg"
          >
            Resume
          </motion.a>
          <div className="h-6 w-px bg-gray-600"></div>
          <motion.a
            href="https://github.com/michaelsalton"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl text-gray-300 hover:text-white transition-colors cursor-pointer relative z-10"
          >
            <FaGithub />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/michaelsalton/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl text-gray-300 hover:text-white transition-colors cursor-pointer relative z-10"
          >
            <FaLinkedin />
          </motion.a>
          <motion.a
            href="https://www.youtube.com/@MichaelSalton"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl text-gray-300 hover:text-white transition-colors cursor-pointer relative z-10"
          >
            <FaYoutube />
          </motion.a>
          <motion.a
            href="https://x.com/michaelsaltonn"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl text-gray-300 hover:text-white transition-colors cursor-pointer relative z-10"
          >
            <FaTwitter />
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

      {/* Navigation Arrows */}
      <NavigationArrows 
        onScrollUp={scrollToTop}
        onScrollDown={scrollToAbout}
        showUpArrow={false}
        showDownArrow={true}
      />

      {/* Hidden element for scroll target */}
      <div ref={aboutRef} className="absolute bottom-0" />
    </section>
  );
} 