'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  image: string;
  onHover: (isHovered: boolean) => void;
}

export default function ProjectCard({
  title,
  githubUrl,
  onHover,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative flex items-center"
    >
      {/* Project link with hover detection */}
      <div
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className="relative z-10 w-64"
      >
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-theme-light hover:text-theme-mid transition-colors text-lg whitespace-nowrap"
        >
          {title} →
        </a>
      </div>
    </motion.div>
  );
} 