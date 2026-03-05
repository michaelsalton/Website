import Link from 'next/link';
import { projects } from '../../src/data/projects';

export default function Projects() {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 pb-12">
      <h2 className="font-mono text-[11px] tracking-widest uppercase text-[var(--text-secondary)] mb-6">
        Recent Projects
      </h2>
      <div className="space-y-1">
        {projects.slice(0, 3).map((project) => (
          <Link
            key={project.title}
            href={project.detailUrl || project.liveUrl || project.githubUrl}
            target={project.detailUrl ? undefined : '_blank'}
            rel={project.detailUrl ? undefined : 'noopener noreferrer'}
            className="flex items-baseline gap-4 py-2 no-underline group"
          >
            <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors">
              {project.title}
            </span>
            <span className="hidden sm:block flex-1 border-b border-dotted border-[var(--border)]"></span>
            <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
              {project.technologies[0]}
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/projects"
        className="inline-block mt-4 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline"
      >
        All projects →
      </Link>
    </section>
  );
} 