'use client';

import { motion } from 'framer-motion';
import SectionDivider from './SectionDivider';

export default function About() {
  return (
    <>
      <section id="about" className="py-32 px-4 bg-black/20 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center gap-16"
          >
            {/* Left side - Image */}
            <div className="w-1/2 relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-800/50 border border-gray-700">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  [Your Image Here]
                </div>
              </div>
            </div>

            {/* Right side - Text */}
            <div className="w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-theme-accent">
                About Me
              </h2>
              <div className="relative">
                <p className="text-lg leading-relaxed mb-6 text-gray-300">
                  I'm a passionate software engineer specializing in computer graphics and real-time rendering.
                  My expertise lies in creating immersive 3D experiences and optimizing rendering pipelines
                  for maximum performance.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  When I'm not coding, you can find me exploring new rendering techniques,
                  contributing to open-source graphics projects, or sharing my knowledge
                  through technical writing and tutorials.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <SectionDivider />
    </>
  );
} 