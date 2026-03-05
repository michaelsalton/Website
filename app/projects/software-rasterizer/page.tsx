import Image from 'next/image';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';
import Navigation from '../../components/Navigation';

export const metadata = {
  title: 'Software Rasterizer - Michael Salton',
  description: 'A fully-featured 3D software rasterizer built from scratch in C++, implementing the complete rendering pipeline without hardware acceleration.',
};

const pipelineStages = [
  {
    stage: '1',
    title: 'Vertex Processing',
    description: 'Programmable vertex shaders with full MVP transformation support. Built-in shaders include Wave, Twist, Explode, and Spherize effects.',
  },
  {
    stage: '2',
    title: 'Primitive Assembly',
    description: 'Triangles, triangle strips, fans, lines, line strips, loops, and points. Efficient index buffer support for vertex reuse.',
  },
  {
    stage: '3',
    title: 'Clipping',
    description: 'Full 3D frustum clipping via Sutherland-Hodgman against all 6 planes. Proper homogeneous clipping in 4D space with attribute interpolation.',
  },
  {
    stage: '4',
    title: 'Culling',
    description: 'Configurable back-face culling with support for CCW and CW winding orders. Front, back, or no culling modes.',
  },
  {
    stage: '5',
    title: 'Rasterization',
    description: 'Sub-pixel precision with pixel centers at x+0.5, y+0.5. Perspective-correct attribute interpolation via barycentric coordinates.',
  },
  {
    stage: '6',
    title: 'Fragment Processing',
    description: 'Z-buffer depth testing, alpha blending, and per-pixel color output to a software framebuffer.',
  },
];

const features = [
  { title: 'Edge Equation Rasterizer', description: 'Efficient half-space testing — the default rasterization path.' },
  { title: 'Scanline Rasterizer', description: 'Traditional scanline-based triangle rasterization.' },
  { title: 'Hierarchical Rasterizer', description: 'Tile-based approach for improved cache coherence.' },
  { title: 'Uniform System', description: 'Pass custom parameters to vertex shaders at runtime.' },
  { title: 'Hierarchical Transforms', description: 'Parent-child scene graph with dirty-flag caching.' },
  { title: 'Camera System', description: 'Perspective and orthographic projections with look-at support.' },
];

export default function SoftwareRasterizerPage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">

        {/* Hero */}
        <div className="relative w-full h-[40vh] md:h-[52vh] overflow-hidden">
          <Image
            src="/images/link.png"
            alt="Software Rasterizer"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full max-w-4xl mx-auto px-6 pb-8">
            <p className="font-mono text-[11px] tracking-widest text-[var(--accent)] mb-3 uppercase">
              Graphics · C++ · 2023
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">Software Rasterizer</h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              A Complete 3D Rendering Pipeline in Pure Software
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-8 mb-12">
            <a
              href="https://github.com/michaelsalton/Software-Rasterizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4 py-2 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] no-underline"
            >
              GitHub →
            </a>
          </div>

          {/* Overview */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Overview</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              A fully-featured 3D software rasterizer written from scratch in C++. This project implements the <span className="text-[var(--text-primary)]">complete graphics pipeline in software</span> — no OpenGL, no DirectX, no hardware acceleration. Every stage from vertex transformation to per-pixel output is hand-coded.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The goal was to deeply understand how modern GPUs work internally by rebuilding their core algorithms: clipping, rasterization, depth buffering, perspective-correct interpolation, and programmable shaders — all running on the CPU.
            </p>
          </section>

          {/* Pipeline */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Rendering Pipeline</h2>
            <div className="space-y-px">
              {pipelineStages.map((s) => (
                <div key={s.stage} className="grid grid-cols-[48px_1fr] gap-4 bg-[var(--bg-sidebar)] border border-[var(--border)] px-5 py-4">
                  <span className="font-mono text-xs text-[var(--accent)] pt-0.5">0{s.stage}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{s.title}</p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Additional Features</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px border border-[var(--border)] rounded-sm overflow-hidden">
              {features.map((f) => (
                <div key={f.title} className="bg-[var(--bg-sidebar)] p-5">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech */}
          <section className="mb-16">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Technology</h2>
            <div className="flex flex-wrap gap-2">
              {['C++', 'SDL2', 'Software Rendering'].map((t) => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-sm border border-[var(--border)] text-[var(--text-secondary)]">{t}</span>
              ))}
            </div>
          </section>

          {/* Back */}
          <div className="pb-12">
            <Link
              href="/projects"
              className="inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline"
            >
              ← All projects
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
