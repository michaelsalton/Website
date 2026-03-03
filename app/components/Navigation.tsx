'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaProjectDiagram } from 'react-icons/fa';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg)] hidden md:block">
        <nav className="mx-auto max-w-4xl flex items-center justify-between px-6 h-12">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`font-mono text-[11px] tracking-widest no-underline transition-colors text-[var(--text-primary)] hover:opacity-100 ${
                pathname === '/' ? 'font-bold opacity-100' : 'opacity-40'
              }`}
            >
              HOME
            </Link>
            <Link
              href="/projects"
              className={`font-mono text-[11px] tracking-widest no-underline transition-colors text-[var(--text-primary)] hover:opacity-100 ${
                pathname === '/projects' ? 'font-bold opacity-100' : 'opacity-40'
              }`}
            >
              PROJECTS
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--bg)] md:hidden safe-bottom">
        <div className="grid h-14 px-0" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 no-underline transition-colors py-1 ${
              pathname === '/' ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
            }`}
          >
            <FaHome className="w-5 h-5" />
            <span className={`text-[9px] font-mono tracking-wider ${pathname === '/' ? 'font-bold' : ''}`}>
              HOME
            </span>
          </Link>
          <Link
            href="/projects"
            className={`flex flex-col items-center justify-center gap-0.5 no-underline transition-colors py-1 ${
              pathname === '/projects' ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
            }`}
          >
            <FaProjectDiagram className="w-5 h-5" />
            <span className={`text-[9px] font-mono tracking-wider ${pathname === '/projects' ? 'font-bold' : ''}`}>
              PROJECTS
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
