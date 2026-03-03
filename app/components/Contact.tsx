import { FaGithub, FaLinkedin, FaYoutube, FaTiktok, FaTwitter, FaEnvelope } from 'react-icons/fa';

export default function Contact() {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 pb-24">
      <h2 className="font-mono text-[11px] tracking-widest uppercase text-[var(--text-secondary)] mb-6">
        Connect
      </h2>
      <div className="flex flex-wrap items-center gap-4">
        <a
          href="https://x.com/michaelsaltonn"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline"
        >
          <FaTwitter className="w-5 h-5" />
          <span className="text-sm">X</span>
        </a>
        <a
          href="https://github.com/michaelsalton"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline"
        >
          <FaGithub className="w-5 h-5" />
          <span className="text-sm">GitHub</span>
        </a>
        <a
          href="https://www.linkedin.com/in/michaelsalton/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline"
        >
          <FaLinkedin className="w-5 h-5" />
          <span className="text-sm">LinkedIn</span>
        </a>
        <a
          href="https://www.youtube.com/@MichaelSalton"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline"
        >
          <FaYoutube className="w-5 h-5" />
          <span className="text-sm">YouTube</span>
        </a>
        <a
          href="mailto:michaeldsalton@gmail.com"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline"
        >
          <FaEnvelope className="w-5 h-5" />
          <span className="text-sm">Email</span>
        </a>
      </div>
    </section>
  );
} 