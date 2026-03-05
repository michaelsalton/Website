import Image from 'next/image';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';
import Navigation from '../../components/Navigation';

export const metadata = {
  title: 'SlimShader - Michael Salton',
  description: 'A lightweight C++ material and shader support library built on top of SFML.',
};

const features = [
  {
    title: 'Material System',
    description: 'High-level abstraction for shaders with built-in parameter management. Wraps SFML shaders into composable, reusable material objects.',
  },
  {
    title: 'Uniform Management',
    description: 'Simplified API for setting shader uniforms — floats, vectors, textures — without manual SFML boilerplate.',
  },
  {
    title: 'Texture Caching',
    description: 'Automatic texture loading and caching system prevents redundant disk reads across materials.',
  },
  {
    title: 'RenderableObject',
    description: 'Combines SFML drawables with materials into a single object, letting you update and render in one call.',
  },
  {
    title: 'MFire Material',
    description: 'Animated procedural fire effect with customizable primary, secondary, and tertiary flame colors.',
  },
  {
    title: 'Extensible Architecture',
    description: 'Create custom materials by inheriting from the base Material class and overriding initialize() and update().',
  },
];

const codeExample = `MFire* mFire = new MFire(&textureLoader);
mFire->initialize();
mFire->setFireColors(
  sf::Glsl::Vec4(1.0f, 0.2f, 0.1f, 1.0f),  // inner
  sf::Glsl::Vec4(1.0f, 0.6f, 0.0f, 1.0f),  // mid
  sf::Glsl::Vec4(1.0f, 1.0f, 0.0f, 1.0f)   // outer
);`;

export default function SlimShaderPage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">

        {/* Hero */}
        <div className="relative w-full h-[40vh] md:h-[52vh] overflow-hidden">
          <Image
            src="/images/slimshader.gif"
            alt="SlimShader"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full max-w-4xl mx-auto px-6 pb-8">
            <p className="font-mono text-[11px] tracking-widest text-[var(--accent)] mb-3 uppercase">
              Graphics · C++ · OpenGL
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">SlimShader</h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              A Lightweight C++ Material and Shader Library for SFML
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-8 mb-12">
            <a
              href="https://github.com/michaelsalton/SlimShader"
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
              SlimShader is a C++ library that wraps SFML&#39;s shader system into a clean, object-oriented <span className="text-[var(--text-primary)]">Material abstraction</span>. Instead of manually managing shader uniforms and textures per draw call, materials encapsulate all shader state and can be applied to any SFML drawable in a single line.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The library is designed for composability — custom materials are created by inheriting from the base Material class, implementing initialize() for shader loading and update() for per-frame uniform updates.
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

          {/* Code example */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Usage</h2>
            <pre className="bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-sm p-5 overflow-x-auto text-xs text-[var(--text-secondary)] leading-relaxed font-mono">
              {codeExample}
            </pre>
          </section>

          {/* Tech */}
          <section className="mb-16">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Technology</h2>
            <div className="flex flex-wrap gap-2">
              {['C++', 'GLSL', 'SFML', 'OpenGL'].map((t) => (
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
