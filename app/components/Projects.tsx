'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { projects } from '../../src/data/projects';
import ProjectCard from './ProjectCard';

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
      <section id="projects" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-theme-light mb-12">Projects</h2>
          
          {/* Single fixed container for project description and image */}
          <div className="absolute left-[calc(50%-10rem)] top-1/2 -translate-y-1/2 w-[800px]">
            {/* Use currentProject to display details */}
            {currentProject && (
              <motion.div
                key={currentProject.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center gap-8"
              >
                {/* Description section */}
                <div className="w-[400px]">
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

                  {/* Links section - moved after technologies */}
                  <div className="mt-4 flex gap-3">
                    {currentProject.paperUrl && (
                      <motion.a
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        href={currentProject.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-theme-mid/70 hover:text-theme-mid transition-colors px-3 py-1 border border-theme-mid/30 rounded hover:border-theme-mid"
                      >
                        {currentProject.paperText || 'Paper'}
                      </motion.a>
                    )}

                    {currentProject.liveUrl && (
                      <motion.a
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        href={currentProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-theme-mid/70 hover:text-theme-mid transition-colors px-3 py-1 border border-theme-mid/30 rounded hover:border-theme-mid"
                      >
                        {currentProject.liveText || 'Live Demo'}
                      </motion.a>
                    )}

                    {currentProject.githubUrl && (
                      <motion.a
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        href={currentProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-theme-mid/70 hover:text-theme-mid transition-colors px-3 py-1 border border-theme-mid/30 rounded hover:border-theme-mid"
                      >
                        {currentProject.githubText || 'GitHub'}
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Image section */}
                <div className="flex-shrink-0 w-[400px] h-[250px] relative overflow-hidden rounded-lg">
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-theme-darker/90 to-transparent" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Project names */}
          <div className="space-y-6">
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
        </div>
      </section>
    </>
  );
} 