import Image from 'next/image';
import Link from 'next/link';
import { projects } from '../../src/data/projects';
import DottedBackground from '../components/DottedBackground';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'Projects - Michael Salton',
  description: 'A collection of projects in computer graphics, rendering, and game development.',
};

export default function ProjectsPage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">
        <div className="w-full max-w-4xl mx-auto px-6 mt-10 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Projects</h1>
          <p className="text-md text-[var(--text-secondary)] leading-relaxed">
            A collection of my work in computer graphics, rendering, and game development.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6 pb-24 space-y-12">
          {projects.map((project, index) => (
            <article key={project.title} className="border-b border-[var(--border)] pb-12 last:border-b-0">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden rounded-sm bg-[var(--bg-hover)]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
                  <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-sm border border-[var(--border)] text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] no-underline"
                      >
                        {project.githubText || 'GitHub'}
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] no-underline"
                      >
                        {project.liveText || 'Live Demo'}
                      </a>
                    )}
                    {project.paperUrl && (
                      <a
                        href={project.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] no-underline"
                      >
                        {project.paperText || 'Paper'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Back to home */}
        <div className="w-full max-w-4xl mx-auto px-6 pb-12">
          <Link
            href="/"
            className="inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </>
  );
}
