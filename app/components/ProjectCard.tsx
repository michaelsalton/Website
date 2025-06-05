'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

interface ProjectCardProps {
  title: string;
  onHover: (isHovered: boolean) => void;
  isHovered: boolean;
}

export default function ProjectCard({
  title,
  onHover,
  isHovered,
}: ProjectCardProps) {
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      onHover(true);
    }, 250); // 250ms delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    onHover(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative flex items-center"
    >
      {/* Project title - always visible and handles hover */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-64"
      >
        {/* Title text, not a link anymore as the link is handled in Projects.tsx */}
        <div className="text-theme-light hover:text-theme-mid transition-colors text-lg whitespace-nowrap block cursor-pointer">
          {title}{isHovered && ' →'}
        </div>
      </div>
      
      {/* Removed separate Live Demo and GitHub links */}

    </motion.div>
  );
} 