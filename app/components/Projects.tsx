'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { projects } from '../../src/data/projects';
import ProjectCard from './ProjectCard';
import SectionDivider from './SectionDivider';

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <>
      <section id="projects" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-theme-light mb-12">Projects</h2>
          
          {/* Single fixed container for project description */}
          <div className="absolute left-[calc(50%+8rem)] top-1/2 -translate-y-1/2 pointer-events-none w-[800px]">
            {projects.map((project) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredProject === project.title ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <div className="flex items-center gap-16">
                  {/* Description section */}
                  <div className="w-[400px]">
                    <p className="text-lg text-theme-mid leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-sm text-theme-mid/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.liveUrl && (
                      <div className="mt-4">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-theme-light hover:text-theme-mid transition-colors"
                        >
                          Live Demo
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Image section */}
                  <div className="relative h-48 w-96 rounded-lg overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-theme-darker/90 to-transparent" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Project names */}
          <div className="space-y-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.title} 
                {...project} 
                onHover={(isHovered) => setHoveredProject(isHovered ? project.title : null)}
              />
            ))}
          </div>
        </div>
      </section>
      <SectionDivider />
    </>
  );
} 