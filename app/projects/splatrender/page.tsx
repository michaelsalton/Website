import Image from 'next/image';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';
import Navigation from '../../components/Navigation';

export const metadata = {
  title: 'SplatRender - Michael Salton',
  description: 'A high-performance 3D Gaussian Splatting renderer implemented from scratch in C++/CUDA.',
};

const features = [
  {
    title: 'Custom CUDA Kernels',
    description: 'Hand-written rasterization kernels with memory coalescing, shared memory caching, and warp-level primitives for maximum throughput.',
  },
  {
    title: 'Tile-Based Rasterization',
    description: 'Screen divided into 16×16 tiles for parallel processing. Gaussians are bucketed per tile and sorted by depth within each.',
  },
  {
    title: 'Spherical Harmonics',
    description: 'View-dependent appearance evaluated up to degree 3, capturing directional lighting and specular-like effects.',
  },
  {
    title: 'Alpha Blending',
    description: 'Differentiable alpha composition accumulating Gaussian contributions front-to-back per tile.',
  },
  {
    title: 'PLY Model Loading',
    description: 'Load pre-trained 3DGS scenes from PLY files, including position, covariance, opacity, and SH coefficients.',
  },
  {
    title: 'Real-Time Camera',
    description: 'Interactive first-person camera controls for navigating rendered scenes at 60+ FPS.',
  },
];

const math = [
  { label: '3D Covariance', value: 'Σ = R · S · Sᵀ · Rᵀ' },
  { label: '2D Projection', value: 'Σ₂D = J · Σ₃D · Jᵀ' },
  { label: 'Alpha Blending', value: 'C = Σ αᵢ · cᵢ · ∏(1 − αⱼ), j < i' },
];

export default function SplatRenderPage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">

        {/* Hero */}
        <div className="relative w-full h-[40vh] md:h-[52vh] overflow-hidden">
          <Image
            src="/images/3dgs.png"
            alt="SplatRender"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full max-w-4xl mx-auto px-6 pb-8">
            <p className="font-mono text-[11px] tracking-widest text-[var(--accent)] mb-3 uppercase">
              Graphics · CUDA · 2024
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">SplatRender</h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              3D Gaussian Splatting Renderer from Scratch in C++/CUDA
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-8 mb-12">
            <a
              href="https://github.com/michaelsalton/SplatRender"
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
              SplatRender is a high-performance implementation of <span className="text-[var(--text-primary)]">3D Gaussian Splatting</span> built entirely from scratch in C++/CUDA — no dependencies on existing implementations. The project reconstructs the full rasterization pipeline from mathematical foundations, from 3D-to-2D Gaussian projection through to differentiable alpha compositing.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The goal was educational and research-ready: understand the algorithm at a deep level, achieve real-time 60+ FPS through custom CUDA kernels, and produce a clean codebase suitable for algorithmic extensions. Based on the original Kerbl et al. SIGGRAPH 2023 paper.
            </p>
          </section>

          {/* Features */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Features</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px border border-[var(--border)] rounded-sm overflow-hidden">
              {features.map((f) => (
                <div key={f.title} className="bg-[var(--bg-sidebar)] p-5">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Math */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Mathematical Foundations</h2>
            <div className="border border-[var(--border)] rounded-sm overflow-hidden">
              {math.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[160px_1fr] gap-4 px-5 py-4 ${i < math.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
                >
                  <span className="text-[var(--text-secondary)] font-mono text-xs pt-0.5">{row.label}</span>
                  <span className="text-[var(--text-primary)] font-mono text-sm">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section className="mb-16">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Requirements</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-[var(--border)] rounded-sm p-5">
                <p className="text-xs font-mono tracking-widest text-[var(--accent)] mb-3">HARDWARE</p>
                <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                  <li>NVIDIA GPU — Compute Capability 7.0+ (RTX 20-series or newer)</li>
                  <li>8GB+ VRAM recommended</li>
                  <li>16GB+ system RAM</li>
                </ul>
              </div>
              <div className="border border-[var(--border)] rounded-sm p-5">
                <p className="text-xs font-mono tracking-widest text-[var(--accent)] mb-3">SOFTWARE</p>
                <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                  <li>Linux</li>
                  <li>CUDA Toolkit 11.8+</li>
                  <li>GCC 9+ or Clang 10+</li>
                  <li>CMake 3.18+</li>
                </ul>
              </div>
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
