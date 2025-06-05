'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { projects } from '../../src/data/projects';
import ProjectCard from './ProjectCard';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';

// New ProjectLink component
const ProjectLink = ({ url, text }: { url: string; text: string }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleClick}
      className="text-sm text-theme-mid/70 hover:text-theme-mid transition-colors px-3 py-1 border border-theme-mid/30 rounded hover:border-theme-mid cursor-pointer"
    >
      {text}
    </div>
  );
};

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Set initial hovered project to the first one
  useEffect(() => {
    if (projects.length > 0) {
      setHoveredProject(projects[0].title);
    }
  }, []);

  // Find the currently hovered project object
  const currentProject = projects.find(p => p.title === hoveredProject);

  return (
    <>
      <section id="projects" className="py-20 relative bg-theme-darker/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-theme-light mb-12">Projects</h2>
          
          {/* Project content container */}
          <div className="flex flex-col md:flex-row gap-12">
            {/* Project names */}
            <div className="space-y-6 md:w-1/4">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.title} 
                  title={project.title}
                  onHover={(isHovered) => {
                    if (isHovered) {
                      setHoveredProject(project.title);
                    } 
                  }}
                  isHovered={hoveredProject === project.title}
                />
              ))}
            </div>

            {/* Project details */}
            {currentProject && (
              <motion.div
                key={currentProject.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="md:w-3/4"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Description section */}
                  <div className="w-full md:w-1/2">
                    <p className="text-lg text-theme-mid leading-relaxed">{currentProject.description}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                      {currentProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-sm text-theme-mid/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links section */}
                    <div className="mt-4 flex gap-3">
                      {currentProject.paperUrl && (
                        <a
                          href={currentProject.paperUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-theme-mid/70 hover:text-theme-mid transition-colors px-3 py-1 border border-theme-mid/30 rounded hover:border-theme-mid cursor-pointer"
                        >
                          {currentProject.paperText || 'Paper'}
                        </a>
                      )}

                      {currentProject.liveUrl && (
                        <a
                          href={currentProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-theme-mid/70 hover:text-theme-mid transition-colors px-3 py-1 border border-theme-mid/30 rounded hover:border-theme-mid cursor-pointer"
                        >
                          {currentProject.liveText || 'Live Demo'}
                        </a>
                      )}

                      {currentProject.githubUrl && (
                        <a
                          href={currentProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-theme-mid/70 hover:text-theme-mid transition-colors px-3 py-1 border border-theme-mid/30 rounded hover:border-theme-mid cursor-pointer"
                        >
                          {currentProject.githubText || 'GitHub'}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Image section */}
                  <div className="w-full md:w-1/2 h-[250px] relative overflow-hidden rounded-lg">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-4">
                          <motion.a
                            href={currentProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-2xl text-white hover:text-theme-accent transition-colors cursor-pointer relative z-20"
                          >
                            <FaGithub />
                          </motion.a>
                          <motion.a
                            href={currentProject.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-2xl text-white hover:text-theme-accent transition-colors cursor-pointer relative z-20"
                          >
                            <FaExternalLinkAlt />
                          </motion.a>
                        </div>
                      </div>
                      <Image
                        src={currentProject.image}
                        alt={currentProject.title}
                        width={500}
                        height={300}
                        className="rounded-lg"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </>
  );
} 