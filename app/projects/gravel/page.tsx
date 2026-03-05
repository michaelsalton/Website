import Image from 'next/image';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';
import Navigation from '../../components/Navigation';

export const metadata = {
  title: 'Gravel - Michael Salton',
  description: 'Real-Time Procedural Resurfacing Using GPU Mesh Shaders — a Vulkan-based implementation of the Eurographics 2025 paper by Raad et al.',
};

const features = [
  {
    title: 'Analytical Parametric Surfaces',
    description: 'Torus, sphere, cone, cylinder, Möbius strip, Klein bottle, hyperbolic paraboloid, helicoid, and egg — all generated on-chip.',
  },
  {
    title: 'B-Spline Control Cages',
    description: 'Bicubic B-spline and Bézier surfaces with configurable degrees, streamed directly from storage buffers.',
  },
  {
    title: 'Procedural Pebbles',
    description: 'On-the-fly control cage construction with noise perturbation for realistic pebble-like geometry.',
  },
  {
    title: 'Screen-Space LOD',
    description: 'Hardware-aware mesh amplification with adaptive level-of-detail based on screen coverage.',
  },
  {
    title: 'Frustum & Back-Face Culling',
    description: 'GPU-side culling in the task shader stage to eliminate off-screen and back-facing geometry before amplification.',
  },
  {
    title: 'Control Maps',
    description: 'Per-face element type selection via texture maps, enabling mixed surface types across a single base mesh.',
  },
];

const techStack = [
  { label: 'Language', value: 'C++17 (host) · GLSL with GL_EXT_mesh_shader' },
  { label: 'Graphics API', value: 'Vulkan 1.3 with VK_EXT_mesh_shader' },
  { label: 'Shaders', value: 'glslangValidator → SPIR-V' },
  { label: 'Windowing', value: 'GLFW' },
  { label: 'Math', value: 'GLM' },
  { label: 'UI', value: 'ImGui (Vulkan backend)' },
  { label: 'Mesh Loading', value: 'OBJ loader (n-gon support)' },
  { label: 'Build', value: 'CMake 3.20+' },
];

export default function GravelPage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">

        {/* Hero */}
        <div className="relative w-full h-[40vh] md:h-[52vh] overflow-hidden">
          <Image
            src="/images/chianmail.jpg"
            alt="Gravel"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full max-w-4xl mx-auto px-6 pb-8">
            <p className="font-mono text-[11px] tracking-widest text-[var(--accent)] mb-3 uppercase">
              Graphics · Vulkan · 2026
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">Gravel</h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Real-Time Procedural Resurfacing Using GPU Mesh Shaders
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-8 mb-12">
            <a
              href="https://github.com/michaelsalton/Gravel"
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
              Gravel is a from-scratch implementation of a GPU mesh shader-based procedural resurfacing framework. It takes a base mesh and procedurally generates new geometric surfaces on-the-fly at each face using the Vulkan mesh shader pipeline — <span className="text-[var(--text-primary)]">task shader → mesh shader → fragment shader</span>.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              No traditional vertex input assembly is used. All geometry is read from storage buffers and generated entirely on-chip, enabling complex surface types — parametric patches, B-splines, procedural pebbles — at real-time frame rates with hardware-accelerated culling and LOD.
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

          {/* Pipeline */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Pipeline</h2>
            <div className="flex flex-col sm:flex-row items-stretch gap-px">
              {['Task Shader', 'Mesh Shader', 'Fragment Shader'].map((stage, i) => (
                <div key={stage} className="flex-1 flex flex-col">
                  <div className="bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-sm p-5 flex-1">
                    <p className="font-mono text-[10px] tracking-widest text-[var(--accent)] mb-2">STAGE {i + 1}</p>
                    <p className="text-sm font-semibold">{stage}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                      {i === 0 && 'Performs frustum and back-face culling. Determines amplification factor per input primitive and emits mesh shader workgroups.'}
                      {i === 1 && 'Reads base mesh data from storage buffers. Generates the resurfaced geometry on-chip — vertices, normals, UVs — without vertex input assembly.'}
                      {i === 2 && 'Shades the generated geometry with per-surface material properties, supporting both flat and smooth shading modes.'}
                    </p>
                  </div>
                  {i < 2 && (
                    <div className="hidden sm:flex items-center justify-center text-[var(--border)] text-lg px-1">→</div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Technology Stack</h2>
            <div className="border border-[var(--border)] rounded-sm overflow-hidden">
              {techStack.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[120px_1fr] gap-4 px-5 py-3 text-sm ${
                    i < techStack.length - 1 ? 'border-b border-[var(--border)]' : ''
                  }`}
                >
                  <span className="text-[var(--text-secondary)] font-mono text-xs pt-0.5">{row.label}</span>
                  <span className="text-[var(--text-primary)]">{row.value}</span>
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
                  <li>NVIDIA GPU with mesh shader support</li>
                  <li>Tested on RTX 3080 / Ampere+</li>
                  <li>Driver version 535+</li>
                </ul>
              </div>
              <div className="border border-[var(--border)] rounded-sm p-5">
                <p className="text-xs font-mono tracking-widest text-[var(--accent)] mb-3">SOFTWARE</p>
                <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                  <li>Vulkan SDK 1.3+</li>
                  <li>CMake 3.20+</li>
                  <li>C++17 compiler (GCC 9+, Clang 10+, MSVC 2019+)</li>
                  <li>glslangValidator (included with Vulkan SDK)</li>
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
