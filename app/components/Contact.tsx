'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';
import { useRef } from 'react';
import NavigationArrows from './NavigationArrows';

export default function Contact() {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'auto' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center relative px-4 bg-theme-darker/40 backdrop-blur-sm snap-start">
              <div className="max-w-4xl mx-auto text-center w-full">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-theme-accent">
          Get in Touch
        </h2>
        <p className="text-lg mb-12 text-gray-300">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
        <div className="space-y-8">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:michaeldsalton@gmail.com"
            className="inline-block bg-theme-accent/10 text-theme-accent px-8 py-4 rounded-lg font-medium border border-theme-accent/20 hover:bg-theme-accent/20 transition-all duration-300"
          >
            michaeldsalton@gmail.com
          </motion.a>
          
          <div className="flex items-center justify-center gap-6">
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
                  </div>
        </div>

        {/* Navigation Arrows */}
        <NavigationArrows 
          onScrollUp={scrollToProjects}
          onScrollDown={scrollToTop}
          showUpArrow={true}
          showDownArrow={false}
        />


      </section>
    );
  } 