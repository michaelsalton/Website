import Image from 'next/image';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';
import Navigation from '../../components/Navigation';

export const metadata = {
  title: '3D Pixel Art Engine - Michael Salton',
  description: 'An engine for creating and rendering 3D pixel art, combining retro aesthetics with modern rendering techniques.',
};

const features = [
  {
    title: 'Pixelated Camera',
    description: 'Renders to a 640×320 internal framebuffer then upscales to monitor resolution, creating a crisp retro aesthetic without blur or distortion.',
  },
  {
    title: 'Pixel-Perfect Rendering',
    description: 'Graphics align precisely with screen pixels — no interpolation artifacts. Objects appear sharp and clear at any camera position.',
  },
  {
    title: 'Sub-Pixel Camera Movement',
    description: 'Camera interpolates smoothly between pixel boundaries, eliminating jitter from discrete pixel coordinates while preserving the pixel aesthetic.',
  },
  {
    title: 'Toon Shader',
    description: 'Diffuse and specular lighting with rim lighting effects. Customizable color, glossiness, and rim intensity for full stylistic control.',
  },
  {
    title: 'Grass Shader',
    description: '2D billboard sprites over 3D terrain with wind simulation. An orthographic top-down camera samples terrain color under each grass vertex for seamless blending.',
  },
  {
    title: 'Poisson-Disc Grass Spawner',
    description: 'Grass instances distributed using Poisson-Disc Sampling for natural, gap-free coverage without regular grid artifacts.',
  },
  {
    title: 'Dynamic Day/Night Cycle',
    description: 'Real-time sky and lighting transitions with a full day-to-night cycle.',
  },
  {
    title: 'Isometric Camera & Movement',
    description: 'Isometric projection camera with matching player movement, consistent with the pixel art aesthetic.',
  },
  {
    title: 'Particle Effects',
    description: 'Custom particle system integrated into the pixelated rendering pipeline.',
  },
];

export default function PixelArtEnginePage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">

        {/* Hero */}
        <div className="relative w-full h-[40vh] md:h-[52vh] overflow-hidden">
          <Image
            src="/images/pixel.png"
            alt="3D Pixel Art Engine"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full max-w-4xl mx-auto px-6 pb-8">
            <p className="font-mono text-[11px] tracking-widest text-[var(--accent)] mb-3 uppercase">
              Graphics · C++ · Rendering
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">3D Pixel Art Engine</h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Retro Aesthetics Meets Modern Rendering Techniques
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-8 mb-12">
            <a
              href="https://github.com/michaelsalton/3D-Pixel-Art-Engine"
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
              The 3D Pixel Art Engine is a custom rendering engine that achieves a <span className="text-[var(--text-primary)]">pixel-perfect retro aesthetic</span> within a fully 3D world. Rather than simply filtering or pixelating a high-resolution render, the engine renders natively to a low-resolution internal framebuffer and upscales — preserving the integrity of the pixel grid at every stage.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The engine combines techniques like toon shading, billboard grass with terrain color sampling, Poisson-Disc object placement, and sub-pixel camera movement to create a cohesive stylized world that looks and feels like classic pixel art — but in three dimensions.
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

          {/* Tech */}
          <section className="mb-16">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Technology</h2>
            <div className="flex flex-wrap gap-2">
              {['C++', 'Rendering', 'GLSL', 'Custom Engine'].map((t) => (
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
